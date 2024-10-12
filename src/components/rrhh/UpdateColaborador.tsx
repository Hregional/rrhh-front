import React, { useState, useEffect, useCallback } from "react";
import useRrhh from "../../hooks/useRrhh";
import * as Yup from "yup";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Formik } from "formik";
import SelectWithVirtualization from "../SelectWithVirtualization";
import useAjustes from "../../hooks/useAjustes";
import "react-datepicker/dist/react-datepicker.css";
import DT from "react-datetime";
import "react-datetime/css/react-datetime.css";

// @ts-ignore
const DateTime = DT.default ? DT.default : DT;

interface UpdateTaskProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  idColaborador: number;
  idDepartamento: number;
  dpi: number;
  nombres: string;
  apellidos: string;
  telefono1: string;
  direccion: string;
  email: string;
  fechaNacimiento: Date;
  foto: File;
  updateList: () => void;
}
const UpdateColaborador: React.FC<UpdateTaskProps> = ({
  setShowModal,
  idColaborador,
  idDepartamento,
  dpi,
  nombres,
  apellidos,
  telefono1,
  direccion,
  email,
  fechaNacimiento,
  foto,
  updateList,
}) => {
    
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updateColaborador } = useRrhh();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [fotos, setFotos] = useState<File | null>(null);

  const { listarDepartamento } = useAjustes();
const obtenerDepartamentos = useCallback(async () => {
    try {
      const response = await listarDepartamento();
      setDepartamentos(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching collaborators");
    }
  }, [listarDepartamento]);
  useEffect(() => {
    obtenerDepartamentos();
  }, [obtenerDepartamentos]);


  const handleSaveChanges = async (values: any) => {
    try {
      const response = await updateColaborador(
        values.idColaborador,
        values.idDepartamento,
        values.dpi,
        values.nombres,
        values.apellidos,
        values.telefono1,
        values.direccion,
        values.email,
        values.fechaNacimiento,
        fotos as File
      );
      setSuccessMessage(response.data);
      updateList();

      setTimeout(() => {
        setSuccessMessage(null);
        setShowModal(false);
      }, 3000);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  const validationSchema = Yup.object().shape({
    nombres: Yup.string().required("Campo nombres es requerido"),
    apellidos: Yup.string().required("Campo apellidos es requerido"),
    direccion: Yup.string().required("Campo Direccion es requerido"),
    email: Yup.string().required("Campo email es requerido"),
  });
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const optionDepartamentos = departamentos.map(
    ({ idModulos, nombreModulo }) => ({
      value: idModulos,
      label: nombreModulo,
    })
  );
  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFotos(selectedFile);
    }
  };
  return (
    <div>
      <Modal show={true} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert style={{ padding: "10px" }} variant="danger">
              Necesita seleccionar un Departamento.
            </Alert>
          )}
          <Formik
            initialValues={{
              idColaborador: idColaborador,
              idDepartamento: idDepartamento,
              dpi: dpi,
              nombres: nombres,
              apellidos: apellidos,
              telefono1: telefono1,
              direccion: direccion,
              email: email,
              fechaNacimiento: fechaNacimiento,
              foto: foto,
              submit: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting, resetForm }
            ) => {
              try {
                // aqui poner la condición para que selecione departamento
                // if (!values.idEmpresa) {
                // setShowAlert(true);
                // setTimeout(() => {
                //     setShowAlert(false);
                // }, 3000);
                // return;
                // }
                if (!values.idDepartamento) {
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 3000);
                  return;
                }
                if (!values.dpi) {
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 3000);
                  return;
                }
                await handleSaveChanges(values);
                setTimeout(() => {
                  setSuccessMessage(null);
                  handleCloseModal();
                }, 1000);
              } catch (error: any) {
                setError(error.message);
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
                <Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Departamento: </Form.Label>
                    <SelectWithVirtualization
                      options={optionDepartamentos}
                      value={
                        optionDepartamentos.find(
                          (option) => option.value === values.idDepartamento
                        ) ?? null
                      }
                      onChange={(selectedOption: any) => {
                        const selectedValue = selectedOption
                          ? selectedOption?.value
                          : "";
                        setFieldValue("idDepartamento", selectedValue);
                      }}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Ingrese Nombres: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="nombres"
                        placeholder="Ingrese"
                        value={values.nombres}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.nombres && !!errors.nombres}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombres}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Ingrese Apellidos: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="apellidos"
                        placeholder="Ingrese"
                        value={values.apellidos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.apellidos && !!errors.apellidos}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.apellidos}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>DPI: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="number"
                        name="dpi"
                        placeholder="dpi"
                        value={values.dpi}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dpi && !!errors.dpi}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dpi}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Correo electronico: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="email"
                        name="email"
                        placeholder="Correo"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && !!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Ingrese Direccion: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="direccion"
                        placeholder="Direccion"
                        value={values.direccion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.direccion && !!errors.direccion}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.direccion}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Ingrese Telefono 1: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="telefono1"
                        placeholder="Telefono 1"
                        value={values.telefono1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.telefono1 && !!errors.telefono1}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group className="mb-3">
                      <Form.Label>Seleccionar Fotografia</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Fecha de inicio:</Form.Label>
                      <div>
                        <DateTime
                          value={values.fechaNacimiento}
                          onChange={(date: Date | string) =>
                            setFieldValue("fechaNacimiento", date)
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                          className="form-control"
                        />
                      </div>

                      {/* <DateTime input={true} dateFormat="DD/MM/YYYY" timeFormat={false}  /> */}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs="5" md="6" />
                  <Col xs="4" md="4">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => {
                        // Verificar si idEmpresa está vacío al hacer clic en "Guardar cambios"
                        // if (!values.idEmpresa) {
                        // setShowAlert(true); // Mostrar alerta si idEmpresa está vacío
                        // setTimeout(() => {
                        //     setShowAlert(false); // Ocultar alerta después de 3 segundos
                        // }, 3000);
                        // return; // Detener el envío del formulario
                        // }
                      }}
                    >
                      Guardar cambios
                    </Button>
                  </Col>
                  <Col xs="3" md="2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cerrar
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default UpdateColaborador;
