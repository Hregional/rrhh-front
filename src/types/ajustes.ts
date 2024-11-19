export type AjustesType = {
    //Departamento
    crearDepartamento: (nuevoDepartamento: string, descripcionDepartamento: string) =>Promise<void>;
    listarDepartamento: () => Promise<any[]>;
    updateDepartamento: (idDepartamento: number, nombreDepartamento: string, descripcionDepartamento: string) => Promise<void>;

    //Roles 
    crearRol: (nombreRol: string, descripcionRol: string) => Promise<void>;
    asignarRol: (idUsuario: number, idRol: number) => Promise<void>;
    listarUserRol: () => Promise<any[]>;
    UpdateUserRol: (idUsuario: number, nuevosRoles: number[]) => Promise<void>;
    listarRoles: () => Promise<any[]>;
    listarRolesSinPermisos: () => Promise<any[]>;
    listarUserSinRoles: () => Promise<any[]>;
    updateRol: (idRol: number, nombreRol:string, descripcionRol: string,  idmodulo: number) => Promise<void>;

    listarPermisos: () => Promise<any[]>;
    insertarRolesPermisos: (idRol: number, idPermiso: number) => Promise<void>;
    listarRolPermisos: () => Promise<any[]>;
    updateRolPermisos: (idRol: number, nuevosPermisos: number[]) => Promise<void>;
};
