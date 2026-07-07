"use client"

import { useUnit } from "@/contexts/UnitContext";
import { useWeather } from "@/contexts/WeatherContext";
import { getUpcomingHours, getWeatherIcon } from "@/services/weather";


export default function HourlyForecast() {
    const { weather } = useWeather();
    const { unit } = useUnit();

    if (!weather) return null;

    const hours = getUpcomingHours(weather.hourly, weather.current.time,)

    const displayTemp = (temp: number) =>
        unit === "C" ? Math.round(temp) : Math.round(temp * 9/5 + 32);
    
    return (
        <div className="flex overflow-x-auto gap-7 whitespace-nowrap p-4 my-8 scrollbar-hide bg-gray-100 dark:bg-gray-800 rounded-2xl">
            {hours.map((h, i) => {
                const Icon = getWeatherIcon(h.weatherCode, h.isDay);
                const temp = i === 0 ? weather.current.temperature_2m : h.temp
                return (
                    <div key={h.time} className="flex flex-col items-center justify-center gap-1.5 shrink-0 w-12">
                        <span className="text-sm  text-gray-500 dark:text-gray-400 font-semibold">
                            {i === 0 ? "Now": new Date(h.time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}
                        </span>
                        <Icon className="w-5 h-5"/>
                        <span className="text-sm  text-gray-500 dark:text-gray-400 font-semibold">{displayTemp(temp)}°</span>
                    </div>
                )
            })}
        </div>
    )
}