import React from "react";

import { THEME } from "../constants";

const initialState = {
  theme: THEME.DEFAULT,
  setTheme: (layout: string) => {},
};

const ThemeContext = React.createContext(initialState);

export default ThemeContext;
