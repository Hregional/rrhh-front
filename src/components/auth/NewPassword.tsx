import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";
import { setSession } from "../../utils/jwt";

function NewPassword() {
    const navigate = useNavigate();
    const { newPassword } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const { token } = useParams(); // Obtener el token de la URL
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);


    useEffect(() => {
    // Puedes hacer algo con el token aquí si es necesario
    //console.log("Token from URL:", token);
}, [token]);

return (
    <Formik
    initialValues={{

        password: "",
        confirmPassword: "",
        submit: false,
    }}
    validationSchema={Yup.object().shape({
        
        password: Yup.string().required("Nueva contraseña es requerida"),
        confirmPassword: Yup.string()
        .required("Confirmar contraseña es requerido")
        .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir"),

    })}
    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
        
           // Verifica que las contraseñas coincidan antes de enviar la solicitud
        if (values.password !== values.confirmPassword) {
            setErrors({
            confirmPassword: "Las contraseñas deben coincidir",
            });
            return;
        }

         // Aquí deberías llamar a la función resetPassword con el token y la nueva contraseña
        if (token) {
          // Aquí deberías llamar a la función resetPassword con el token y la nueva contraseña
        await newPassword(token, values.password);
        setSuccessMessage('Restablecimiento de contraseña exitoso.');
          // Puedes redirigir a la página deseada después de cambiar la contraseña
          // Aquí se añade un delay de 3 segundos antes de redirigir
        setTimeout(() => {
            navigate("/private");
        }, 2000);

        } else {
            console.error("El token es undefined");
        }
        
        } catch (error: any) {
        const message = error.message || "Something went wrong";
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
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
                size="lg"
                type="password"
                name="password"
                placeholder="Ingrese nueva contraseña"
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
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
                size="lg"
                type="password"
                name="confirmPassword"
                placeholder="Confirme la nueva contraseña"
                value={values.confirmPassword}
                isInvalid={Boolean(
                touched.confirmPassword && errors.confirmPassword
                )}
                onBlur={handleBlur}
                onChange={handleChange}
            />
            {!!touched.confirmPassword && (
                <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
                </Form.Control.Feedback>
            )}
            </Form.Group>   

            <div className="d-grid gap-2 mt-3">
            <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
            >
                Cambiar Contraseña
            </Button>
            </div>
        </Form>
        </>
    )}
    </Formik>
);
}

export default NewPassword;
