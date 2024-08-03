import React from "react";

import { THEME } from "../constants";
import useSettingsState from "../hooks/useSettingsState";

import ThemeContext from "./ThemeContext";

interface ThemeProviderType {
  children: React.ReactNode;
}

function ThemeProvider({ children }: ThemeProviderType) {
  const [theme, setTheme] = useSettingsState("theme", THEME.DEFAULT);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
