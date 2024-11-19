import {  Formik } from "formik";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Alert, Button, Form, Card, Accordion } from "react-bootstrap";
import Select from "react-select";
import useAjustes from "../../../hooks/useAjustes";
import { Search } from "react-feather";
import ListUserRol from "./ListUserRol";


function AsignarRolUsuario() {
    const {
      asignarRol,
      listarRoles,
      listarUserSinRoles,
    } = useAjustes();
    const [user, setUser] = useState<any[]>([]);
    const [roles, setroles] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(
      null
    );
    const [actualizarListado, setActualizarListado] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
      nombreRol: "",
    });
    useEffect(() => {
      listUser();
    }, [actualizarListado]);
  
    const listUser = async () => {
      const users = await listarUserSinRoles();
      setUser(users);
      const listroles = await listarRoles();
      setroles(listroles);
    };
  
    const handleError = (errorMessage: string) => {
      //console.error(errorMessage);
      setError(errorMessage);
      setTimeout(() => {
        setError(null);
      }, 2500);
    };
    const filteredTasks = roles.filter((item) =>
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
            idUsuario: 0,
            rolesSeleccionados: [] as number[],
            submit: false,
          }}
          onSubmit= { async (values,{ setSubmitting, resetForm, setFieldValue }) => {
            try {
                const { idUsuario, rolesSeleccionados } = values;
                if ( idUsuario !== 0 && rolesSeleccionados.length > 0 && idUsuario !== undefined) {
                    await Promise.all(
                      rolesSeleccionados.map(async (idRole: number) => {
                        await asignarRol(idUsuario, idRole);
                        })
                      );
                      setSuccessMessage("Se guardaron los datos correctamente.");
                      resetForm();
                      setFieldValue("idUsuario", null);
                      setTimeout(() => {
                        setSuccessMessage(null);
                      }, 2500);
                }
            } catch (error) {
                handleError("Error al asignar rol");
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
                  options={user.map(({ idUsuario, nombreUsuario }) => ({
                    idUsuario,
                    nombreUsuario,
                  }))}
                  getOptionValue={({ idUsuario }) => idUsuario.toString()}
                  getOptionLabel={({ nombreUsuario }) => nombreUsuario}
                  placeholder="Seleccione Usuario"
                  menuPlacement="bottom"
                  onChange={(selectedOption) => {
                    setFieldValue("idUsuario", selectedOption?.idUsuario);
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
                value={filters.nombreRol}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFilterChange("nombreRol", e.target.value)
                }
              />
            </div>

            <br />
            <Form.Group className="mb-2 row">
              {filteredTasks.map((rol, index) => (
                <div key={index} className="col-sm-6 col-lg-3">
                  <Form.Check
                    inline
                    label={rol.nombreRol}
                    type="checkbox"
                    name={`role_${index}`}
                    id={`role_${index}`}
                    value={rol.idRole}
                    checked={values.rolesSeleccionados.includes(
                      rol.idRole
                    )}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        setFieldValue(`rolesSeleccionados`, [
                          ...values.rolesSeleccionados,
                          rol.idRole,
                        ]);
                      } else {
                        setFieldValue(
                          `rolesSeleccionados`,
                          values.rolesSeleccionados.filter(
                            (id) => id !== rol.idRole
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
          <ListUserRol actualizarListado={actualizarListado} />
        </div>
      </div>
    );
  }
  
  export default AsignarRolUsuario;
  