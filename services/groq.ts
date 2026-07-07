import { Preferences } from "@/contexts/PreferencesContext";

export async function getSuggestions(weather: any, prefs: Preferences) {
  const res = await fetch("/api/suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weather, prefs }),
  });

  if (!res.ok) {
    console.error(`Suggestions API error: ${res.status}`);
    return null;
  }

  return res.json();
}