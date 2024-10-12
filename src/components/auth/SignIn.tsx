import  { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'; // Asegúrate de importar el icono de Microsoft

import useAuth from "../../hooks/useAuth";

function SignIn() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        // nombreUsuario: Yup.string()
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Usuario es requerido"),
        password: Yup.string().required("Contraseña es requerida"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
        try {
          await signIn(values.email, values.password);
          // navigate("/private");
          window.location.href = "/private/";
        } catch (error: any) {
          const message = error.response.data.message || "Algo salió mal";
          console.log(error);
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
        <>
<Form onSubmit={handleSubmit}>
            {errors.submit && (
              <Alert className="my-3" variant="danger">
                <div className="alert-message">{errors.submit}</div>
              </Alert>
            )}
            {/* Muestra errores específicos de la solicitud al backend */}
            {error && (
              <Alert className="my-3" variant="danger">
                <div className="alert-message">{error}</div>
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={values.email}
                isInvalid={Boolean(touched.email && errors.email)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!touched.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                size="lg"
                type="password"
                name="password"
                placeholder="Ingrese Contraseña"
                value={values.password}
                isInvalid={Boolean(touched.password && errors.password)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!touched.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
              <small>
                <Link to="/auth/reset-password">¿Has olvidado tu contraseña?</Link>
              </small>
            </Form.Group>

            <div>
              <Form.Check
                type="checkbox"
                id="rememberMe"
                label="Recordarme la próxima vez"
                defaultChecked
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                Iniciar Sesión
              </Button>
            </div>
          </Form>
          <div className="row">
            <div className="col">
              <hr />
            </div>
            <div className="col-auto text-uppercase d-flex align-items-center">
              O
            </div>
            <div className="col">
              <hr />
            </div>
          </div>
          <div className="d-grid gap-2 mb-3">
            <Link to="/dashboard/default" className="btn btn-google btn-lg">
              <FontAwesomeIcon icon={faGoogle} /> Iniciar con Google
            </Link>
            <Link to="/dashboard/default" className="btn btn-microsoft btn-lg">
              <FontAwesomeIcon icon={faMicrosoft} /> Iniciar con Microsoft
            </Link>
          </div>
        </>
      )}
    </Formik>
  );
}

export default SignIn;
