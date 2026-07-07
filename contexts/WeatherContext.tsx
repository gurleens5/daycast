"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { fetchWeather } from "@/services/weather";
import { getCity } from "@/services/location";
import { getSuggestions } from "@/services/groq";
import { usePreferences } from "./PreferencesContext";


const WeatherContext = createContext<{
    weather:  any;
    coords: {lat: number, lon: number} | null;
    city: string;
    insights: any;
    loadWeather: (lat: number, lon: number) => Promise<void>;
}>({ weather: null, city: "", insights: null, coords: null, loadWeather: async () => {} });

export function WeatherProvider({ children }: { children: React.ReactNode }) {
    const [weather, setWeather] = useState<any>(null);
    const [city, setCity] = useState("");
    const [insights, setInsights] = useState<any>(null);
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const { prefs } = usePreferences();
    
    async function loadWeather(lat: number, lon: number) {
        setCoords({ lat, lon })
        const [data, cityName] = await Promise.all([
            fetchWeather(lat, lon),
            getCity(lat, lon),
        ])
        setWeather(data)
        setCity(cityName)
        const suggestions = await getSuggestions(data, prefs)
        setInsights(suggestions)
    }

    useEffect(() => {
        if (!weather) return;
        getSuggestions(weather, prefs).then(setInsights);
    }, [prefs]);

    return (
        <WeatherContext.Provider value={{ weather, coords, city, insights, loadWeather }}>
            {children}
        </WeatherContext.Provider>
    )

}


export const useWeather = () => useContext(WeatherContext);