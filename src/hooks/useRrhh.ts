import { useContext } from "react";
import RrhhContext from "../contexts/RrhhContext";

const useRrhh = () => {
    const context = useContext(RrhhContext);
    if (!context) {
        throw new Error("useRrhh debe colocarse dentro del RrrhhProvider");
    }
    return context;
};
export default useRrhh;
