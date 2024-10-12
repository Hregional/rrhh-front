export type AjustesType = {
    //Departamento
    crearDepartamento: (nombreModulo: string, descripcionModulo: string) =>Promise<void>;
    listarDepartamento: () => Promise<any[]>;
    updateDepartamento: (idModulos: number, nombreModulo: string, descripcionModulo: string) => Promise<void>;

    //Roles 
    crearRol: (nombreRol: string, descripcionRol: string) => Promise<void>;
    listarRoles: () => Promise<any[]>;
    updateRol: (idRol: number, nombreRol:string, descripcionRol: string,  idmodulo: number) => Promise<void>;
};
