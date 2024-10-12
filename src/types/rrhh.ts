export type RrhhType = {
    //Colaboradores
    crearCollaborator: (
        idDepartamento: number,
        dpi:number,
        nombres: string,
        apellidos: string,
        telefono1: string,
        direccion: string,
        email: string,
        fechaNacimiento: string,
        foto: File,
        ) => Promise<any>;  

    listCollaborator: () => Promise<any[]>;
    updateColaborador: (    
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
        ) => Promise<any>;
    //Usuarios
    listarUser: () => Promise<any>;
    updateUser: (
        idUsuario: number,
        nombreUsuario: string,
        email: string,
        ) => Promise<any>;

    //Licencias
    listarTipoLicencia: () => Promise<any>;
    listarEstadoLicencia: () => Promise<any>;
    crearLicencia: ( idColaborador: number, idTipoLicencia: number, idEstadoLicencia: number, fechaInicio: Date, fechaFin: Date, observaciones: string) => Promise<any>;
}