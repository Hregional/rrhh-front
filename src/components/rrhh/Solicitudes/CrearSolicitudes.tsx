import { List } from "react-feather";
import { useCallback, useEffect, useState } from "react";
import useRrhh from "../../../hooks/useRrhh";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DT from "react-datetime";
import "react-datetime/css/react-datetime.css";
// import useAjustes from "../../hooks/useAjustes";
import SelectWithVirtualization from "../../SelectWithVirtualization";
import useAjustes from "../../../hooks/useAjustes";
import ListarSolicitudes from "./ListarSolicitudes";

// @ts-ignore
const DateTime = DT.default ? DT.default : DT;

const CreateCollaborator: React.FC = () => {
  const [actualizarListado, setActualizarListado] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [ tipoLicencia, setTipoLicencia ] = useState<any[]>([]);
  const [ estadoLicencia, setEstadoLicencia ] = useState<any[]>([]);
  const [ colaboradores, setColaboradores ] = useState<any[]>([]);
  const {  listarTipoLicencia, listarEstadoLicencia, crearLicencia, listCollaborator } = useRrhh();
  const { listarDepartamento } = useAjustes();

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
  const obtenerTipoLicencia = useCallback(async () => {
    try {
      const response = await listarTipoLicencia();
      setTipoLicencia(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching collaborators");
    }
  }, [listarTipoLicencia]);

  const obtenerEstadoLicencia = useCallback(async () => {
    try {
      const response = await listarEstadoLicencia();
      setEstadoLicencia(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching collaborators");
    }
  }, [listarEstadoLicencia]);
  const obtenerColaborador = useCallback(async () => {
    try {
      const response = await listCollaborator();
      setColaboradores(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching collaborators");
    }
  }, [listarEstadoLicencia]);

  useEffect(() => {
    obtenerDepartamentos();
    obtenerTipoLicencia();
    obtenerEstadoLicencia();
    obtenerColaborador();
  }, [obtenerDepartamentos, obtenerTipoLicencia, obtenerEstadoLicencia, obtenerColaborador]);

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
      const response = await crearLicencia(
        values.idColaborador,
        values.idTipoLicencia,
        values.idEstadoLicencia,
        values.fechaInicio,
        values.fechaFin,
        values.observaciones,
      );
      handleSuccess(response.data.message);
    } catch (error) {
      handleErrors(error);
    }
  };
  const validationSchema = Yup.object().shape({
    idColaborador: Yup.number().required("Este campo es requerido."),
    idTipoLicencia: Yup.number().required("Este campo es requerido."),
    idEstadoLicencia: Yup.number().required("Este campo es requerido."),
    fechaInicio: Yup.date().required("Este campo es requerido."),
    fechaFin: Yup.date().required("Este campo es requerido."),
  });

  const optionColaboradores = colaboradores.map(
    ({ idColaborador, nombres, primerApellido, segundoApellido }) => ({
        value: idColaborador,
        label: `${nombres} ${primerApellido} ${segundoApellido}`,
    })
);
  const optionTipoLicencia = tipoLicencia.map(
    ({ idTipoLicencia, tipoLicencia }) => ({
        value: idTipoLicencia,
        label: tipoLicencia,
    })
);
  const optionEstadoLicencia = estadoLicencia.map(
    ({ idEstadoLicencia, estadoLicencia }) => ({
        value: idEstadoLicencia,
        label: estadoLicencia,
    })
);
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Solicitudes</h1>{" "}
        <Button variant="primary" size="lg" onClick={handleOpenModal}>
          Nuevo
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert style={{ padding: "10px" }} variant="danger">
              Necesitas seleccionar un Colaborador.
            </Alert>
          )}
          <Formik
            initialValues={{
              idColaborador: 0,
              idTipoLicencia: 0,
              idEstadoLicencia: 1,
              fechaInicio: new Date(),
              fechaFin: new Date(),
              observaciones: "",
              submit: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting, resetForm }
            ) => {
              try {
                if (!values.idColaborador) {
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
                  <Col md="6">
                  <Form.Group className="mb-3">
                <Form.Label>Colaborador: </Form.Label>
                <SelectWithVirtualization
                    options={optionColaboradores}
                    value={
                    optionColaboradores.find(
                        (option) => option.value === values.idColaborador
                    ) ?? null
                    }
                    onChange={(selectedOption: any) => {
                    const selectedValue = selectedOption
                        ? selectedOption?.value
                        : "";
                    setFieldValue("idColaborador", selectedValue);
                    }}
                />
                </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label> Tipo Solicitud: </Form.Label>
                      <SelectWithVirtualization
                    options={optionTipoLicencia}
                    value={
                      optionTipoLicencia.find(
                        (option) => option.value === values.idTipoLicencia
                    ) ?? null
                    }
                    onChange={(selectedOption: any) => {
                    const selectedValue = selectedOption
                        ? selectedOption?.value
                        : "";
                    setFieldValue("idTipoLicencia", selectedValue);
                    }}
                />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Fecha de inicio:</Form.Label>
                      <div>
                        <DateTime
                          value={values.fechaInicio}
                          onChange={(date: Date | string) =>
                            setFieldValue("fechaInicio", date)
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                          // className="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Fecha de Fin:</Form.Label>
                      <div>
                        <DateTime
                          value={values.fechaFin}
                          onChange={(date: Date | string) =>
                            setFieldValue("fechaFin", date)
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                          // className="form-control"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6" md="6">
                    <Form.Group>
                      <Form.Label> Observaciones: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="observaciones"
                        placeholder="observaciones"
                        value={values.observaciones}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.observaciones && !!errors.observaciones}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.observaciones}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs="6" md="6">
                    <Row className="justify-content-center">
                      <Col xs="auto">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Guardar
                        </Button>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Cancelar
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      <div>
        <ListarSolicitudes actualizarListado={actualizarListado} />
      </div>
    </div>
  );
};

export default CreateCollaborator;
