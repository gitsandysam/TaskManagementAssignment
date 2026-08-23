import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

export const colors = {
  light: {
    bg: "#F7F7F8",
    card: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    primary: "#2563EB",
    danger: "#DC2626",
    border: "#E5E7EB",
  },
  dark: {
    bg: "#0F172A",
    card: "#1E293B",
    text: "#F8FAFC",
    muted: "#94A3B8",
    primary: "#60A5FA",
    danger: "#F87171",
    border: "#334155",
  },
};

const Ctx = createContext<{
  dark: boolean;
  toggle: () => void;
  palette: typeof colors.light;
} | null>(null);

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const system = useColorScheme();
  const [override, setOverride] = useState<boolean | null>(null);
  const dark = override ?? system === "dark";
  
  const value = useMemo(
    () => ({
      dark,
      toggle: () => setOverride((v) => !(v ?? dark)),
      palette: dark ? colors.dark : colors.light,
    }),
    [dark],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useTheme = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("ThemeProvider missing");
  return c;
};
