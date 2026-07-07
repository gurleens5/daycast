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
  const {loadWeather, weather} = useWeather();

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