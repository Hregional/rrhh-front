import axios from "axios";
import AjustesContext from "./AjustesContext";
import { apiURL } from "../utils/endpoints";

function AjustesProvider({ children }: { children: React.ReactNode }) {
  const crearDepartamento = async (
    nuevoDepartamento: string,
    descripcionDepartamento: string
  ) => {
    try {
      console.log(nuevoDepartamento, descripcionDepartamento);
      await axios.post(`${apiURL}/departamento/crear`, {
        nuevoDepartamento,
        descripcionDepartamento,
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
  };
  const updateDepartamento = async (
    idDepartamento: number,
    nombreDepartamento: string,
    descripcionDepartamento: string
  ) => {
    try {
      const response = await axios.put(
        `${apiURL}/departamento/actualizar/${idDepartamento}`,
        {
          nombreDepartamento,
          descripcionDepartamento,
        }
      );
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro actualizar el departamento");
      }
    } catch (error: any) {
      console.error(
        `Error en la solicitud actualizar departamento: ${error.message}`
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
  };

  const listarRolesSinPermisos = async () => {
    try {
      const response = await axios.get(`${apiURL}/rol/listarSinPermisos`);
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro cargar los roles");
      }
      return response.data.$values;
    } catch (error) {}
  };

  const updateRol = async (
    idRol: number,
    nombreRol: string,
    descripcionRol: string,
    idmodulo: number
  ) => {
    try {
      const response = await axios.put(`${apiURL}/rol/actualizar/${idRol}`, {
        nombreRol,
        descripcionRol,
        idmodulo,
      });
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro actualizar el rol");
      }
    } catch (error: any) {
      console.error(`Error en la solicitud actualizar rol: ${error.message}`);
      throw error;
    }
  };

  const listarPermisos = async () => {
    try {
      const response = await axios.get(`${apiURL}/permisos/listar`);
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro cargar los permisos");
      }
      return response.data.$values;
    } catch (error) {}
  };
  const insertarRolesPermisos = async (idRol: number, idPermiso: number) => {
    try {
      await axios.post(`${apiURL}/permisos/rol/crear`, {
        idRol,
        idPermiso,
      });
    } catch (error: any) {
      throw error;
    }
  };
  const listarRolPermisos = async () => {
    try {
      const response = await axios.get(`${apiURL}/permisos/rol/listar`);
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro cargar los roles permisos");
      }
      return response.data.$values;
    } catch (error) {}
  };
  const updateRolPermisos = async (idRol: number, nuevosPermisos: number[]) => {
    try {
      const response = await axios.put(
        `${apiURL}/permisos/rol/actualizar/${idRol}`,
        nuevosPermisos
      );
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro actualizar el rol y permisos");
      }
    } catch (error: any) {
      console.error(
        `Error en la solicitud  actualizar rol y permisos: ${error.message}`
      );
      throw error;
    }
  };

  const listarUserSinRoles = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/UserUser/listarUsuariosSinRoles`
      );
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro cargar los roles");
      }
      return response.data.$values;
    } catch (error) {}
  };
  const asignarRol = async (idUsuario: number, idRol: number) => {
    try {
      const response = await axios.post(`${apiURL}/UserRol/crear`, {
        idUsuario,
        idRol,
      });
      if (response.status === 200) {
        //console.log("Rol asignado correctamente.");
      } else {
        console.log("Error, no se logro asignar el Rol");
      }
    } catch (error: any) {
      console.log(idRol, idUsuario);
      console.error(`Error en la solicitud asignar Rol: ${error.message}`);
      throw error;
    }
  };
  const listarUserRol = async () => {
    try {
      const response = await axios.get(`${apiURL}/UserRol/listar`);
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro cargar los roles");
      }
      return response.data.$values;
    } catch (error) {}
  };
  const UpdateUserRol = async (idUsuario: number, nuevosRoles: number[]) => {
    try {
      const response = await axios.put(
        `${apiURL}/UserRol/actualizar/${idUsuario}`,
        nuevosRoles
      );
      if (response.status === 200) {
      } else {
        console.log("Error, no se logro actualizar los roles del usuario");
      }
    } catch (error: any) {
      console.error(
        `Error en la solicitud  actualizar roles: ${error.message}`
      );
      throw error;
    }
  };

  return (
    <AjustesContext.Provider
      value={{
        crearDepartamento,
        listarDepartamento,
        updateDepartamento,
        crearRol,
        listarRoles,
        listarRolesSinPermisos,
        updateRol,
        listarPermisos,
        insertarRolesPermisos,
        listarRolPermisos,
        updateRolPermisos,
        listarUserSinRoles,
        asignarRol,
        listarUserRol,
        UpdateUserRol,
      }}
    >
      {children}
    </AjustesContext.Provider>
  );
}

export default AjustesProvider;
