import React from "react";
import AuthGuard from "../../components/guards/AuthGuard";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import RolPermisos from "../../components/ajustes/RolesPermisos/RolPermisos";

const RolesPermisos = () => {
    return (
        <AuthGuard requiredRoles={["AsignarPermisosRol"]}>
            <React.Fragment>
            <Helmet title="Permisos que tendra el Rol" />
                <div className="text-center">
                    <h1 className="h2">Permisos que tendra el Rol</h1>
                    <p className="lead">
                        Seleccione los permisos que tendra el rol.
                    </p>
                </div>
                <Card>
                    <Card.Body>
                        <div className="m-sm-3">
                            <RolPermisos />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    );
}

export default RolesPermisos;