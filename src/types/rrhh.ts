export type RrhhType = {
    //Colaboradores
    crearCollaborator: (
        idDepartamento: number,
        idEstadoColaborador: number,
        idEstadoCivil: number,
        codigo: string,
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
        ) => Promise<any>;  

    listCollaborator: () => Promise<any[]>;
    updateColaborador: (    
        idColaborador: number,
        idDepartamento: number,
        idEstadoColaborador: number,
        idEstadoCivil: number,
        codigo: string,
        dpi: string,
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
        ) => Promise<any>;
    listarEstadoColaborador: () => Promise<any>;
    listarEstadoCivil: () => Promise<any>;
    //Usuarios
    listarUser: () => Promise<any>;
    updateUser: (
        idUsuario: number,
        nombreUsuario: string,
        email: string,
        ) => Promise<any>;

    //Licencias
    listarLicencia: () => Promise<any>;
    listarTipoLicencia: () => Promise<any>;
    listarEstadoLicencia: () => Promise<any>;
    crearLicencia: ( idColaborador: number, idTipoLicencia: number, idEstadoLicencia: number, fechaInicio: Date, fechaFin: Date, observaciones: string) => Promise<any>;
    updateLicencia: ( idLicencia: number, idColaborador: number, idTipoLicencia: number, idEstadoLicencia: number, fechaInicio: Date, fechaFin: Date, observaciones: string) => Promise<any>;
    
    //Historial departamentos
    listarHistorialDepartamento: () => Promise<any>;
    listarHistorialDepartamentoColaborador: (idColaborador: number) => Promise<any>;

    //Historial licencias
    listarHistorialLicencia: () => Promise<any>;
    listarHistorialLicenciaColaborador: (idColaborador: number, fechaInicio: Date, fechaFin: Date) => Promise<any>;
    
}