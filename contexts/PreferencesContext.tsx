"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

export const HEALTH_FACTORS = ["Pollen", "Asthma", "Fatigue Prone", "Sun Sensitive"] as const
export type HealthFactor = typeof HEALTH_FACTORS[number];

export type Preferences = {
    tempSensitivity: "runsHot" | "average" | "runsCold";
    activityPref: "indoor" | "outdoor" | "noPreference";
    healthFactors: HealthFactor[];
    clothingStyle: "casual" | "formal" | "athletic" | "noPreference";
};

const DEFAULT_PREFS: Preferences = {
    tempSensitivity: "average",
    activityPref: "noPreference",
    healthFactors: [],
    clothingStyle: "noPreference"
};

const PreferencesContext = createContext<{
    prefs: Preferences;
    setPrefs: (p: Preferences) => void;
    bannerDismissed: boolean;
    dismissBanner: () => void;
}>({ prefs: DEFAULT_PREFS, setPrefs: () => {}, bannerDismissed: true, dismissBanner: () => {} });

export function PreferencesProvider({ children }: { children: React.ReactNode}) {
    const [prefs, setPrefsState] = useState<Preferences>(DEFAULT_PREFS);
    const [bannerDismissed, setBannerDismissed] = useState(true);

    useEffect( () => {
        const saved = localStorage.getItem("daycast-prefs")
        if (saved) {
            try {
                setPrefsState(JSON.parse(saved));
            }
            catch {}
        }
        const dismissed = localStorage.getItem("daycast-banner-dismissed");
        setBannerDismissed(dismissed == "true")
        }, []);

        function setPrefs(p : Preferences) {
            localStorage.setItem("daycast-prefs", JSON.stringify(p));
            setPrefsState(p);
        }

        function dismissBanner() {
            setBannerDismissed(true)
            localStorage.setItem("daycast-banner-dismissed", "true")
        }

        return (
            <PreferencesContext.Provider value={{ prefs, setPrefs, bannerDismissed, dismissBanner }}>
                {children}
            </PreferencesContext.Provider>
        )
    
}

export const usePreferences = () => useContext(PreferencesContext);