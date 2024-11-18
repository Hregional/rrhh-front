import { ReactNode, useEffect } from "react";
import { apiURL } from "../utils/endpoints";
import axios from "axios";
import RrhhContext from "./RrhhContext";

function RrhhProvider({ children}: { children: ReactNode }) {
//Colaboradores
const crearCollaborator = async (
    idDepartamento: number,
    idEstadoColaborador: number,
    idEstadoCivil: number,
    codigo:string,
    dpi:string,
    nombres: string,
    primerApellido: string,
    segundoApellido: string,
    apellidoCasada: string,
    municipioExtendido: string,
    departamentoExtendido: string,
    lugarNacimiento: string,
    nacionalidad: string,
    noIGSS: string,
    noNIT: string,  
    nombreConyuge: string,
    noCuentaBancaria: string,
    telefono: string,
    direccion: string,
    email: string,
    fechaNacimiento: Date,
    fechaInicioLabores: Date,
    foto: File,
) => {
    try {
        const formData = new FormData();
        formData.append("idDepartamento", idDepartamento.toString());
        formData.append("idEstadoColaborador", idEstadoColaborador.toString());
        formData.append("idEstadoCivil", idEstadoCivil.toString());
        formData.append("codigo", codigo);
        formData.append("dpi", dpi);
        formData.append("nombres", nombres);
        formData.append("primerApellido", primerApellido);
        formData.append("segundoApellido", segundoApellido);
        formData.append("apellidoCasada", apellidoCasada);
        formData.append("municipioExtendido", municipioExtendido);
        formData.append("departamentoExtendido", departamentoExtendido);
        formData.append("lugarNacimiento", lugarNacimiento);
        formData.append("nacionalidad", nacionalidad);
        formData.append("noIGSS", noIGSS);
        formData.append("noNIT", noNIT);
        formData.append("nombreConyuge", nombreConyuge);
        formData.append("noCuentaBancaria", noCuentaBancaria);
        formData.append("telefono", telefono);
        formData.append("direccion", direccion);
        formData.append("email", email);
        formData.append("fechaNacimiento", new Date(fechaNacimiento).toISOString());
        formData.append("fechaInicioLabores", fechaInicioLabores.toISOString());
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
        const response = await axios.get(`${apiURL}/rrhh/listar`,{});
        return response.data.$values;
    } catch (error) {}
};
const listarEstadoColaborador = async () => {
    try {
        const response = await axios.get(`${apiURL}/rrhh/estadoColaborador/listar`);
        return response.data.$values;
    } catch (error) {}
}
const listarEstadoCivil = async () => {
    try {
        const response = await axios.get(`${apiURL}/rrhh/estadoCivil/listar`);
        return response.data.$values;
    } catch (error) {}
}
const updateColaborador = async (
    idColaborador: number,
    idDepartamento: number,
    idEstadoColaborador: number,
    idEstadoCivil: number,
    codigo:string,
    dpi:string,
    nombres: string,
    primerApellido: string,
    segundoApellido: string,
    apellidoCasada: string,
    municipioExtendido: string,
    departamentoExtendido: string,
    lugarNacimiento: string,
    nacionalidad: string,
    noIGSS: string,
    noNIT: string,  
    nombreConyuge: string,
    noCuentaBancaria: string,
    telefono: string,
    direccion: string,
    email: string,
    fechaNacimiento: Date,
    fechaInicioLabores: Date,
    foto: File,
) => {
    try {
        const formData = new FormData();
        formData.append("idDepartamento", idDepartamento.toString());
        formData.append("idEstadoColaborador", idEstadoColaborador.toString());
        formData.append("idEstadoCivil", idEstadoCivil.toString());
        formData.append("codigo", codigo);
        formData.append("dpi", dpi);
        formData.append("nombres", nombres);
        formData.append("primerApellido", primerApellido);
        formData.append("segundoApellido", segundoApellido);
        formData.append("apellidoCasada", apellidoCasada);
        formData.append("municipioExtendido", municipioExtendido);
        formData.append("departamentoExtendido", departamentoExtendido);
        formData.append("lugarNacimiento", lugarNacimiento);
        formData.append("nacionalidad", nacionalidad);
        formData.append("noIGSS", noIGSS);
        formData.append("noNIT", noNIT);
        formData.append("nombreConyuge", nombreConyuge);
        formData.append("noCuentaBancaria", noCuentaBancaria);
        formData.append("telefono", telefono);
        formData.append("direccion", direccion);
        formData.append("email", email);
        formData.append("fechaNacimiento", new Date(fechaNacimiento).toISOString());
        formData.append("fechaInicioLabores",new Date (fechaInicioLabores).toISOString());
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
        return response.data.$values;
        } catch (error) {
            console.log("Error, no se logro cargar los usuarios");

        }
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
        return response.data.$values;
    } catch (error) {
        console.error(
            `Error en la solicitud listar Tipo Licencia: ${error}`
        );
    }
};
const listarEstadoLicencia = async () => {
    try {
        const response = await axios.get(`${apiURL}/licencias/listar/estado`);
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
const listarLicencia = async () => {
    try {
        const response = await axios.get(`${apiURL}/licencias/listar`);
        return response.data.$values;
    } catch (error) {
        console.error(
            `Error en la solicitud listar Licencia: ${error}`
        );
    }
};
const updateLicencia = async (
    idLicencia: number,
    idColaborador: number,
    idTipoLicencia: number,
    idEstadoLicencia: number,
    fechaInicio: Date,
    fechaFin: Date,
    observaciones: string,
) => {
    try {
        console.log(idLicencia);
        const response = await axios.put(`${apiURL}/licencias/actualizar/${idLicencia}`, {
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
            `Error en la solicitud actualizar Licencia: ${error.message}`
        );
        return error;
    }
}
const listarHistorialDepartamento = async () => {
    try {
        const response = await axios.get(`${apiURL}/historialDepartamentoColaborador/listar`);
        return response.data.$values;
    } catch (error) {
        console.error(
            `Error en la solicitud listar Historial Departamento: ${error}`
        );
    }
}
const listarHistorialDepartamentoColaborador = async (idColaborador: number) => {
    try {
        const response = await axios.get(`${apiURL}/historialDepartamentoColaborador/listar/${idColaborador}`);
        return response.data.$values;
    } catch (error) {
        console.error(
            `Error en la solicitud listar Historial Departamento: ${error}`
        );
    }
}
const listarHistorialLicencia = async () => {
    try {
        const response = await axios.get(`${apiURL}/historialLicencia/listar`);
        return response.data.$values;
    } catch (error) {
        console.error(
            `Error en la solicitud listar Historial Licencia: ${error}`
        );
    }
}
const listarHistorialLicenciaColaborador = async (idColaborador: number | null, fechaInicio: Date, fechaFin: Date) => {
    try {
        const response = await axios.post(`${apiURL}/historialLicencia/listar/${idColaborador}`,{
            fechaInicio,
            fechaFin,
        });
        return response.data.$values;
    } catch (error) {
        console.error(
            `Error en la solicitud listar Historial Licencia: ${error}`
        );
    }
}

return (
<RrhhContext.Provider 
    value={{ 
        crearCollaborator,
        listCollaborator,
        listarEstadoColaborador,
        listarEstadoCivil,
        updateColaborador,
        listarUser,
        updateUser,
        listarTipoLicencia,
        listarEstadoLicencia,
        crearLicencia,
        listarLicencia,
        updateLicencia,
        listarHistorialDepartamento,
        listarHistorialDepartamentoColaborador,
        listarHistorialLicencia,
        listarHistorialLicenciaColaborador,
        }}>
    {children}
</RrhhContext.Provider>
);
}

export default RrhhProvider;