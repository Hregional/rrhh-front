import React, { useState, useEffect, useCallback } from "react";
import useRrhh from "../../../hooks/useRrhh";
import * as Yup from "yup";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Formik } from "formik";
import SelectWithVirtualization from "../../SelectWithVirtualization";
import useAjustes from "../../../hooks/useAjustes";
import "react-datepicker/dist/react-datepicker.css";
import DT from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from 'moment';


// @ts-ignore
const DateTime = DT.default ? DT.default : DT;

interface UpdateTaskProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  idColaborador: number;
  idDepartamento: number;
  idEstadoColaborador: number;
  idEstadoCivil: number;
  codigo: string;
  dpi: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  apellidoCasada: string;
  municipioExtendido: string;
  departamentoExtendido: string;
  lugarNacimiento: string;
  nacionalidad: string;
  noIGSS: string;
  noNIT: string;
  nombreConyuge: string;
  noCuentaBancaria: string;
  telefono: string;
  direccion: string;
  email: string;
  fechaNacimiento: Date;
  fechaInicioLabores: Date;
  foto: File;
  updateList: () => void;
}
const UpdateColaborador: React.FC<UpdateTaskProps> = ({
  setShowModal,
  idColaborador,
  idDepartamento,
  idEstadoColaborador,
  idEstadoCivil,
  codigo,
  dpi,
  nombres,
  primerApellido,
  segundoApellido,
  apellidoCasada,
  municipioExtendido,
  departamentoExtendido,
  lugarNacimiento,
  nacionalidad,
  noIGSS,
  noNIT,
  nombreConyuge,
  noCuentaBancaria,
  telefono,
  direccion,
  email,
  fechaNacimiento,
  fechaInicioLabores,
  foto,
  updateList,
}) => {
    
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updateColaborador,listarEstadoColaborador,listarEstadoCivil } = useRrhh();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [estadoColaborador, setEstadoColaborador] = useState<any[]>([]);
  const [estadoCivil, setEstadoCivil] = useState<any[]>([]);
  const [fotos, setFotos] = useState<File | null>(null);

  const { listarDepartamento } = useAjustes();
