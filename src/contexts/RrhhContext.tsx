import { createContext } from "react";
import { RrhhType } from "../types/rrhh";

const RrhhContext = createContext<RrhhType | null>(null);

export default RrhhContext;