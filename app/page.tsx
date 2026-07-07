"use client";

import { useEffect } from "react";
import { useWeather } from "@/contexts/WeatherContext";
import Suggestions from "@/components/Suggestions";
import Hero from "@/components/Hero";
import Preferences from "@/components/Preferences";
import HourlyForecast from "@/components/HourlyForecast";
import DailyDetails from "@/components/DailyDetails";
import { background } from "@/lib/background";


export default function Home() {
  const {loadWeather, weather, status, error, insights, lastLocation} = useWeather();

  useEffect(() => {
    loadWeather(43.6532, -79.3832);

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => {console.error(err) }
      );
    }
  }, []);
  
  const bgClass = weather ? background(weather.current.weather_code, weather.current.is_day === 1) : "bg-gray-100 dark:bg-gray-950"

   if (status === "error" && (!weather || !insights)) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center gap-4 transition-colors duration-700 ${bgClass}`}>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
        <button
          onClick={() => loadWeather(lastLocation.lat, lastLocation.lon)}
          className="text-sm px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          Try again in a moment
        </button>
      </main>
    );
  }

  if (!weather || !insights || status === "loading") {
    return (
      <main className={`min-h-screen flex items-center justify-center transition-colors duration-700 ${bgClass}`}>
        <p className="text-gray-500 dark:text-gray-400 text-md font-bold">Loading your weather...</p>
      </main>
    );
  }

  return (
  <main className={`min-h-screen transition-colors duration-700 ${bgClass}`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Preferences />
        <Hero />
        <Suggestions />
        <HourlyForecast />
        <DailyDetails />
      </div>
    </main>
);
}