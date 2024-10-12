import { createContext } from "react";

import {AjustesType} from "../types/ajustes";

const AjustesContext = createContext<AjustesType | null>(null);

export default AjustesContext;