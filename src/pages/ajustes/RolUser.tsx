import React from "react";
import AuthGuard from "../../components/guards/AuthGuard";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import AsignarRolUsuario from "../../components/ajustes/RolUsuario/AsignarRolUsuario";

const UserRol = () => {

    return (
        <AuthGuard requiredRoles={["AsignarRolUsuario"]}>
            <React.Fragment>
                <Helmet title="Rol o Roles" />
                <div className="text-center">
                    <h1 className="h2">Rol que tendra el usuario</h1>
                    <p className="lead">
                        Seleccione el rol que tendra el usuario
                    </p>
                </div>
                <Card>
                    <Card.Body>
                        <div className="m-sm-3">
                            <AsignarRolUsuario />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    );
};

export default UserRol;