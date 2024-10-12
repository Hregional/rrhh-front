import React, { useState, useEffect  } from 'react';
import { Modal, Button, Form, Card, Alert } from 'react-bootstrap';
import { Formik } from "formik";
import useRrhh from '../../../hooks/useRrhh';

interface UpdateTaskProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    idUsuario: number;
    nombreUsuario: string;
    email: string;
    idColaborador: number;
    updateList: () => void;
}

const UpdateUser: React.FC<UpdateTaskProps> = ({ setShowModal, idUsuario, nombreUsuario, email, idColaborador, updateList  }) => {
    
    const [nuevoUsuario, setNuevousuario] = useState(nombreUsuario);
    const [nuevoEmail, setNuevoemial] = useState(email);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const {updateUser} = useRrhh();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
                setShowModal(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage, showErrorMessage]);

    const handleChangeUsuario = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNuevousuario(event.target.value);
    };
    
    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNuevoemial(event.target.value);
    };
    

    const handleSaveChanges = async () => {
        try {
            await updateUser(idUsuario, nuevoUsuario, nuevoEmail);
            setShowSuccessMessage(true);
            updateList();
        } catch (error: any) {
            const message = error.response.data.error;
            setError(message);
            setShowErrorMessage(true);
        }
    };
    

    return (
        <Modal show={true} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form >
        
            {showSuccessMessage && <Alert style={{padding: "10px"}} variant="success">¡Usuario actualizado correctamente!</Alert>}
       
            {showErrorMessage && <Alert style={{padding: "10px"}} variant="danger">{error}</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Ingrese nuevo usuario</Form.Label>
                    <Form.Control
                        size="lg"
                        type="text"
                        name="nombreTarea"
                        placeholder="Ingrese"
                        value={nuevoUsuario}
                        onChange={handleChangeUsuario}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ingrese nuevo email</Form.Label>
                    <Form.Control
                        size="lg"
                        type="text"
                        name="nuevoEmail"
                        placeholder="Ingrese"
                        value={nuevoEmail}
                        onChange={handleChangeEmail}
                    />
                </Form.Group>
            </Form >
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
    );
};

export default UpdateUser;