const obtenerDepartamentos = useCallback(async () => {
    try {
      const response = await listarDepartamento();
      setDepartamentos(response);
      const responseEstadoColaborador = await listarEstadoColaborador();
      setEstadoColaborador(responseEstadoColaborador);
      const responseEstadoCivil = await listarEstadoCivil();
      setEstadoCivil(responseEstadoCivil);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching collaborators");
    }
  }, [listarDepartamento, listarEstadoColaborador, listarEstadoCivil]);
  useEffect(() => {
    obtenerDepartamentos();
  }, [obtenerDepartamentos]);


  const handleSaveChanges = async (values: any) => {
    try {
      const response = await updateColaborador(
        values.idColaborador,
        values.idDepartamento,
        values.idEstadoColaborador,
        values.idEstadoCivil,
        values.codigo,
        values.dpi,
        values.nombres,
        values.primerApellido,
        values.segundoApellido,
        values.apellidoCasada,
        values.municipioExtendido,
        values.departamentoExtendido,
        values.lugarNacimiento,
        values.nacionalidad,
        values.noIGSS,
        values.noNIT,
        values.nombreConyuge,
        values.noCuentaBancaria,
        values.telefono,
        values.direccion,
        values.email,
        values.fechaNacimiento,
        values.fechaInicioLabores,
        fotos as File
      );
      setSuccessMessage(response.data.message);
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
    primerApellido: Yup.string().required("Campo apellidos es requerido"),
    direccion: Yup.string().required("Campo Direccion es requerido"),
    email: Yup.string().required("Campo email es requerido"),
  });
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const optionDepartamentos = departamentos.map(
    ({ idDepartamentos, nombreDepartamento }) => ({
      value: idDepartamentos,
      label: nombreDepartamento,
    })
  );
  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFotos(selectedFile);
    }
  };
  const optionEstadoColaborador = estadoColaborador.map(
    ({ idEstadoColaborador, estadosColaborador }) => ({
      value: idEstadoColaborador,
      label: estadosColaborador,
    })
  );
  const optionEstadoCivil = estadoCivil.map(
    ({ idEstadoCivil, estadoCivil }) => ({
      value: idEstadoCivil,
      label: estadoCivil,
    })
  );
  return (
    <div>
      <Modal show={true} onHide={() => setShowModal(false)} centered
        dialogClassName="draggable-modal"
        size="xl"
        backdrop="static">
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
              idEstadoColaborador: idEstadoColaborador,
              idEstadoCivil: idEstadoCivil,
              codigo: codigo,
              dpi: dpi,
              nombres: nombres,
              primerApellido: primerApellido,
              segundoApellido: segundoApellido,
              apellidoCasada: apellidoCasada,
              municipioExtendido: municipioExtendido,
              departamentoExtendido: departamentoExtendido,
              lugarNacimiento: lugarNacimiento,
              nacionalidad: nacionalidad,
              noIGSS: noIGSS,
              noNIT: noNIT,
              nombreConyuge: nombreConyuge,
              noCuentaBancaria: noCuentaBancaria,
              telefono: telefono,
              direccion: direccion,
              email: email,
              fechaNacimiento: fechaNacimiento,
              fechaInicioLabores: fechaInicioLabores,
              foto: foto,
              submit: false,
            }}
            validationSchema={validationSchema}
            onSubmit={ async (
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
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Nombres: </Form.Label>
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
                  <Col md="3">
                    <Form.Group>
                      <Form.Label>Primer Apellido: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="primerApellido"
                        placeholder="primerApellido"
                        value={values.primerApellido}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.primerApellido && !!errors.primerApellido
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.primerApellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Segundo Apellido: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="segundoApellido"
                        placeholder="Segundo Apellido"
                        value={values.segundoApellido}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.segundoApellido && !!errors.segundoApellido
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.segundoApellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group>
                      <Form.Label>Apellido de Casada: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="apellidoCasada"
                        placeholder="Apellido de Casada"
                        value={values.apellidoCasada}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.apellidoCasada && !!errors.apellidoCasada
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.apellidoCasada}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>DPI: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
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
                  <Col md="3">
                    <Form.Group>
                      <Form.Label>Fecha de Nacimiento:</Form.Label>
                      <div>
                        <DateTime
                          value={moment(values.fechaNacimiento).format('DD/MM/YYYY')}
                          onChange={(date: Date | string) =>
                            setFieldValue("fechaNacimiento", date)
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Nacionalidad: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="nacionalidad"
                        placeholder="Nacionalidad"
                        value={values.nacionalidad}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.nacionalidad && !!errors.nacionalidad
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nacionalidad}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Lugar de Nacimiento: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="lugarNacimiento"
                        placeholder="Lugar de Nacimiento"
                        value={values.lugarNacimiento}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.lugarNacimiento && !!errors.lugarNacimiento
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Estado Civil: </Form.Label>
                      <SelectWithVirtualization
                        options={optionEstadoCivil}
                        value={
                          optionEstadoCivil.find(
                            (option) => option.value === values.idEstadoCivil
                          ) ?? null
                        }
                        onChange={(selectedOption: any) => {
                          const selectedValue = selectedOption
                            ? selectedOption?.value
                            : "";
                          setFieldValue("idEstadoCivil", selectedValue);
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Conyuge: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="nombreConyuge"
                        placeholder="Nombre del Conyuge"
                        value={values.nombreConyuge}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.nombreConyuge && !!errors.nombreConyuge
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Ingrese Telefono: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="telefono"
                        placeholder="Telefono "
                        value={values.telefono}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.telefono && !!errors.telefono}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="3">
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
                  <Col md="3">
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
                  <Col md="3">
                    <Form.Group className="mb-3">
                        <Form.Label>Departamento Extendido: </Form.Label>
                        <Form.Control
                          size="lg"
                          type="text"
                          name="departamentoExtendido"
                          placeholder="Departamento Extendido DPI"
                          value={values.departamentoExtendido}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.departamentoExtendido && !!errors.departamentoExtendido}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.departamentoExtendido}
                        </Form.Control.Feedback>
                      </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Municipio Extendido: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="municipioExtendido"
                        placeholder="Municipio Extendido DPI"
                        value={values.municipioExtendido}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.municipioExtendido && !!errors.municipioExtendido}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.municipioExtendido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                        <Form.Label>No. IGSS: </Form.Label>
                        <Form.Control
                          size="lg"
                          type="text"
                          name="noIGSS"
                          placeholder="Numero IGSS"
                          value={values.noIGSS}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.noIGSS && !!errors.noIGSS}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.noIGSS}
                        </Form.Control.Feedback>
                      </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>No. NIT: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="noNIT"
                        placeholder="Numero NIT"
                        value={values.noNIT}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.noNIT && !!errors.noNIT}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.noNIT}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                        <Form.Label>No. De Cuenta Bancaria: </Form.Label>
                        <Form.Control
                          size="lg"
                          type="text"
                          name="noCuentaBancaria"
                          placeholder="Numero de Cuenta Bancaria"
                          value={values.noCuentaBancaria}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.noCuentaBancaria && !!errors.noCuentaBancaria}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.noIGSS}
                        </Form.Control.Feedback>
                      </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Codigo: </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        name="codigo"
                        placeholder="codigo "
                        value={values.codigo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.codigo && !!errors.codigo}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="3">
                    <Form.Group>
                      <Form.Label>Fecha de Inicio Labores:</Form.Label>
                      <div>
                        <DateTime
                          value={moment(values.fechaInicioLabores).format('DD/MM/YYYY')}
                          onChange={(date: Date | string) =>
                            setFieldValue("fechaInicioLabores", date)
                          }
                          dateFormat="DD/MM/YYYY"
                          timeFormat={false}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="3">
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
                  </Col>
                  <Col md="3">
                    <Form.Group className="mb-3">
                      <Form.Label>Estado Colaborador: </Form.Label>
                      <SelectWithVirtualization
                        options={optionEstadoColaborador}
                        value={
                          optionEstadoColaborador.find(
                            (option) => option.value === values.idEstadoColaborador
                          ) ?? null
                        }
                        onChange={(selectedOption: any) => {
                          const selectedValue = selectedOption
                            ? selectedOption?.value
                            : "";
                          setFieldValue("idEstadoColaborador", selectedValue);
                        }}
                      />
                    </Form.Group>
                  </Col>
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
                </Row>
                <Row>
                  <Col xs="5" md="6" />
                  <Col xs="4" md="4">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
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
