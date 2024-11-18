import React from "react";
import AuthGuard from "../../components/guards/AuthGuard"
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import CrearDepartamento from "../../components/rrhh/departamento/CrearDepartamento";

const Departamento = () => {
    return(
        <AuthGuard requiredRoles={["CrearDepartamentos"]}>
            <React.Fragment>
                <Helmet title="Departamento" />
                <Card>
                    <Card.Body>
                        <div className="m-sm-3">
                            <CrearDepartamento />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    )
};
export default Departamento;
