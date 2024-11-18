import { useCallback, useEffect, useState } from "react";
import useAjustes from "../../../hooks/useAjustes";
import React from "react";
import { Formik } from "formik";
import { Accordion, Alert, Button, Card, Form } from "react-bootstrap";
import Select from "react-select";
import { Search } from "react-feather";
import ListRolPermisos from "./ListRolPermisos";


function RolPermisos() {
    const { listarRolesSinPermisos, listarPermisos, insertarRolesPermisos } = useAjustes();
    const [roles, setroles] = useState<any[]>([]);
    const [permisos, setPermiso] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [actualizarListado, setActualizarListado] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        nombrePermiso: "",
      });

    useEffect(() => {
        listPermisos();
    }, [actualizarListado]);

    const listPermisos = async () => {
        const permisos = await listarPermisos();
        setPermiso(permisos);
        const rolesPermiso = await listarRolesSinPermisos();
        setroles(rolesPermiso);
    };

    const handleError = (errorMessag: string) => {
        setError(errorMessag);
        setTimeout(() => {
            setError(null);
        }, 2500);
    }
    const filteredTasks = permisos.filter((item) =>
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
     <Formik
     initialValues={{
        idRol: 0,
        permisosSeleccionados: [] as number[], // Especifica el tipo de los elementos como number
        submit: false,
      }}
      onSubmit= { async (values,{ setSubmitting, resetForm, setFieldValue }) => {
        try {
            const { idRol, permisosSeleccionados } = values;
            console.log(idRol);
            if ( idRol !== 0 && permisosSeleccionados.length > 0 && idRol !== undefined) {
                await Promise.all(
                    permisosSeleccionados.map(async (permisoId: number) => {
                    await insertarRolesPermisos(idRol, permisoId);
                    })
                  );
                  setSuccessMessage("Se guardaron los datos correctamente.");
                  resetForm();
                  setFieldValue("idRol", null);
                  setTimeout(() => {
                    setSuccessMessage(null);
                  }, 2500);
            }
        } catch (error) {
            handleError("Error al asignar permisos");
        } finally {
        setSubmitting(false);
        }
    }}
    >
    {({
        errors,
        handleSubmit,
        setFieldValue,
        handleBlur,
        handleChange,
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
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                options={roles.map(({ idRole, nombreRol }) => ({
                  idRole,
                  nombreRol,
                }))}
                getOptionValue={({ idRole }) => idRole.toString()}
                getOptionLabel={({ nombreRol }) => nombreRol}
                placeholder="Seleccione Rol"
                menuPlacement="bottom"
                onChange={(selectedOption) => {
                  setFieldValue("idRol", selectedOption?.idRole);
                }}
                isClearable
              />
            </Form.Group>
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
            <Form.Group className="mb-2 row">
              {filteredTasks.map((permiso, index) => (
                <div key={index} className="col-sm-6 col-lg-3">
                  <Form.Check
                    inline
                    label={permiso.nombrePermiso}
                    type="checkbox"
                    name={`permisos_${index}`}
                    id={`permisos_${index}`}
                    value={permiso.idPermiso}
                    checked={values.permisosSeleccionados.includes(
                      permiso.idPermiso
                    )}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        setFieldValue(`permisosSeleccionados`, [
                          ...values.permisosSeleccionados,
                          permiso.idPermiso,
                        ]);
                      } else {
                        setFieldValue(
                          `permisosSeleccionados`,
                          values.permisosSeleccionados.filter(
                            (id) => id !== permiso.idPermiso
                          )
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </Form.Group>

            <div className="d-grid gap-2 mt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                Guardar
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="m-sm-3">
        <ListRolPermisos actualizarListado={actualizarListado} />
      </div>
    </div>
  );
}

export default RolPermisos;