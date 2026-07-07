"use client"
import { createContext, useContext, useState } from "react";

type UnitContextType = {
  unit: "C" | "F";
  speedUnit: "km/h" | "mph";
  setUnit: (u: "C" | "F") => void;
  setSpeedUnit: (u: "km/h" | "mph") => void;
};

const UnitContext = createContext<UnitContextType>({
    unit: "C",
    speedUnit: "km/h",
    setUnit: () => {},
    setSpeedUnit: () => {},
})

export function UnitProvider({ children }: { children: React.ReactNode }) {
    const [unit, setUnit] = useState<"C" | "F">("C");
    const [speedUnit, setSpeedUnit] = useState<"km/h" | "mph">("km/h");
    return (
        <UnitContext.Provider value={{ unit, speedUnit, setUnit, setSpeedUnit }}>
            {children}
        </UnitContext.Provider>
    );

}

export const useUnit = () => useContext(UnitContext);