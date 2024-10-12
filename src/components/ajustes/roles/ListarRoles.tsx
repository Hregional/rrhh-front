import React, { useState, useEffect, useCallback } from "react";
import { Card, Table, Pagination, Form } from "react-bootstrap";
import { Edit2 } from "react-feather";
import UpdateRoles from "./UpdateRoles";
import useAjustes from "../../../hooks/useAjustes";

interface Props {
    actualizarListado: boolean;
    }

const ListRol: React.FC<Props> = ({ actualizarListado }) => {
    const [showModal, setShowModal] = useState(false);
    const { listarRoles } = useAjustes();
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<any[]>([]);
    
    const [idRol, setIdRol] = useState<number | null>(null);
    const [nombreRol, setNombreRol] = useState<string>("");
    const [descripcionRol, setDescripcionRol] = useState<string>("");
    const [idModulos, setIdModulos] = useState<number | null>(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        nombreRol: "",
        descripcionRol: "",
    });
    
    useEffect(() => {
        listRoles();
    }, [actualizarListado, currentPage, filters]);
    
    const listRoles = async () => {
        try {
        const obtenerRoles = await listarRoles();
        const filteredRoles = obtenerRoles.filter((item) =>
            Object.keys(filters).every((key) =>
            item[key].toLowerCase().includes(filters[key].toLowerCase())
            )
        );
        setRoles(filteredRoles);
        } catch (error: any) {
        setError("Error al cargar las tareas: " + error.message);
        }
    };
    
    const handleUpdateList = async () => {
        await listRoles();
    };
    
    const handleEdit = (
        idRole: number,
        nombreRol: string,
        descripcionRol: string,
        idModulos: number
    ) => {
        setShowModal(true);
        setIdRol(idRole);
        setNombreRol(nombreRol);
        setDescripcionRol(descripcionRol);
        setIdModulos(idModulos);
    };
    const handleDelete = () => {};
    
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: value,
        }));
        setCurrentPage(1); // Restablece la página actual a la primera cuando cambian los filtros
    }, []);
    
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(Math.ceil(roles.length / tasksPerPage));
    const goToNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(roles.length / tasksPerPage)));
    const goToPrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    
    // Obtener las tareas actuales en función de la página actual
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = roles.slice(indexOfFirstTask, indexOfLastTask);
    
    return (
        <div className="ListRolGrid">
        <Card>
            <Table striped bordered style={{ textAlign: "center" }} responsive>
            <thead>
                <tr>
                <th className="col">ID</th>
                <th className="col">
                    <span>Nombre Rol</span>
                    <Form.Control
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filters.nombreRol}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange("nombreRol", e.target.value)
                    }
                    />
                </th>
                <th className="col">
                <span>Descripción del Rol</span>
                    <Form.Control
                    type="text"
                    placeholder="Filtrar por descripción"
                    value={filters.descripcionRol}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFilterChange("descripcionRol", e.target.value)
                    }
                    />
                </th>
                {/* <th className="col">Departamento</th> */ }
                <th className="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {currentTasks.map((rol, index) => (
                <tr key={index}>
                    <td>{indexOfFirstTask + index + 1}</td>
                    <td>{rol.nombreRol}</td>
                    <td>{rol.descripcionRol}</td>
                    {/* <td>{rol.nombreModulo}</td> */}
                    <td className="table-action">
                    <Edit2
                        className="align-middle me-1"
                        size={18}
                        onClick={() =>
                        handleEdit(
                            rol.idRole,
                            rol.nombreRol,
                            rol.descripcionRol,
                            rol.idModulos
                        )
                        } // Pasar el ID y nombre de la tarea al hacer clic en Edit2
                    />
                    {/* <Trash
                        className="align-middle"
                        size={18}
                        onClick={handleDelete}
                    /> */}
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
            <Pagination.Next onClick={goToNextPage} />
            <Pagination.Last onClick={goToLastPage} />
            </Pagination>
        </div>
        {showModal && idRol !== null && (
        <UpdateRoles
            setShowModal={setShowModal}
            idRol={idRol}
            nombreRol={nombreRol}
            descripcionRol={descripcionRol}
            idmodulo={idModulos ?? 0}
            updateList={handleUpdateList} // Pasa la función de actualización
        />
        )}
    </div>
    );
};

export default ListRol;
