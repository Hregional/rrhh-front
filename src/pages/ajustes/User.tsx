import React from "react";
import AuthGuard from "../../components/guards/AuthGuard"
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import CrearUsuario from "../../components/ajustes/usuario/Crearusuario";

const User = () => {
    return (
    <AuthGuard requiredRoles={["CrearUsuarios"]}>
        <React.Fragment>
            <Helmet title="Usuarios" />
            <Card>
                <Card.Body>
                    <div className="m-sm-3">
                        <CrearUsuario />
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    </AuthGuard>
    );
};

export default User;