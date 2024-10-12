import React from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";
import logo from "../../assets/img/logo-white.png";
import NewPassword from "../../components/auth/NewPassword";

const NewPasswordPage = () => (

    <React.Fragment>
        <Helmet title="New Password" />
        <div className="text-center mt-4">
    {/* <img
        src={logo}
        width="50%"
        height="50%"
        className="mb-2"
        alt="Logo"
        /> */}
    <h2 style={{color: "white"}}>Reseteo de contraseña</h2>
    <p className="lead" style={{color: "white"}}>Ingrese la nueva contraseña</p>
    </div>
    <Card>
        <Card.Body>
            <div className="m-sm-3">
                <NewPassword />
            </div>
        </Card.Body>
    </Card>
    </React.Fragment>
);

export default NewPasswordPage;
