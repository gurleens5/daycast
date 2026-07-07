"use client"

import { useUnit } from "@/contexts/UnitContext";
import { useWeather } from "@/contexts/WeatherContext";

export default function Hero() {
    const {weather, city} = useWeather();
    const { unit } = useUnit();
    
    const displayTemp = (temp: number) =>
        unit === "C" ? Math.round(temp) : Math.round(temp * 9/5 + 32);
    

    return (
        <>
        {weather &&
        <div className="text-center py-8 text-white drop-shadow-md">
            <p className= "text-xl font-semibold mb-1">{city}</p>
            <p className="text-8xl ">{displayTemp(weather.current.temperature_2m)}°</p>
            <p className="text-md font-semibold mt-1">
            Feels like {displayTemp(weather.current.apparent_temperature)}°
            </p>
            <p className="text-md font-semibold mt-1">
            H: {displayTemp(weather.daily.temperature_2m_max[0])}° L: {displayTemp(weather.daily.temperature_2m_min[0])}°
            </p>
        </div>
        }
        </>
    )
}