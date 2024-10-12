import React, { useState, useEffect, useCallback } from "react";
import { Card, Table, Pagination, Form } from "react-bootstrap";
import { Edit2 } from "react-feather";
import useRrhh from "../../../hooks/useRrhh";
import UpdateUser from "./UpdateUser";
interface Props {
  actualizarListado: boolean;
  }

const ListUser: React.FC<Props> = ({ actualizarListado }) => {
  const { listarUser } = useRrhh();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [idColaborador, setIdColaborador] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10); // Número de tareas por página
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    nombreUsuario: "",
    email: "",
  });

  useEffect(() => {
    obtenerUsuarios();
  }, [actualizarListado, currentPage, tasksPerPage]);

  const obtenerUsuarios = async () => {
    try {
      const listUser = await listarUser();
      setUsers(listUser);
    } catch (error) {
      setError("Error al cargar los usuarios.");
    }
  };

  const handleUpdateList = async () => {
    await obtenerUsuarios(); // Vuelve a cargar los usuarios después de la actualización
  };

  const handleEdit = (idUsuario: number, nombreUsuario: string, email: string, idColaborador: number) => {
    setShowModal(true);
    setIdUsuario(idUsuario);
    setNombreUsuario(nombreUsuario);
    setEmail(email);
    setIdColaborador(idColaborador);
  };

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1); // Resetear a la primera página cuando se aplica un filtro
  }, []);

  const filteredUsers = users.filter((item) =>
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
  const goToNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className="ListUsuariosGrid">
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
              <th className="col">Fecha Creacion</th>
              <th className="col">Estado</th>
              <th className="col-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.idUsuario}>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.nombreUsuario}</td>
                <td>{user.email}</td>
                <td>
                  {new Date(user.fechaCreacion).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
                </td>
                <td>{user.nombreEstado}</td>
                <td className="table-action">
                  <Edit2
                    className="align-middle me-1"
                    size={18}
                    onClick={() =>
                      handleEdit(user.idUsuario, user.nombreUsuario, user.email, user.idColaborador)
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
        <UpdateUser
          setShowModal={setShowModal}
          idUsuario={idUsuario}
          nombreUsuario={nombreUsuario}
          email={email}
          idColaborador={idColaborador}
          updateList={handleUpdateList}
        />
      )}
    </div>
  );
};

export default ListUser;
