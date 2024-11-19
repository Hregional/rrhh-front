import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Card, Alert, Accordion } from "react-bootstrap";
import { Formik } from "formik";
import { Search } from "react-feather";
import useAjustes from "../../../hooks/useAjustes";

interface UpdateUserRolProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    idUsuario: number;
    rolList: any[];
    updateList: () => void;
  }
const UpdateUserRol: React.FC<UpdateUserRolProps> = ({
    setShowModal,
    idUsuario,
    rolList,
    updateList,
  }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const {
    listarRoles,
    listarUserRol,
    UpdateUserRol,
  } = useAjustes();
  const [error, setError] = useState<string | null>(null);

  const [nuevoidUsuario, setnuevoIdUsuario] = useState(idUsuario);
  const [rolUsuario, setRolUsuario] = useState<any[]>([]);
    const [usuario, setUsuario] = useState<any[]>([]);

  const [filters, setFilters] = useState<{ [key: string]: string }>({
    nombreRol: "",
  });

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
        setShowModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    obtenerUserRol();
  }, [showSuccessMessage, showErrorMessage]);

  const obtenerUserRol = async () => {
    try {
      const roles = await listarRoles();
      const rolesConUsuario = roles.map((rol: any) => ({
        ...rol,
        checked: rolList.some(
          (lp: any) => lp.idRole === rol.idRole
        ),
      }));
        setRolUsuario(rolesConUsuario);
        const usuarios = await listarUserRol();
        setUsuario(usuarios);

    } catch (error) {
      setError("Error al cargar el usuario y roles.");
    }
  };

  const handleChangeRol = (idRole: number, checked: boolean) => {
    const nuevosRol = rolUsuario.map((rol) =>
      rol.idRole === idRole ? { ...rol, checked } : rol
    );
    setRolUsuario(nuevosRol);
  };

  const handleSaveChanges = async () => {
    try {
      // Filtrar los permisos marcados
      const nuevosRoles = rolUsuario
        .filter((rol) => rol.checked)
        .map((rol) => rol.idRole);
        console.log(nuevosRoles);
       await UpdateUserRol(nuevoidUsuario, nuevosRoles);

      updateList();
      setShowSuccessMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
    }
  };
  const filteredTasks = rolUsuario.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key].toLowerCase().includes(filters[key].toLowerCase())
    )
  );
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);
    return (
      <div>
      <Modal
        show={true}
        onHide={() => setShowModal(false)}
        centered
        className="modal-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Roles de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {showSuccessMessage && (
              <Alert style={{ padding: "10px" }} variant="success">
                ¡Roles actualizados correctamente!
              </Alert>
            )}
            {showErrorMessage && (
              <Alert style={{ padding: "10px" }} variant="danger">
                Error al actualizar los roles.
              </Alert>
            )}
            <Form.Group className="mb-3">
              <span style={{fontWeight: "bold"}}>Nombre Usuario</span>
              <Form.Control
                size="lg"
                type="text"
                name="nombreUsuario"
                placeholder="Ingrese"
                defaultValue={
                  usuario.find(
                    (usuario) => usuario.idUsuario === nuevoidUsuario
                  )?.nombreUsuario
                }
                disabled
              />
              <br />
              <div className="filtro-check">
                <div className="search-icon">
                  <Search />
                </div>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por nombre"
                  value={filters.nombreRol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("nombreRol", e.target.value)
                  }
                />
              </div>
              <br />
              <span style={{fontWeight: "bold"}}>Roles: <br/><br/></span>
              
              {filteredTasks && filteredTasks.length > 0 && (
                <Form.Group className="mb-2 row">
                  {filteredTasks.map((rol, index) => (
                    <div key={index} className="col-sm-6 col-md-2 col-lg-3">
                      <Form.Check
                        inline
                        label={rol.nombreRol}
                        type="checkbox"
                        name={`rolEditar2_${index}`}
                        id={`rolEditar2_${index}`}
                        value={rol.idRole}
                        checked={rol.checked}
                        onChange={(e) =>
                          handleChangeRol(
                            rol.idRole,
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  ))}
                </Form.Group>
              )}
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
    )
  }
export default UpdateUserRol;