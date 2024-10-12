import { ReactNode, useEffect } from "react";
import { apiURL } from "../utils/endpoints";
import axios from "axios";
import RrhhContext from "./RrhhContext";

function RrhhProvider({ children}: { children: ReactNode }) {
//Colaboradores
const crearCollaborator = async (
    idDepartamento: number,
    dpi:number,
    nombres: string,
    apellidos: string,
    telefono1: string,
    direccion: string,
    email: string,
    fechaNacimiento: string,
    foto: File,
) => {
    try {
        const formData = new FormData();
        formData.append("idDepartamento", idDepartamento.toString());
        formData.append("dpi", dpi.toString());
        formData.append("nombres", nombres);
        formData.append("apellidos", apellidos);
        formData.append("telefono1", telefono1);
        formData.append("direccion", direccion);
        formData.append("email", email);
        formData.append("fechaNacimiento", new Date(fechaNacimiento).toISOString());
        formData.append("foto", foto);
        
        const response = await axios.post(`${apiURL}/rrhh/insertar`, 
            formData
        );
        return response;
    } catch (error: any) {
        console.error(
            `Error en la solicitud crear Colaborador: ${error.message}`
        );
        return error;
    }
}
const listCollaborator = async () => {
    try {
        const response = await axios.get(`${apiURL}/rrhh/listar`);
        if (response.status === 200) {
            console.log("Listado de colaboradores");
        } else {
            console.log("Error, no se logro cargar los colaboradores");
        }
        return response.data.$values;
    } catch (error) {}
};
const updateColaborador = async (
    idColaborador: number,
    idDepartamento: number,
    dpi: number,
    nombres: string,
    apellidos: string,
    telefono1: string,
    direccion: string,
    email: string,
    fechaNacimiento: Date,
    foto: File,
) => {
    try {
        const formData = new FormData();
        formData.append("idDepartamento", idDepartamento.toString());
        formData.append("dpi", dpi.toString());
        formData.append("nombres", nombres);
        formData.append("apellidos", apellidos);
        formData.append("telefono1", telefono1);
        formData.append("direccion", direccion);
        formData.append("email", email);
        formData.append("fechaNacimiento", new Date(fechaNacimiento).toISOString());
        formData.append("foto", foto);
        const response = await axios.put(`${apiURL}/rrhh/actualizar/${idColaborador}`, 
            formData
        );
        return response;
    } catch (error: any) {
        console.error(
            `Error en la solicitud actualizar Colaborador: ${error.message}`
        );
        return error;
    }
}


const listarUser = async () => {
    try {
        const response = await axios.get(`${apiURL}/UserUser/listar`);
        if (response.status === 200) {
            // console.log("Listado de usuarios");
        } else {
            console.log("Error, no se logro cargar los usuarios");
        }
        return response.data.$values;
        } catch (error) {}
    };
const updateUser = async (
    idUsuario: number,
    nombreUsuario: string,
    email: string,
) => {
    try {
        const response = await axios.put(`${apiURL}/UserUser/actualizar/${idUsuario}`, {
        nombreUsuario,
        email,
        });
        return response;
    } catch (error: any) {
        console.error(
            `Error en la solicitud actualizar Usuario: ${error.message}`
        );
        return error;
    }
}
const listarTipoLicencia = async () => {
    try {
        const response = await axios.get(`${apiURL}/licencias/listar/tipo`);
        if (response.status === 200) {
            console.log("Listado de tipo de licencias");
        } else {
            console.log("Error, no se logro cargar los tipos de licencias");
        }
        return response.data.$values;
    } catch (error) {}
};
const listarEstadoLicencia = async () => {
    try {
        const response = await axios.get(`${apiURL}/licencias/listar/estado`);
        if (response.status === 200) {
            console.log("Listado de estado de licencias");
        } else {
            console.log("Error, no se logro cargar los estados de licencias");
        }
        return response.data.$values;
    } catch (error) {}
};
const crearLicencia = async (
    idColaborador: number,
    idTipoLicencia: number,
    idEstadoLicencia: number,
    fechaInicio: Date,
    fechaFin: Date,
    observaciones: string,
) => {
    try {
        console.log(idColaborador, idTipoLicencia, idEstadoLicencia, fechaInicio, fechaFin, observaciones);
        const response = await axios.post(`${apiURL}/licencias/crear`, {
            idColaborador,
            idTipoLicencia,
            idEstadoLicencia,
            fechaInicio: fechaInicio.toISOString(),
            fechaFin: fechaFin.toISOString(),
            observaciones,
        });
        return response;
    } catch (error: any) {
        console.error(
            `Error en la solicitud crear Licencia: ${error.message}`
        );
        return error;
    }
}
return (
<RrhhContext.Provider 
    value={{ 
        crearCollaborator,
        listCollaborator,
        updateColaborador,
        listarUser,
        updateUser,
        listarTipoLicencia,
        listarEstadoLicencia,
        crearLicencia,
        }}>
    {children}
</RrhhContext.Provider>
);
}

export default RrhhProvider;