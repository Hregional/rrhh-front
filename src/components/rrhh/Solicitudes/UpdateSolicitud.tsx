import { useCallback, useEffect, useState } from "react";
import useRrhh from "../../../hooks/useRrhh";
import * as Yup from "yup";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Formik } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import DT from "react-datetime";
import "react-datetime/css/react-datetime.css";
import SelectWithVirtualization from "../../SelectWithVirtualization";
import { format, parseISO } from "date-fns";


// @ts-ignore
const DateTime = DT.default ? DT.default : DT;

interface UpdateTaskProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  idLicencia: number;
  idColaborador: number;
  idTipoLicencia: number;
  idEstadoLicencia: number;
  fechaInicio: Date;
  fechaFin: Date;
  observaciones: string;
  updateList: () => void;
}

const UpdateSolicitud: React.FC<UpdateTaskProps> = ({
  setShowModal,
  idLicencia,
  idColaborador,
  idTipoLicencia,
  idEstadoLicencia,
  fechaInicio,
  fechaFin,
  observaciones,
  updateList,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    listCollaborator,
    listarTipoLicencia,
    listarEstadoLicencia,
    updateLicencia,
    subirConstanciaLicencia,
  } = useRrhh();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [colaborador, setColaborador] = useState<any[]>([]);
  const [tipoLicencia, setTipoLicencia] = useState<any[]>([]);
  const [estadoLicencia, setEstadoLicencia] = useState<any[]>([]);

  const obtenerDatos = useCallback(async () => {
    try {
      const response = await listCollaborator();
      setColaborador(response);
      const responseTipoLicencia = await listarTipoLicencia();
      setTipoLicencia(responseTipoLicencia);
      const responseEstadoLicencia = await listarEstadoLicencia();
      setEstadoLicencia(responseEstadoLicencia);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error al cargar los datos");
    }
  }, [listCollaborator, listarTipoLicencia, listarEstadoLicencia]);

  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
      setShowModal(false);
    }, 2000);
  };

  const handleErrors = (error: any) => {
    const errorMessage = error.response?.data?.error || "Error desconocido.";
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const optionColaboradores = colaborador.map(
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

  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const validationSchema = Yup.object().shape({
    idColaborador: Yup.number().required("Campo colaborador es requerido"),
    idTipoLicencia: Yup.number().required("Campo tipo de licencia es requerido"),
    idEstadoLicencia: Yup.number().required("Campo estado de licencia es requerido"),
    fechaInicio: Yup.date().required("Campo fecha de inicio es requerido"),
    fechaFin: Yup.date().required("Campo fecha de fin es requerido"),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        handleErrors({ response: { data: { error: "El archivo no debe exceder los 10MB." } } });
        return;
      }
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        handleErrors({ response: { data: { error: "Solo se permiten archivos PDF, JPG o PNG." } } });
        return;
      }
      setArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setArchivo(null);
      setPreview(null);
    }
  };

  const handleSaveChanges = async (values: any) => {
    try {
      if (archivo) {
        const response = await subirConstanciaLicencia(values.idLicencia, archivo);
        if (response && response.isAxiosError) {
            throw response;
        }
        handleSuccess("Constancia subida exitosamente.");
      } else {
        const response = await updateLicencia(
          values.idLicencia,
          values.idColaborador,
          values.idTipoLicencia,
          values.idEstadoLicencia,
          new Date(values.fechaInicio),
          new Date(values.fechaFin),
          values.observaciones
        );
        if (response && response.isAxiosError) {
            throw response;
        }
        handleSuccess(response.data.message);
      }
      updateList();
    } catch (error: any) {
      handleErrors(error);
    }
  };

  return (
    <div>
      <Modal show={true} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Licencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert && (
            <Alert style={{ padding: "10px" }} variant="success">
              Necesita llenar todos los campos
            </Alert>
          )}
          <Formik
            initialValues={{
              idLicencia: idLicencia,
              idColaborador: idColaborador,
              idTipoLicencia: idTipoLicencia,
              idEstadoLicencia: idEstadoLicencia,
              fechaInicio: fechaInicio,
              fechaFin: fechaFin,
              observaciones: observaciones,
              submit: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting, resetForm }
            ) => {
              try {
                await handleSaveChanges(values);
                setSubmitting(false);
              } catch (error: any) {
                handleErrors(error);
                setSubmitting(false);
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
                          value={typeof values.fechaInicio === "string" ? format(parseISO(values.fechaInicio), "dd/MM/yyyy") : format(values.fechaInicio, "dd/MM/yyyy")}
                          onChange={(date: any) =>
                            setFieldValue("fechaInicio", date.format("YYYY-MM-DD"))
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Fecha de Fin:</Form.Label>
                      <div>
                        <DateTime
                          value={typeof values.fechaFin === "string" ? format(parseISO(values.fechaFin), "dd/MM/yyyy") : format(values.fechaFin, "dd/MM/yyyy")}
                          onChange={(date: any) =>
                            setFieldValue("fechaFin", date.format("YYYY-MM-DD"))
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6" md="6">
                    <Form.Group>
                      <Form.Label> Estado Solicitud: </Form.Label>
                      <SelectWithVirtualization
                        options={optionEstadoLicencia}
                        value={
                          optionEstadoLicencia.find(
                            (option) => option.value === values.idEstadoLicencia
                          ) ?? null
                        }
                        onChange={(selectedOption: any) => {
                          const selectedValue = selectedOption
                            ? selectedOption?.value
                            : "";
                          setFieldValue("idEstadoLicencia", selectedValue);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="6" md="6">
                    <Form.Group>
                      <Form.Label> Observaciones: </Form.Label>
                      <Form.Control
                        size="lg"
                        as="textarea"
                        type="text"
                        name="observaciones"
                        placeholder="observaciones"
                        value={values.observaciones}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.observaciones && !!errors.observaciones
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.observaciones}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <Form.Group className="mb-3">
                      <Form.Label>Subir Constancia (PDF, JPG, PNG - max 10MB)</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </Form.Group>
                  </Col>
                  {preview && (
                    <Col md="12" className="text-center mb-3">
                      <h5>Vista Previa:</h5>
                      {archivo?.type.startsWith("image/") ? (
                        <img src={preview} alt="Vista previa" style={{ maxWidth: "100%", maxHeight: "200px" }} />
                      ) : (
                        <p>{archivo?.name}</p>
                      )}
                    </Col>
                  )}
                </Row>
                <Row className="justify-content-center">
                  <Col xs="auto">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || !!archivo} // Deshabilitar si se sube un archivo
                    >
                      Guardar Cambios
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="success"
                      onClick={handleSubmit} // Usar handleSubmit de Formik
                      disabled={!archivo || isSubmitting}
                    >
                      Subir Constancia
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="secondary"
                      onClick={handleCloseModal}
                    >
                      Cancelar
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

export default UpdateSolicitud;
