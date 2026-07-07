import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

export type HourlyForecast = {
  time: string;
  temp: number;
  rainChance: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
};

export type DailyForecast = {
  date: string;
  weatherCode: number;
  minTemp: number;
  maxTemp: number;
};


export async function fetchWeather(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_gusts_10m",
      "wind_direction_10m",
      "is_day",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
      "is_day",
      "dew_point_2m",
      "visibility",
      "uv_index",
      "precipitation_probability",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "sunrise",
      "sunset",
    ].join(","),
    forecast_days: "7",
    timezone: "auto",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const data = await res.json();
  console.log("Open-Meteo response:", data);
  
  if (!res.ok || !data.current) {
    console.error("Open-Meteo error:", data);
    throw new Error(data.reason || "Failed to fetch weather");
  }
  return data;
}

export function getWeatherDescription(code: number): string {
  const codes: Record<number, string> = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Fog", 48: "Icy Fog",
    51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Heavy Drizzle",
    56: "Freezing Drizzle", 57: "Heavy Freezing Drizzle",
    61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    66: "Light Freezing Rain", 67: "Heavy Freezing Rain",
    71: "Light Snow", 73: "Moderate Snow", 75: "Heavy Snow",
    77: "Snow Grains",
    80: "Light Showers", 81: "Moderate Showers", 82: "Heavy Showers",
    85: "Slight Snow Showers", 86: "Heavy Snow Showers",
    95: "Slight/Moderate Thunderstorm", 96: "Thunderstorm with Slight Hail", 99: "Thunderstorm with Heavy Hail",
  };

  return codes[code] || "Unknown";
  
}

export function getUpcomingHours(hourly: any, currentTime: string, hoursAhead = 24): HourlyForecast[] {
  const roundedTime = currentTime.slice(0, 14) + "00"; 
  const start = hourly.time.indexOf(roundedTime);
  if (start === -1) return []

  return hourly.time.slice(start, start + hoursAhead)
    .map((time: string, i: number) => {
      const idx = i + start
      
      return {
        time, 
        temp: hourly.temperature_2m[idx],
        condition: getWeatherDescription(hourly.weather_code[idx]),
        rainChance: hourly.precipitation_probability[idx],
      };
    } 
    );
}
  

export function getWeatherIcon(code: number, isDay: boolean): LucideIcon {
  const iconMap: Record<number, LucideIcon> = {
    0: isDay ? Sun : Moon,
    1: isDay ? Sun : Moon,
    2: isDay ? CloudSun : CloudMoon,
    3: Cloud,
    45: CloudFog,
    48: CloudFog,
    51: CloudDrizzle,
    53: CloudDrizzle,
    55: CloudDrizzle,
    56: CloudDrizzle,
    57: CloudDrizzle,
    61: CloudRain,
    63: CloudRain,
    65: CloudRain,
    66: CloudRain,
    67: CloudRain,
    71: CloudSnow,
    73: CloudSnow,
    75: CloudSnow,
    77: CloudSnow,
    80: CloudRain,
    81: CloudRain,
    82: CloudRain,
    85: CloudSnow,
    86: CloudSnow,
    95: CloudLightning,
    96: CloudLightning,
    99: CloudLightning,
  };

  return iconMap[code] || Cloud;
}

function formatDayLabel(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}


export function getUpcomingDays(daily: any): DailyForecast[] {
  return daily.time.map((day: string, i: number) => {
    const date = formatDayLabel(day);

    return {
      date,
      weatherCode: daily.weather_code[i],
      minTemp: daily.temperature_2m_min[i],
      maxTemp: daily.temperature_2m_max[i],
    }
  })
}

export function getSunsetSunrise(daily: any, currentTime: string): { label: string; time: string } {
  const sunrise = new Date(daily.sunrise[0]);
  const sunset = new Date(daily.sunset[0]);
  const now = new Date(currentTime);
  const format = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  if (now < sunrise) return { label: "Sunrise", time: format(sunrise) };
  if (now < sunset) return { label: "Sunset", time: format(sunset) };
  return { label: "Sunrise", time: format(new Date(daily.sunrise[1])) }; 
}

export function getCompassDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getUVCategory(uv: number): string {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}