import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Alert } from "react-bootstrap";
import { Formik } from "formik";
import useAjuste from "../../../hooks/useAjustes";

interface UpdateTaskProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    idDepartamentos: number;
    nombreDepartamento: string;
    descripcionDepartamento: string;
    updateList: () => void;
    }

const UpdateDepartamento: React.FC<UpdateTaskProps> = ({
    setShowModal,
    idDepartamentos,
    nombreDepartamento,
    descripcionDepartamento,
    updateList,
    }) => {
    const [nuevoNombreDepartamento, setNuevoNombreDepartamento] = useState(nombreDepartamento);
    const [nuevaDescripcionDepartamento, setNuevaDescripcionDepartamento] = useState(descripcionDepartamento);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const { updateDepartamento } = useAjuste();

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
        const timer = setTimeout(() => {
            setShowSuccessMessage(false);
            setShowErrorMessage(false);
            setShowModal(false);
        }, 2000);
        return () => clearTimeout(timer);
        }
    }, [showSuccessMessage, showErrorMessage]);

    const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNuevoNombreDepartamento(event.target.value);
    };

    const handleChangeDescripcion = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNuevaDescripcionDepartamento(event.target.value);
    };

    const handleSaveChanges = async () => {
        try {
        const descripcion = nuevaDescripcionDepartamento != null ? nuevaDescripcionDepartamento : "";
        await updateDepartamento(idDepartamentos, nuevoNombreDepartamento, descripcion);
        setShowSuccessMessage(true);
        updateList();
        } catch (error) {
        console.error("Error al actualizar el modulo:", error);
        setShowErrorMessage(true);
        }
    };

    return (
        <div>
        <Modal show={true} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
            <Modal.Title>Editar Departamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                {showSuccessMessage && (
                <Alert style={{ padding: "10px" }} variant="success">
                    ¡Departamento actualizado correctamente!
                </Alert>
                )}
                {showErrorMessage && (
                <Alert style={{ padding: "10px" }} variant="danger">
                    Error al actualizar el Departamento.
                </Alert>
                )}
                <Form.Group className="mb-3">
                <Form.Label>Ingrese nuevo nombre del departamento</Form.Label>
                <Form.Control
                    size="lg"
                    type="text"
                    name="nombreDepartamento"
                    placeholder="Ingrese"
                    value={nuevoNombreDepartamento}
                    onChange={handleChangeNombre}
                />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>
                    Ingrese nueva descripcion del departamento
                </Form.Label>
                <Form.Control
                    size="lg"
                    type="text"
                    name="descripcionDepartamento"
                    placeholder="Ingrese"
                    value={nuevaDescripcionDepartamento}
                    onChange={handleChangeDescripcion}
                />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
                Guardar cambios
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
};

export default UpdateDepartamento;
