import React from "react";
import AuthGuard from "../../components/guards/AuthGuard"
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import HistorialDepartamento from "../../components/rrhh/report/historialDepartamento";

const HistorialDepartamentos = () => {
    return(
        <AuthGuard requiredRoles={["HistorialDepartamento"]}>
            <React.Fragment>
                <Helmet title="Historial de Departamentos" />
                <Card>
                    <Card.Body>
                        <div className="m-sm-3">
                            <HistorialDepartamento />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    )
};
export default HistorialDepartamentos;
