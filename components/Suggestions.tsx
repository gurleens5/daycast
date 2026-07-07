"use client"

import { useWeather } from "@/contexts/WeatherContext";
import { Shirt, Mountain, X, CarFront, HeartPlus } from "lucide-react";


export default function Suggestions() {
    const { insights } = useWeather();


    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 pb-4">
            <div className="shadow-sm rounded-3xl bg-gray-100  dark:bg-gray-800 dark:text-white px-4 py-4">
                <p className="flex items-center gap-2 mb-3 uppercase text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400">
                <Shirt size={15} /> 
                what to wear
                </p>
                <p className="text-sm leading-relaxed">{insights?.whatToWear}</p>
            </div>
            <div className="shadow-sm rounded-3xl bg-gray-100  dark:bg-gray-800 dark:text-white px-4 py-4">
                <p className="flex items-center gap-2 mb-3 uppercase text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                <Mountain size={15} /> 
                what to do
                </p>
                <p className="text-sm leading-relaxed">{insights?.whatToDo}</p>
            </div>
            <div className="shadow-sm rounded-3xl bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-4">
                <p className="flex items-center gap-2 mb-3 uppercase text-xs font-bold tracking-wider text-orange-600 dark:text-orange-400">
                <X size={15} /> 
                skip out on
                </p>
                <p className="text-sm leading-relaxed">{insights?.thingsToSkip}</p>
            </div>
            <div className="shadow-sm rounded-3xl bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-4">
                <p className="flex items-center gap-2 mb-3 uppercase text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400">
                <CarFront size={15} /> 
                commute heads-up
                </p>
                <p className="text-sm leading-relaxed">{insights?.commuteHeadsUp}</p>
            </div>
        </div>
        <div className="shadow-sm rounded-3xl bg-rose-200 dark:bg-rose-950 border border-rose-400 dark:border-rose-700 dark:text-white px-4 py-4">
            <p className="flex items-center gap-2 mb-3 uppercase text-xs font-bold tracking-wider text-rose-600 dark:text-rose-400">
                <HeartPlus size={15} /> 
                health alerts
            </p>
            <p className="text-sm leading-relaxed">{insights?.healthAlerts}</p>
        </div>
        </>
    )
}


