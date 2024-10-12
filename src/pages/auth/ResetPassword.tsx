import React from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import ResetPassword from "../../components/auth/ResetPassword";

const ResetPasswordPage = () => (
  <React.Fragment>
    <Helmet title="Reset Password" />
    <div className="text-center mt-4">
      <h1 className="h2">Restablecer contraseña</h1>
      <p className="lead">Ingresa tu correo electrónico para restablecer tu contraseña.</p>
    </div>

    <Card>
      <Card.Body>
        <div className="m-sm-3">
          <ResetPassword />
        </div>
      </Card.Body>
    </Card>
    <div className="text-center mb-3" style={{color: "white"}}>
    Iniciar Sesion <Link to="/auth/sign-in"><span style={{color: "white", fontWeight: "normal"}}>Login</span></Link>
    </div>
  </React.Fragment>
);

export default ResetPasswordPage;
