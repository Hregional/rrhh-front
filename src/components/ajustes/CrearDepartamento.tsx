import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form, Card, Modal, Row, Col } from "react-bootstrap";
import useAjustes from "../../hooks/useAjustes";
import ListarDepartamento from "./ListarDepartamentos";

function CrearDepartamento() {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { crearDepartamento } = useAjustes();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [actualizarListado, setActualizarListado] = useState(false); // Estado para forzar la actualización del componente ListarTareas
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  return (
    <div>
      <div>
        <div className="text-center">
          <h1 className="h2">Departamento</h1>
        </div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" size="lg" onClick={handleOpenModal}>
            Nuevo
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear Departamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert style={{ padding: "10px" }} variant="danger">
              Necesita seleccionar un Departamento.
            </Alert>
          )}
          <Formik
            initialValues={{
              nombreModulo: "",
              descripcionModulo: "",
              submit: false,
            }}
            validationSchema={Yup.object().shape({
              nombreModulo: Yup.string().required(
                "Campo Nombre Departamento es requerido"
              ),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                await crearDepartamento(
                  values.nombreModulo,
                  values.descripcionModulo
                );
                setSuccessMessage("Departamento creado, correctamente!");
                values.nombreModulo = "";
                values.descripcionModulo = "";
                
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
                  <Form.Label>Ingrese Nombre Departamento</Form.Label>
                  <Form.Control
                    size="lg"
                    type="text"
                    name="nombreModulo"
                    placeholder="Ingrese Nombre Departamento"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nombreModulo}
                    isInvalid={Boolean(
                      touched.nombreModulo && errors.nombreModulo
                    )}
                  />
                  {!!touched.nombreModulo && (
                    <Form.Control.Feedback type="invalid">
                      {errors.nombreModulo}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Ingrese Descripcion del departamento (opcional)
                  </Form.Label>
                  <Form.Control
                    size="lg"
                    as="textarea"
                    name="descripcionModulo"
                    placeholder="Descripcion del departamento"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.descripcionModulo}
                    isInvalid={Boolean(
                      touched.descripcionModulo && errors.descripcionModulo
                    )}
                  />
                  {!!touched.descripcionModulo && (
                    <Form.Control.Feedback type="invalid">
                      {errors.descripcionModulo}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <div className="d-grid gap-2 mt-3">
                  <Row>
                    <Col xs="6" md="6" />
                    <Col xs="3" md="3">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        Guardar
                      </Button>
                    </Col>
                    <Col xs="3" md="3">
                    <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <div className="m-sm-3">
        <ListarDepartamento actualizarListado={actualizarListado} />
      </div>
    </div>
  );
}

export default CrearDepartamento;
