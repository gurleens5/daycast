"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search, MapPin, Sun, Moon, Settings } from "lucide-react";
import { useUnit } from "@/contexts/UnitContext";
import { searchCity } from "@/services/location";
import { useWeather } from "@/contexts/WeatherContext";
import { PreferencesPanel } from "./Preferences";
import { usePreferences } from "@/contexts/PreferencesContext";


export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { unit, setUnit } = useUnit();
  const { speedUnit, setSpeedUnit } = useUnit();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const {loadWeather} = useWeather();
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { dismissBanner } = usePreferences();

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    if (e.target.value.length < 2) return setResults([]);
    const cities = await searchCity(e.target.value);
    setResults(cities);
    setShowDropdown(true);
  }

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
    <div className="sticky top-0 z-50">
    <nav className="flex items-center justify-between px-6 py-3 gap-4 text-lg border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        
        {/* Left side */}
        <div className="flex items-center gap-5">
            <span className="logo font-bold">Daycast</span>
            <button className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={18} />
            </button>
            <div className="relative md:block hidden">
                <input
                type="text"
                value={query}
                onChange={handleSearch}
                onFocus={() => {(setShowDropdown(true), setResults([]))}}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search city..."
                className="text-sm px-3 h-8 rounded-lg bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-900 dark:text-white placeholder-gray-400 w-70 outline-none"
                />
                {showDropdown && (
                    <div className="absolute top-full mt-1 w-full rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() => {
                                navigator.geolocation.getCurrentPosition(
                                    (pos) => {
                                    loadWeather(pos.coords.latitude, pos.coords.longitude);
                                    setQuery("");
                                    setShowDropdown(false);
                                    },
                                    (err) => console.error(err)
                                );
                            }}>
                            <MapPin size={14} />
                            Use my location
                        </button>

                        {results.map((city) => (
                        <button
                        key={city.id}
                        onClick={() => {
                            loadWeather(city.latitude, city.longitude);
                            setQuery("");
                            setShowDropdown(false);
                        }}
                        className="flex items-center text-left gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                        {city.name}, {city.admin1}, {city.country_code}
                        </button>
                    ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
            <button
                onClick={() => setUnit(unit === "C" ? "F" : "C")}
                className="h-8 w-10 flex items-center justify-center text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                °{unit === "C" ? "F" : "C"}
            </button>
            <button
                onClick={() => setSpeedUnit(speedUnit === "km/h" ? "mph" : "km/h")}
                className="h-8 w-10 flex items-center justify-center text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                {speedUnit === "km/h" ? "mph" : "km/h"}
            </button>
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-10 flex items-center justify-center text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
                onClick={() => setSettingsOpen(true)}
                className="h-8 w-10 flex items-center justify-center text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <Settings size={15} />
            </button>
        </div>
    </nav>
    </div>
    {searchOpen && (
        <div className="md:hidden px-5 py-2 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
                <input
                type="text"
                value={query}
                onChange={handleSearch}
                onFocus={() => {(setShowDropdown(true), setResults([]))}}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search city..."
                autoFocus
                className="w-full text-sm px-3 h-8 rounded-lg bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-900 dark:text-white placeholder-gray-400 outline-none"
                />
                {showDropdown && (
                    <div className="absolute top-full mt-1 w-full rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() => {
                                navigator.geolocation.getCurrentPosition(
                                    (pos) => {
                                    loadWeather(pos.coords.latitude, pos.coords.longitude);
                                    setQuery("");
                                    setShowDropdown(false);
                                    },
                                    (err) => console.error(err)
                                );
                            }}>
                            <MapPin size={14} />
                            Use my location
                        </button>

                        {results.map((city) => (
                        <button
                        key={city.id}
                        onClick={() => {
                            loadWeather(city.latitude, city.longitude);
                            setQuery("");
                            setShowDropdown(false);
                        }}
                        className="flex items-center text-left gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                        {city.name}, {city.admin1}, {city.country_code}
                        </button>
                    ))}
                    </div>
             )}
             </div>
        </div>
        )}
        {settingsOpen && <PreferencesPanel onClose={() => {setSettingsOpen(false); dismissBanner();}} />}
      </>
    );
}