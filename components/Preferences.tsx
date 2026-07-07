import { usePreferences, HEALTH_FACTORS } from "@/contexts/PreferencesContext";
import { X } from "lucide-react";
import { useState } from "react";

export function PreferencesPanel({ onClose }: { onClose: () => void}) {
        const {prefs, setPrefs} = usePreferences();
        const [draft, setDraft] = useState(prefs);

        function handleSave() {
            setPrefs(draft)
            onClose();
        }

        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                <div className="rounded-3xl shadow-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Personalize Daycast</h2>
                        <button onClick={onClose} aria-label="Dismiss"><X size={20} /></button>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="block mb-1 text-sm">Temperature Sensitivity</label>
                            <select 
                            className="text-sm outline-none w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2"
                            value={draft.tempSensitivity} 
                            onChange={(e) => setDraft({...draft, tempSensitivity: e.target.value as any})}
                           >
                            <option value="average">Average</option>
                            <option value="runsHot">I run hot</option>
                            <option value="runsCol">I run cold</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Activity Preference</label>
                            <select 
                            className="text-sm outline-none w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2"
                            value={draft.activityPref} 
                            onChange={(e) => setDraft({...draft, activityPref: e.target.value as any})}
                           >
                            <option value="noPreference">No preference</option>
                            <option value="indoor">Prefer indoor</option>
                            <option value="outdoor">Prefer outdoor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Clothing Style</label>
                            <select 
                            className="text-sm outline-none w-full rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2"
                            value={draft.clothingStyle} 
                            onChange={(e) => setDraft({...draft, clothingStyle: e.target.value as any})}
                           >
                            <option value="noPreference">No preference</option>
                            <option value="casual">Casual</option>
                            <option value="athletic">Athletic</option>
                            <option value="formal">Formal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">Health Factors</label>
                            <div className="grid grid-cols-3 gap-1">
                                {HEALTH_FACTORS.map((factor) => (
                                    <label key={factor} className="flex gap-1 items-center text-sm">
                                        <input 
                                            type="checkbox" 
                                            checked={draft.healthFactors.includes(factor)}
                                            onChange={(e) => {
                                                const updatedArr = e.target.checked ? [...draft.healthFactors, factor] : draft.healthFactors.filter((f) => f!== factor);
                                                setDraft({...draft, healthFactors: updatedArr});
                                            }}
                                        />
                                        {factor}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleSave} className="mt-3 w-full py-2 rounded-xl w-fullborder border border-gray-300 bg-gray-200 transition hover:translate-y-0.5 dark:border-gray-600 dark:bg-gray-700">
                                Save preferences
                        </button>
                    </div>
                </div>
            </div>
        )
} 

export default function PreferencesBanner() {
    const { bannerDismissed, dismissBanner } = usePreferences();
    const [panelOpen, setPanelOpen] = useState(false)

    if (bannerDismissed) return null

    return (
        <>
        <div className="flex items-center justify-between gap-14 rounded-lg  bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-4 text-sm w-fit">
            <button className="transition transform  hover:translate-y-0.5 text-left" onClick={() => setPanelOpen(true)}>
                Get suggesions tailored to you by setting your preferences →
            </button>
            <button className="transition transform hover:translate-y-0.5" aria-label="Dismiss" onClick={dismissBanner}><X size={16} /></button>
        </div>
        {panelOpen && <PreferencesPanel onClose={() => {setPanelOpen(false); dismissBanner(); }} />}
        </>

    )
}