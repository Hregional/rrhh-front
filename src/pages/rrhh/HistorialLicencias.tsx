import React from "react";
import AuthGuard from "../../components/guards/AuthGuard"
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import HistorialLicencia from "../../components/rrhh/report/historialLicencia";
const HistorialLicencias = () => {
    return (
        <AuthGuard requiredRoles={["HistorialLicencias"]}>
            <React.Fragment>
                <Helmet title="Historial de Departamentos" />
                <Card>
                    <Card.Body>
                        <div className="m-sm-3">
                            <HistorialLicencia />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    );
    }
export default HistorialLicencias;
