import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Alert } from "react-bootstrap";
import { Formik } from "formik";
import useAjuste from "../../../hooks/useAjustes";

interface UpdateTaskProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    idRol: number;
    nombreRol: string;
    descripcionRol: string;
    idmodulo: number;
    updateList: () => void;
}
const UpdateRol: React.FC<UpdateTaskProps> = ({ setShowModal, idRol, nombreRol, descripcionRol, idmodulo, updateList }) => {

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [modulos, setModulo] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [nuevoNombreRol, setNuevoNombreRol] = useState(nombreRol);
    const [nuevoDescripcionRol, setNuevoDescripcionRol] = useState(descripcionRol);
    const [nuevoIdmodulo, setNuevoIdmodulo] = useState(idmodulo);
    const { updateRol, listarDepartamento } = useAjuste();

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
                setShowModal(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
        cargarDepartamentos();
    }, [showSuccessMessage, showErrorMessage])

    const cargarDepartamentos = async () => {
        try {
            const departamentos = await listarDepartamento();
            setModulo(departamentos);
        } catch (error) {
            setError("Error al cargar las tareas.");
        }
    }

    const handleSaveChanges = async () => {
        try {
            const descripcion = nuevoDescripcionRol != null ? nuevoDescripcionRol : '';
            await updateRol(idRol, nuevoNombreRol, descripcion, nuevoIdmodulo);
            setShowSuccessMessage(true);
            updateList();
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
            setShowErrorMessage(true);
        }
    };

    const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNuevoNombreRol(event.target.value);
    };
    const handleChangeDescripcion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNuevoDescripcionRol(event.target.value);
    };
    const handleChangeIdModulo = (selectedOption: any) => {
        if (selectedOption) {
            setNuevoIdmodulo(selectedOption.value); // Aquí estableces el valor seleccionado en tu estado
        } else {
            setNuevoIdmodulo(0); // En caso de que se limpie la selección, establece el valor en null o en lo que desees
        }
    };


    return (
        <Modal show={true} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Rol</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    {showSuccessMessage && <Alert style={{ padding: "10px" }} variant="success">¡Rol actualizada correctamente!</Alert>}
                    {showErrorMessage && <Alert style={{ padding: "10px" }} variant="danger">Error al actualizar el rol.</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Ingrese nuevo nombre del Rol</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            name="nombreRol"
                            placeholder="Ingrese"
                            value={nuevoNombreRol}
                            onChange={handleChangeNombre}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ingrese nueva descripcion del rol</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            name="descripcionRol"
                            placeholder="Ingrese"
                            value={nuevoDescripcionRol}
                            onChange={handleChangeDescripcion}
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Label>Seleccione el departamento al que va a pertenecer</Form.Label>
                        <Select
                            options={modulos.map(({ idModulos, nombreModulo }) => ({ value: idModulos, label: nombreModulo }))}
                            getOptionValue={(option) => option.value.toString()} // Obtener el valor de la opción
                            getOptionLabel={(option) => option.label} // Obtener la etiqueta de la opción
                            value={{ value: nuevoIdmodulo, label: modulos.find(modulo => modulo.idModulos === nuevoIdmodulo)?.nombreModulo }}
                            onChange={handleChangeIdModulo}
                            placeholder="Seleccione el departamento"
                        />



                    </Form.Group> */}

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
}

export default UpdateRol;
