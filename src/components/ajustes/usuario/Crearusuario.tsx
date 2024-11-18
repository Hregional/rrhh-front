import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form, Card, Modal } from "react-bootstrap";
import useAjustes from "../../../hooks/useAjustes";
import useRrhh from "../../../hooks/useRrhh";
import { use } from "i18next";
import useAuth from "../../../hooks/useAuth";
import SelectWithVirtualization from "../../SelectWithVirtualization";
import ListUser from "./ListarUsuarios";

function CrearUsuario() {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const { listCollaborator } = useRrhh();
    const { signUp } = useAuth();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [colaboradores, setColaboradores] = useState<any[]>([]);
    const [actualizarListado, setActualizarListado] = useState(false); // Estado para forzar la actualización del componente ListarTareas


    // Manejo del modal
    const handleOpenModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    // Función para obtener colaboradores
    const obtenerColaboradores = useCallback(async () => {
        try {
            const response = await listCollaborator();
            setColaboradores(response);
        } catch (error: any) {
            setError(error.response?.data?.message || "Error fetching collaborators");
        }
    }, [listCollaborator]);

    // Ejecutar la función al montar el componente
    useEffect(() => {
        obtenerColaboradores();
    }, [obtenerColaboradores]);

    // Mapeo de opciones para el select
    const optionColaboradores = colaboradores.map(
        ({ idColaborador, nombres, primerApellido, email }) => ({
            value: idColaborador,
            label: `${nombres} ${primerApellido}`,
            email: email,
        })
    );
    return (
        <div>
        <div className="text-center">
            <h1>Usuarios</h1>
        </div>
        <div className="d-flex justify-content-end">
            <Button variant="primary" size="lg" onClick={handleOpenModal}>
                Nuevo
            </Button>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert style={{ padding: "10px" }} variant="danger">
                    Necesita seleccionar un Colaborador.
                    </Alert>
                )}
        <Formik
            initialValues={{
            nombreUsuario: "",
            email: "",
            password: "",
            idColaborador: 0,
            submit: false,
            }}
            validationSchema={Yup.object().shape({
                nombreUsuario: Yup.string()
                .max(255)
                .required("Nombre de usuario es requerido"),
            email: Yup.string()
                .email("Debe ser un correo electrónico válido")
                .max(255)
                .required("Correo electronico es requerido"),
            password: Yup.string()
                .min(6, "Debe tener al menos 12 caracteres.")
                .max(255)
                .required("Requerido"),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                await signUp(values.email, 
                    values.password, 
                    values.nombreUsuario, 
                    values.idColaborador);
                setSuccessMessage("Usuario creado, correctamente!");
                values.nombreUsuario = "";
                values.email = "";
                values.password = "";
                values.idColaborador = 0;
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
            setFieldValue,
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
                <Form.Label>Colaborador: </Form.Label>
                <SelectWithVirtualization
                    options={optionColaboradores}
                    value={
                    optionColaboradores.find(
                        (option) => option.value === values.idColaborador
                    ) ?? null
                    }
                    onChange={(selectedOption: any) => {
                    const selectedValue = selectedOption
                        ? selectedOption?.value
                        : "";
                    const selectedEmail = selectedOption ? selectedOption.email : ""; // Extrae el email
                    setFieldValue("idColaborador", selectedValue);
                    setFieldValue("email", selectedEmail); // Asigna el email al campo email

                    values.email = selectedEmail; // Asigna el email al campo email
                    }}
                />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Dirección de correo electrónico</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Dirección de correo electrónico"
                    value={values.email}
                    isInvalid={Boolean(touched.email && errors.email)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {!!touched.email && (
                    <Form.Control.Feedback type="invalid">
                    {errors.email}
                    </Form.Control.Feedback>
                )}
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Nombre Usuario</Form.Label>
                <Form.Control
                    type="text"
                    name="nombreUsuario"
                    placeholder="Nombre Usuario"
                    value={values.nombreUsuario}
                    isInvalid={Boolean(
                    touched.nombreUsuario && errors.nombreUsuario
                    )}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {!!touched.nombreUsuario && (
                    <Form.Control.Feedback type="invalid">
                    {errors.nombreUsuario}
                    </Form.Control.Feedback>
                )}
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    isInvalid={Boolean(touched.password && errors.password)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {!!touched.password && (
                    <Form.Control.Feedback type="invalid">
                    {errors.password}
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
                    Crear Usuario
                </Button>
                </div>
            </Form>
            )}
        </Formik>
        </Modal.Body>
        </Modal>
        <div className="m-sm-3">
            <ListUser actualizarListado={actualizarListado}/>
        </div>
        </div>
    );
}

export default CrearUsuario;
