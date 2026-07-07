"use client"

import { useUnit } from "@/contexts/UnitContext";
import { useWeather } from "@/contexts/WeatherContext";
import { getUpcomingDays, getWeatherIcon, getCompassDirection, getUVCategory, getSunsetSunrise } from "@/services/weather";
import { Sun, Wind, Droplet, Sunrise, Sunset, Thermometer, Eye} from "lucide-react";

function WeatherCard({
    icon: Icon,
    label,
    value,
    unit
} : {
    icon: React.ElementType;
    label: string;
    value: string | number;
    unit?: string;
}) {
    return (
        <div className="flex flex-col gap-3 p-4 rounded-2xl shadow-sm bg-gray-100 dark:bg-gray-800 h-full">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label.toUpperCase()}</span>
            </div>

            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {value}
                {unit && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
            </span>
    </div>
    );
}


export default function WeeklyView() {
    const { weather } = useWeather();
    const { unit } = useUnit();
    const { speedUnit } = useUnit();

    if (!weather) return null;

    const weekly = getUpcomingDays(weather.daily)
    const compass = getCompassDirection(weather.current.wind_direction_10m)
    const sunEvent = getSunsetSunrise(weather.daily, weather.current.time);
    const visibilityLabel = speedUnit === "km/h" ? "km" : "mi";


    const displayTemp = (temp: number) =>
        unit === "C" ? Math.round(temp) : Math.round(temp * 9/5 + 32);
    
    const displaySpeed= (speed: number) =>
        speedUnit === "km/h"? Math.round(speed) : Math.round(speed * 0.621371);

    const displayVisibility = (v: number) =>
        speedUnit === "km/h"
            ? +(v / 1000).toFixed(0)
            : +(v * 0.000621371).toFixed(0);

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-20">
            <div className="shadow-md col-span-3 md:row-span-2 md:col-span-2 rounded-2xl px-5 py-2 bg-gray-100 dark:bg-gray-800">
                {weekly.map((d, i) => {
                const Icon = getWeatherIcon(d.weatherCode, true);

               return (
                <div
                    key={d.date}
                    className={`grid grid-cols-[2fr_1fr_1fr] items-center py-2.5 ${
                        i !== weekly.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
                    }`}
                 >
                    <span className="text-base  text-gray-500 dark:text-gray-400 font-semibold text-left">
                        { i === 0 ? "Today" : d.date}
                    </span>
                    <Icon className="w-6 h-6"/>
                    <span className="text-base text-gray-500 dark:text-gray-400 font-semibold text-right">{displayTemp(d.maxTemp)}°/{displayTemp(d.minTemp)}°</span>
                </div>
                )
                })}
            </div>
            <div className="shadow-sm flex flex-col gap-5 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 row-span-2 md:row-span-1 md:col-span-2 self-start h-full col-span-2">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Wind className="w-5 h-5" />
                    <span className="text-xs font-medium">WIND</span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Wind</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {displaySpeed(weather.current.wind_speed_10m)}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{speedUnit}</span>
                    </span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Gusts</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {displaySpeed(weather.current.wind_gusts_10m)}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{speedUnit}</span>
                    </span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Direction</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {Math.round(weather.current.wind_direction_10m)}°
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{compass}</span>
                    </span>
                </div>
            </div>
            <div>
                <WeatherCard 
                    icon={Sun} 
                    label="UV Index"
                    value={weather.hourly.uv_index[0]}
                    unit={getUVCategory(weather.hourly.uv_index[0])} />
            </div>
            <div>
                <WeatherCard 
                    icon={sunEvent.label === "Sunrise" ? Sunrise : Sunset} 
                    label={sunEvent.label}
                    value={sunEvent.time} />
            </div>
            <div>
                <WeatherCard 
                    icon={Thermometer} 
                    label="Humidity"
                    value={weather.current.relative_humidity_2m} 
                    unit="%"/>
            </div>
            <div>
                <WeatherCard 
                    icon={Eye} 
                    label="Visibility"
                    value={displayVisibility(weather.hourly.visibility[0])} 
                    unit={visibilityLabel}/>
            </div>
            <div className="md:col-span-2">
                <WeatherCard 
                    icon={Droplet} 
                    label="Percipitation"
                    value={weather.current.precipitation}
                    unit="mm" />
            </div>

        </div>
    )
}
