export function background(weatherCode: number, isDay: boolean): string {
    if (weatherCode === 0 || weatherCode === 1) {
        return isDay ? "bg-gradient-to-b from-sky-400 to-white" : "bg-gradient-to-b from-indigo-950 to-slate-900";
    }
    if (weatherCode === 2) {
        return isDay ? "bg-gradient-to-b from-sky-300 to-gray-100" : "bg-gradient-to-b from-gray-900 to-gray-800";
    }
    if ([3, 45, 48].includes(weatherCode)) {
    return "bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-900";
    }

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        return "bg-gradient-to-b from-blue-400 to-gray-200 dark:from-blue-900 dark:to-gray-900";
    }

    if ([71, 73, 75].includes(weatherCode)) {
        return "bg-gradient-to-b from-blue-200 to-white dark:from-gray-800 dark:to-gray-900";
    }

    if ([95, 96, 99].includes(weatherCode)) {
        return "bg-gradient-to-b from-gray-400 to-gray-900 dark:from-gray-950 dark:to-black";
    }

    return "bg-gray-100 dark:bg-gray-950";
}