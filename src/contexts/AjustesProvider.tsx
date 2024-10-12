import axios from "axios";
import AjustesContext from "./AjustesContext";
import { apiURL } from "../utils/endpoints";


function AjustesProvider({ children } : { children: React.ReactNode }) {
    const crearDepartamento = async (nombreModulo: string, descripcionModulo: string) => {
        try {
            await axios.post(`${apiURL}/departamento/crear`, {
                nombreModulo,
                descripcionModulo,
            });
            } catch (error: any) {
            throw error;
            }
        };
    const listarDepartamento = async () => {
        try {
            const response = await axios.get(`${apiURL}/departamento/listar`);
            if (response.status === 200) {
                // console.log("Listado de departamentos");
            } else {
                console.log("Error, no se logro cargar los departamentos");
            }
            return response.data.$values;
            } catch (error) {}
        }
    const updateDepartamento = async (
        idModulos: number, 
        nombreModulo: string, 
        descripcionModulo: string) => {
            try {
                const response = await axios.put(
                `${apiURL}/departamento/actualizar/${idModulos}`,
                {
                nombreModulo,
                descripcionModulo,
                }
            );
            if (response.status === 200) {
            } else {
                console.log("Error, no se logro actualizar el modulo");
            }
            } catch (error: any) {
            console.error(
                `Error en la solicitud actualizar modulo: ${error.message}`
            );
            throw error;
            }
        };

    const crearRol = async (nombreRol: string, descripcionRol: string) => {
        try {
            await axios.post(`${apiURL}/rol/crear`, {
                nombreRol,
                descripcionRol,
            });
            } catch (error: any) {
            throw error;
            }
        };
    const listarRoles = async () => {
        try {
            const response = await axios.get(`${apiURL}/rol/listar`);
            if (response.status === 200) {
            } else {
                console.log("Error, no se logro cargar los roles");
            }
            return response.data.$values;
            } catch (error) {}
        }
    const updateRol = async (
        idRol: number, 
        nombreRol: string, 
        descripcionRol: string, 
        idmodulo: number) => {
            try {
                const response = await axios.put(
                `${apiURL}/rol/actualizar/${idRol}`,
                {
                nombreRol,
                descripcionRol,
                idmodulo,
                }
            );
            if (response.status === 200) {
            } else {
                console.log("Error, no se logro actualizar el rol");
            }
            } catch (error: any) {
            console.error(
                `Error en la solicitud actualizar rol: ${error.message}`
            );
            throw error;
            }
        }

    

return (
<AjustesContext.Provider value={{ 
    crearDepartamento,
    listarDepartamento,
    updateDepartamento,
    crearRol,
    listarRoles,
    updateRol,
    }}>
    {children}
</AjustesContext.Provider>
);

}

export default AjustesProvider;