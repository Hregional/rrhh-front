import React, { useState, useEffect } from "react";
import { Card, Table, Pagination, Form } from "react-bootstrap";
import { Edit2 } from "react-feather";
import UpdateDepartamento from "./UpdateDepartamento";
import useAjustes from "../../../src/hooks/useAjustes";

interface Props {
    actualizarListado: boolean;
    }

const ListarDepartamento: React.FC<Props> = ({ actualizarListado }) => {
    const [showModal, setShowModal] = useState(false);
    const [idModulos, setIdModulos] = useState<number | null>(null);
    const [nombreDepartamento, setNombreDepartamento] = useState<string>("");
    const [descripcionDepartamento, setdescripcionDepartamento] = useState<string>("");
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
    nombreModulo: "",
    descripcionModulo: "",
    });

    const { listarDepartamento } = useAjustes();

    useEffect(() => {
    obtenerDepas();
    }, [actualizarListado, currentPage, tasksPerPage]);

    const obtenerDepas = async () => {
    try {
        const depasObtenidos = await listarDepartamento();
        setDepartamentos(depasObtenidos);
    } catch (error) {
        setError("Error al cargar los departamentos.");
    }
    };


    const handleUpdateList = async () => {
    await obtenerDepas();
    };

    const handleEdit = (idModulos: number,nombreModulo: string, descripcionModulo: string) => {
    setShowModal(true);
    setIdModulos(idModulos);
    setNombreDepartamento(nombreModulo);
    setdescripcionDepartamento(descripcionModulo);
    };

    const filteredTasks = departamentos.filter((item) =>
    Object.keys(filters).every((key) =>
        item[key].toLowerCase().includes(filters[key].toLowerCase())
    )
    );

    const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: value,
    }));
    };

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(Math.ceil(filteredTasks.length / tasksPerPage));
    const goToNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredTasks.length / tasksPerPage)));
    const goToPrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
    <div>
        <br />
        <Card>
        <Table striped  bordered style={{ textAlign: "center" }} responsive>
            <thead>
            <tr>
                <th className="col">ID</th>
                <th className="col">
                <span>Nombre Departamento</span>
                <Form.Control
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filters.nombreModulo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("nombreModulo", e.target.value)
                    }
                />
                </th>
                <th className="col">
                <span>Descripción del Departamento</span>
                <Form.Control
                    type="text"
                    placeholder="Filtrar por descripción"
                    value={filters.descripcionModulo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("descripcionModulo", e.target.value)
                    }
                />
                </th>
                <th className="col">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {currentTasks.map((depa, index) => (
                <tr key={index}>
                <td>{index}</td>
                <td>{depa.nombreModulo}</td>
                <td>{depa.descripcionModulo}</td>
                <td className="table-action">
                    <Edit2
                    className="align-middle me-1"
                    size={18}
                    onClick={() =>
                        handleEdit(
                        depa.idModulos,
                        depa.nombreModulo,
                        depa.descripcionModulo
                        )
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
            <Pagination.Next onClick={goToNextPage} />
            <Pagination.Last onClick={goToLastPage} />
            </Pagination>
        </div>
        {showModal && idModulos !== null && (
        <UpdateDepartamento
            setShowModal={setShowModal}
            idModulos={idModulos}
            nombreModulo={nombreDepartamento}
            descripcionModulo={descripcionDepartamento}
            updateList={handleUpdateList}
        />
        )}
    </div>
    );
};

export default ListarDepartamento;
