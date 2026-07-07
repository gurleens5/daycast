import { getWeatherDescription, getUpcomingHours, type HourlyForecast } from "./weather";
import { Preferences } from "@/contexts/PreferencesContext";

const URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

function formatHoursForPrompt(hourly: any, currentTime: string) {
  const hours = getUpcomingHours(hourly, currentTime, 6);

  return hours
    .map((h: HourlyForecast) => {
      const hourLabel = new Date(h.time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
      return `${hourLabel}: ${h.temp}°C, ${h.condition}, ${h.rainChance}% rain`;
    })
    .join(" | ");
}


export async function getSuggestions(weather: any, prefs: Preferences) {
  const { current, daily, hourly } = weather;
  const isDayNow = current.is_day === 1;
  const currentHourIdx = hourly.time.indexOf(current.time.slice(0, 14) + "00");
  const uvNow = hourly.uv_index[currentHourIdx];

  const customization = `
  These are established and confirmed user's preferences. Use them in your suggestions and do not treat them as conditional:
    - Temperature sensitivity: ${prefs.tempSensitivity} — if "runsCold", suggest warmer layers than the weather alone implies; if "runsHot", suggest lighter layers.
    - Activity preference: ${prefs.activityPref}${prefs.activityPref !== "noPreference" ? ` — favor ${prefs.activityPref} activities in "What To Do" where the weather allows` : ""}
    - Health factors: ${prefs.healthFactors.length ? prefs.healthFactors.join(", ") : "none"}${prefs.healthFactors.length ? " — factor these into Health Alerts specifically" : ""}
    - Clothing style: ${prefs.clothingStyle}${prefs.clothingStyle !== "noPreference" ? ` — keep "What To Wear" suggestions in this style` : ""}
  `;


  const prompt = `You are DayCast, a weather lifestyle assistant. Based on the following weather data, give practical advice. Respond ONLY with valid JSON, no markdown.
  It is currently ${new Date(current.time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })} (${isDayNow ? "daytime" : "nighttime"}). Tailor your suggestions to what's relevant right now and in the next few hours. For example, don't suggest an evening walk if it's morning, and mention upcoming rain even if it's clear right now.
  ${customization}
  IMPORTANT: Reference specific times (e.g. "around 4-5 PM" not "later today") when discussing upcoming conditions, using the hourly data below. Each of the 5 sections must add DISTINCT information — do not repeat the same advice or numbers (like "stay hydrated" or "it's humid") across multiple sections. If heat/humidity is the main concern, cover it thoroughly in Health Alerts and let the other sections focus on their own specific angle (clothing choice, activity timing, things to physically avoid, commute conditions).
  Be direct and specific — skip generic openers like "given the conditions" or "it's important to." Get straight to the actionable advice. Moreoever, ensure that the "What To Do" and "Skip Out On" sections never recommend an activity and separately warn against that same activity for an overlapping time window. 
  Strict rain rules:
    - Only cite a specific rain % or specific time for rain if that exact hour appears in "Next 6 Hours" below. Never use the daily peak rain chance or daily precipitation total as if it applies to a specific hour — it only tells you the single worst hour and full-day total, not per-hour detail.
    - For anything beyond the next 6 hours, refer to rain only in general terms (e.g. "rain is possible later today") without a specific time or percentage.
    - Only mention rain/showers/thunderstorms if the hourly rain chance is above 30% for that hour. Don't infer rain from humidity or cloud cover alone.
    - Only mention flooding if today's total precipitation exceeds 15mm.
  
  Severity rules:
    - Only describe temperature as "cold" or "low" if it is below 10°C.
    - Only warn about heat exhaustion or heat-related illness if temperature exceeds 30°C or apparent_temperature (feels like) exceeds 32°C.
    - Only describe wind as "strong" or warn about gusts if wind_gusts_10m exceeds 40 km/h. 
    - Every claim in "Skip Out On" and "Health Alerts" must be justified by an actual number above. Do not invent a risk (cold, wind, flooding, etc.) that isn't supported by the data. If there's nothing meaningful to warn about, write one brief sentence acknowledging mild/calm conditions instead of manufacturing a warning.

  Current Weather (${current.is_day === 1 ? "daytime" : "nighttime"}):
    - Temperature: ${Math.round(current.temperature_2m)}°C
    - Feels like: ${Math.round(current.apparent_temperature)}°C
    - Condition:  ${getWeatherDescription(current.weather_code)}
    - Humidity: ${current.relative_humidity_2m}%
    - Wind: ${current.wind_speed_10m} km/h, gusts ${current.wind_gusts_10m} km/h
    - UV Index: ${uvNow}

  Next 6 Hours:
    ${formatHoursForPrompt(hourly, current.time)}

  Today Overall:
    - The maximum rain chance today: ${daily.precipitation_probability_max[0]}%
    - Total precipitation expected today: ${daily.precipitation_sum[0]}mm
    - Sunrise: ${new Date(daily.sunrise[0]).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
    - Sunset: ${new Date(daily.sunset[0]).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}


  Respond with this exact JSON format:
  {
    "whatToWear": "Exactly 3 sentence outfit suggestion as one string",
    "whatToDo": "Exactly 3 sentence activity suggestion as one string",
    "thingsToSkip": "Exactly 3 sentence things to avoid today as one string",
    "commuteHeadsUp": "Exactly 3 sentence commute warning or all clear as one string ",
    "healthAlerts": "Exactly 3 sentence personal health tip(s) based on weather as one string"
  }`;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    }),
  });
    if (!res.ok) {
        console.error(`Groq API error: ${res.status} ${res.statusText}`);
         console.error("retry-after:", res.headers.get("retry-after"));
        console.error("rate limit reset:", res.headers.get("x-ratelimit-reset-requests"));
        return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    try {
        return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (err) {
        console.error("Failed to parse Groq response:", text, err);
        return null;
    }

}
