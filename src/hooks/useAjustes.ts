import { useContext } from "react";
import AjustesContext from "../contexts/AjustesContext";
const useAjustes = () => {
    const context = useContext(AjustesContext);

if (!context)
    throw new Error("AjustesContext debe colocarse dentro de AjustesProvider");

return context;
};

export default useAjustes;