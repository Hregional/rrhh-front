import { Helmet } from "react-helmet-async";
import Projects from "./Projects";
import React from "react";
import { Card } from "react-bootstrap";
import CreateCollaborator from "../../components/rrhh/CreateCollaborator";
import Auth from "../../layouts/Auth";
import AuthGuard from "../../components/guards/AuthGuard";
const Colaboradores = () => {
    return (
        <AuthGuard requiredRoles={["CrearColaboradores"]}>
            <React.Fragment>
                <Helmet title="Colaboradores" />
                <Card>
                    <Card.Body>
                        <div>
                            <CreateCollaborator />
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        </AuthGuard>
    );
};

export default Colaboradores;