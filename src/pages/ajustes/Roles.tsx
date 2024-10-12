import React from "react";
import AuthGuard from "../../components/guards/AuthGuard"
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import CrearRoles from "../../components/ajustes/roles/CrearRoles";

const Roles = () => {
    return(
        <AuthGuard requiredRoles={["CrearRoles"]}>
            <React.Fragment>
                <Helmet title="Roles" />
                <Card>
                    <Card.Body>
                        <div className="m-sm-3">
                            <CrearRoles />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    )
};
export default Roles;
