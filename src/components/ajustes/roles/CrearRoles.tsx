import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form, Card, Modal } from "react-bootstrap";
import useAjustes from "../../../hooks/useAjustes";
import ListarRoles from "./ListarRoles";

function CrearRoles() {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const { crearRol } = useAjustes();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);
    const [actualizarListado, setActualizarListado] = useState(false); // Estado para forzar la actualización del componente ListarTareas
    const handleOpenModal = () => {
        setShowModal(true);
    };
    return (
        <div>
        <div className="text-center">
            <h1>Roles</h1>
        </div>
        <div className="d-flex justify-content-end">
            <Button variant="primary" size="lg" onClick={handleOpenModal}>
                Nuevo
            </Button>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Colaborador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert style={{ padding: "10px" }} variant="danger">
                    Necesita seleccionar un Departamento.
                    </Alert>
                )}
        <Formik
            initialValues={{
            nombreRol: "",
            descripcionRol: "",
            submit: false,
            }}
            validationSchema={Yup.object().shape({
            nombreRol: Yup.string().required(
                "Campo Nombre Roles es requerido"
            ),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                await crearRol(values.nombreRol, values.descripcionRol);
                setSuccessMessage("Roles creado, correctamente!");
                
                values.nombreRol = "";
                values.descripcionRol = "";
                setTimeout(() => {
                setSuccessMessage(null);
                setShowModal(false);
                }, 1000);

                setActualizarListado((prev) => !prev);
            } catch (error: any) {
                const message = error.response.data.message;
                setStatus({ success: false });
                setErrors({ submit: message });
                setSubmitting(false);
            }
            }}
        >
            {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            }) => (
            <Form onSubmit={handleSubmit}>
                {errors.submit && (
                <Alert className="my-3" variant="danger">
                    <div className="alert-message">{errors.submit}</div>
                </Alert>
                )}

                {error && (
                <Alert className="my-3" variant="danger">
                    <div className="alert-message">{error}</div>
                </Alert>
                )}

                {successMessage && (
                <Alert className="my-3" variant="success">
                    <div className="alert-message">{successMessage}</div>
                </Alert>
                )}

                <Form.Group className="mb-3">
                <Form.Label>Ingrese Nombre Roles</Form.Label>
                <Form.Control
                    size="lg"
                    type="text"
                    name="nombreRol"
                    placeholder="Ingrese Nombre Roles"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nombreRol}
                    isInvalid={Boolean(touched.nombreRol && errors.nombreRol)}
                />
                {!!touched.nombreRol && (
                    <Form.Control.Feedback type="invalid">
                    {errors.nombreRol}
                    </Form.Control.Feedback>
                )}
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Ingrese Descripcion del Roles (opcional)</Form.Label>
                <Form.Control
                    size="lg"
                    as="textarea"
                    name="descripcionRol"
                    placeholder="Descripcion de Rol"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.descripcionRol}
                    isInvalid={Boolean(
                    touched.descripcionRol && errors.descripcionRol
                    )}
                />
                {!!touched.descripcionRol && (
                    <Form.Control.Feedback type="invalid">
                    {errors.descripcionRol}
                    </Form.Control.Feedback>
                )}
                </Form.Group>

                <div className="d-grid gap-2 mt-3">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                >
                    Crear Roles
                </Button>
                </div>
            </Form>
            )}
        </Formik>
        </Modal.Body>
        </Modal>
        <div className="m-sm-3">
            <ListarRoles actualizarListado={actualizarListado} />
        </div>
        </div>
    );
}

export default CrearRoles;
