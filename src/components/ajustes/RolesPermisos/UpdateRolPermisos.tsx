import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Card, Alert, Accordion } from "react-bootstrap";
import { Formik } from "formik";
import useAjustes from "../../../hooks/useAjustes";
import { Search } from "react-feather";

interface UpdateModuloPermisosProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    idRol: number;
    listPermisos: any[];
    updateList: () => void;
  }
const UpdateRolPermiso: React.FC<UpdateModuloPermisosProps> = ({
    setShowModal,
    idRol,
    listPermisos,
    updateList,
  }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const {
    updateRolPermisos,
    listarRoles,
    listarPermisos,
    listarRolPermisos,
  } = useAjustes();
  const [error, setError] = useState<string | null>(null);

  const [nuevoIdRol, setnuevoIdRol] = useState(idRol);
  const [rol, setRol] = useState<any[]>([]);
  const [rolPermiso, setRolPermiso] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    nombrePermiso: "",
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
    obtenerRolPermisos();
  }, [showSuccessMessage, showErrorMessage]);

  const obtenerRolPermisos = async () => {
    try {
      const permisos = await listarPermisos();
      const permisosConEstado = permisos.map((permiso: any) => ({
        ...permiso,
        checked: listPermisos.some(
          (lp: any) => lp.idPermiso === permiso.idPermiso
        ),
      }));
      setRolPermiso(permisosConEstado);

      const roles = await listarRoles();
      setRol(roles);

    } catch (error) {
      setError("Error al cargar el departamento y permisos.");
    }
  };

  const handleChangePermiso = (idPermiso: number, checked: boolean) => {
    const nuevosPermisos = rolPermiso.map((permiso) =>
      permiso.idPermiso === idPermiso ? { ...permiso, checked } : permiso
    );
    setRolPermiso(nuevosPermisos);
  };

  const handleSaveChanges = async () => {
    try {
      // Filtrar los permisos marcados
      const nuevosPermisos = rolPermiso
        .filter((permiso) => permiso.checked)
        .map((permiso) => permiso.idPermiso);

      await updateRolPermisos(nuevoIdRol, nuevosPermisos);

      updateList();
      setShowSuccessMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
    }
  };

  const filteredTasks = rolPermiso.filter((item) =>
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
          <Modal.Title>Editar Departamento y Permisos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {showSuccessMessage && (
              <Alert style={{ padding: "10px" }} variant="success">
                ¡Permisos actualizados correctamente!
              </Alert>
            )}
            {showErrorMessage && (
              <Alert style={{ padding: "10px" }} variant="danger">
                Error al actualizar los permisos.
              </Alert>
            )}
            <Form.Group className="mb-3">
              <span style={{fontWeight: "bold"}}>Nombre Rol</span>
              <Form.Control
                size="lg"
                type="text"
                name="nombreRol"
                placeholder="Ingrese"
                defaultValue={
                  rol.find(
                    (rol) => rol.idRole === nuevoIdRol
                  )?.nombreRol
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
                  value={filters.nombrePermiso}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("nombrePermiso", e.target.value)
                  }
                />
              </div>
              <br />
              <span style={{fontWeight: "bold"}}>Permisos: <br/><br/></span>
              
              {filteredTasks && filteredTasks.length > 0 && (
                <Form.Group className="mb-2 row">
                  {filteredTasks.map((permiso, index) => (
                    <div key={index} className="col-sm-6 col-md-2 col-lg-3">
                      <Form.Check
                        inline
                        label={permiso.nombrePermiso}
                        type="checkbox"
                        name={`permisoEditar2_${index}`}
                        id={`permisoEditar2_${index}`}
                        value={permiso.idPermiso}
                        checked={permiso.checked}
                        onChange={(e) =>
                          handleChangePermiso(
                            permiso.idPermiso,
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
export default UpdateRolPermiso;