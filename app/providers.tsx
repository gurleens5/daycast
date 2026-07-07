"use client";

import { ThemeProvider } from "next-themes";
import { UnitProvider } from "@/contexts/UnitContext";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PreferencesProvider>
        <WeatherProvider>
        <UnitProvider>
          {children}
        </UnitProvider>
      </WeatherProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}