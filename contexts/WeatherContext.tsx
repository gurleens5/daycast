"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { fetchWeather } from "@/services/weather";
import { getCity } from "@/services/location";
import { getSuggestions } from "@/services/groq";
import { usePreferences } from "./PreferencesContext";

type Status = "idle" | "loading" | "success" | "error";

const WeatherContext = createContext<{
    weather:  any;
    coords: {lat: number, lon: number} | null;
    city: string;
    insights: any;
    status: Status;
    error: string| null;
    lastLocation: {lat: number; lon: number};
    loadWeather: (lat: number, lon: number) => Promise<void>;
}>({ 
    weather: null, 
    city: "", 
    insights: null, 
    coords: null, 
    status: "idle",
    error: "null",
    lastLocation: { lat: 43.6532, lon: -79.3832 },
    loadWeather: async () => {} });

export function WeatherProvider({ children }: { children: React.ReactNode }) {
    const [weather, setWeather] = useState<any>(null);
    const [city, setCity] = useState("");
    const [insights, setInsights] = useState<any>(null);
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const { prefs } = usePreferences();
    const [lastLocation, setLastLocation] = useState({lat: 43.6532, lon: -79.3832});
    
    async function loadWeather(lat: number, lon: number) {
        setLastLocation({lat, lon});
        setCoords({lat, lon});
        setStatus("loading");
        setInsights(null)
        setError(null);
        
        try {
            const [data, cityName] = await Promise.all([
            fetchWeather(lat, lon),
            getCity(lat, lon),
            ])
            setWeather(data)
            setCity(cityName)
            
            let suggestions = await getSuggestions(data, prefs);
            if (!suggestions) {
                await new Promise((r) => setTimeout(r, 1500));
                suggestions = await getSuggestions(data, prefs);
            }
            if (suggestions) {
                setInsights(suggestions);
                setStatus("success");
            } else {
                setStatus("error");
            }
            
            setInsights(suggestions);
            setStatus(suggestions ? "success" : "error");
        
        } catch (err) {
            setError("Couldn't load weather right now. Please try again.");
            setStatus("error");
        }
    }

    useEffect(() => {
        if (!weather) return;
        getSuggestions(weather, prefs)
        .then((suggestions) => {
           if (suggestions)  setInsights(suggestions);
        })
        .catch((err) => console.error("Failed to refresh suggestions:", err))
    }, [prefs]);

    return (
        <WeatherContext.Provider value={{ weather, coords, city, insights, status, error, lastLocation, loadWeather }}>
            {children}
        </WeatherContext.Provider>
    )

}


export const useWeather = () => useContext(WeatherContext);