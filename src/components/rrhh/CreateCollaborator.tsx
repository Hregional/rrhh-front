import { List } from "react-feather";
import ListCollaborator from "./ListCollaborator";
import { useCallback, useEffect, useState } from "react";
import useRrhh from "../../hooks/useRrhh";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DT from "react-datetime";
import "react-datetime/css/react-datetime.css";
import useAjustes from "../../hooks/useAjustes";
import SelectWithVirtualization from "../SelectWithVirtualization";

// @ts-ignore
const DateTime = DT.default ? DT.default : DT;

const CreateCollaborator: React.FC = () => {
  const [actualizarListado, setActualizarListado] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showAlertDpi, setShowAlertDpi] = useState<boolean>(false);

  const [foto, setFoto] = useState<File | null>(null);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const { crearCollaborator } = useRrhh();
  const { listarDepartamento } = useAjustes();
  // const handleOpenModal = () => {
  //   setShowModal(true);
  // };
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);
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

  const handleSuccess = (message: any) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  const handleErrors = (error: any) => {
    setError(error.response?.data?.error || "Error desconocido.");
    setTimeout(() => {
      setError(null);
    }, 3000);
  };
  const handleSaveChanges = async (values: any) => {
    try {
      const response = await crearCollaborator(
        values.idDepartamento,
        values.dpi,
        values.nombres,
        values.apellidos,
        values.telefono1,
        values.direccion,
        values.email,
        values.fechaNacimiento,
        foto as File
      );
      handleSuccess(response.data.message);
    } catch (error) {
      handleErrors(error);
    }
  };
  const validationSchema = Yup.object().shape({
    idDepartamento: Yup.number().required("Campo Departamento es requerido"),
    dpi: Yup.number().required("Campo DPI es requerido"),
    nombres: Yup.string().required("Campo nombres es requerido"),
    apellidos: Yup.string().required("Campo apellidos es requerido"),
    direccion: Yup.string().required("Campo Direccion es requerido"),
    email: Yup.string().required("Campo email es requerido"),
  });
  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFoto(selectedFile);
    }
  };
  const optionDepartamentos = departamentos.map(
    ({ idModulos, nombreModulo }) => ({
      value: idModulos,
      label: nombreModulo,
    })
  );
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Colaboradores</h1>
        <Button variant="primary" size="lg" onClick={handleOpenModal}>
          Nuevo
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert style={{ padding: "10px" }} variant="danger">
              Necesitas seleccionar un Departamento.
            </Alert>
          )}
                    {showAlertDpi && (
            <Alert style={{ padding: "10px" }} variant="danger">
              Necesitas registrar DPI.
            </Alert>
          )}
          <Formik
            initialValues={{
              idDepartamento: 0,
              dpi: 0,
              nombres: "",
              apellidos: "",
              telefono1: "",
              direccion: "",
              email: "",
              fechaNacimiento: new Date(),
              foto: "",
              submit: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting, resetForm }
            ) => {
              try {
                if (!values.idDepartamento) {
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 3000);
                  return;
                }
                if (!values.dpi) {
                  setShowAlertDpi(true);
                  setTimeout(() => {
                    setShowAlertDpi(false);
                  }, 3000);
                  return;
                }
                await handleSaveChanges(values);
                setTimeout(() => {
                  setSuccessMessage(null);
                  handleCloseModal();
                }, 1000);
                setActualizarListado((prev) => !prev);
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
                        placeholder="Nombres"
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
                        placeholder="Apellidos"
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
                        // value={values.dpi}
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
                      {/* <div>
                        <DatePicker
                          selected={values.fechaNacimiento}
                          onChange={(date: Date) => setFieldValue('fechaNacimiento', date)}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                        />
                      </div> */}
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
                  <Col xs="6" md="6" />
                  <Col xs="3" md="3">
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
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <div>
        <br />
        <ListCollaborator actualizarListado={actualizarListado} />
      </div>
    </div>
  );
};

export default CreateCollaborator;
