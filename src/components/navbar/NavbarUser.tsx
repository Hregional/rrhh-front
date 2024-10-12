import React from "react";
import { Dropdown } from "react-bootstrap";
import { PieChart, Settings, User  } from "react-feather";

import avatar1 from "../../assets/img/avatars/avatar.jpg";
import useAuth from "../../hooks/useAuth";
const NavbarUser = () => {
  const { signOut, user  } = useAuth();
  
  
  return (
    <Dropdown className="nav-item" align="end">
      <span className="d-inline-block d-sm-none">
        <Dropdown.Toggle as="a" className="nav-link">
          <Settings size={18} className="align-middle" />
        </Dropdown.Toggle>
      </span>
      <span className="d-none d-sm-inline-block">
        <Dropdown.Toggle as="a" className="nav-link">
          {/* <img
            src={avatar1}
            className="avatar img-fluid rounded-circle me-1"
            alt="Chris Wood"
          /> */}
          <span className="text-dark">{user?.userName}</span>
          </Dropdown.Toggle>
      </span>
      <Dropdown.Menu>
        <Dropdown.Item>
          <User size={18} className="align-middle me-2" />
          Perfil
        </Dropdown.Item>
        {/* <Dropdown.Item>
          <PieChart size={18} className="align-middle me-2" />
          Analitica
        </Dropdown.Item> */}
        <Dropdown.Divider />
        <Dropdown.Item>Configuración y privacidad</Dropdown.Item>
        <Dropdown.Item>Ayuda</Dropdown.Item>
        <Dropdown.Item onClick={signOut}>Cerrar Sesion</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
