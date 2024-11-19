import React, { useState, useEffect, useCallback } from "react";
import { Card, Table, Pagination, Accordion, Form } from "react-bootstrap";
import { Edit2, Trash } from "react-feather";
import useAjustes from "../../../hooks/useAjustes";
import { set } from "react-datepicker/dist/date_utils";
import UpdateUserRol from "./UpdateUserRol";

interface Props {
  actualizarListado: boolean;
}
const ListUserRol: React.FC<Props> = ({ actualizarListado }) => {
  const [showModal, setShowModal] = useState(false);
  const { listarUserRol } = useAjustes();
  const [userRol, setUserRol] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [rolList, setRolList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10); // Número de tareas por página
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    nombreUsuario: "",
    email: "",
  });

  useEffect(() => {
    listUserRol();
  }, [actualizarListado]);
  const listUserRol = async () => {
    try {
      const response = await listarUserRol();
      setUserRol(response);
    } catch (error: any) {
      console.error(
        `Error en la solicitud de listar usuarios con roles: ${error.message}`
      );
    }
  };
  const handleEdit = (idUsuario: number, rolesList: []) => {
    setIdUsuario(idUsuario);
    setRolList(rolesList);
    setShowModal(true);
  };
  const handleUpdateList = async () => {
    await listUserRol();
  };

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1); // Resetear a la primera página cuando se aplica un filtro
  }, []);

  const filteredUsers = userRol.filter((item) =>
    Object.keys(filters).every((key) =>
      item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * tasksPerPage;
  const indexOfFirstUser = indexOfLastUser - tasksPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / tasksPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const goToPrevPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className="ListUsuariosRolGrid">
        <h1>Lista de Usuarios con Roles</h1>
      <Card>
        <Table striped bordered style={{ textAlign: "center" }} responsive>
          <thead>
            <tr>
              <th className="col">
                <span>No</span>
              </th>
              <th className="col">
                <span>Nombre Usuario</span>
                <Form.Control
                  type="text"
                  placeholder="Nombre Usuario"
                  value={filters.nombreUsuario}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("nombreUsuario", e.target.value)
                  }
                />
              </th>
              <th className="col">
                <span>Email</span>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("email", e.target.value)
                  }
                />
              </th>
              <th className="col-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.idUsuario}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.nombreUsuario}</td>
                <td>{user.email}</td>
                <td className="table-action">
                  <Edit2
                    className="align-middle me-1"
                    size={18}
                    onClick={() =>
                      handleEdit(user.idUsuario, user.rolList.$values)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <div className="d-flex justify-content-between">
        <Pagination>
          <Pagination.First onClick={goToFirstPage} />
          <Pagination.Prev onClick={goToPrevPage} />
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next onClick={goToNextPage} />
          <Pagination.Last onClick={goToLastPage} />
        </Pagination>
      </div>

      {showModal && idUsuario !== null && (
        <UpdateUserRol
          setShowModal={setShowModal}
          idUsuario={idUsuario ?? 0}
          rolList={rolList}
          updateList={handleUpdateList}
        />
      )}
    </div>
  );
};
export default ListUserRol;
