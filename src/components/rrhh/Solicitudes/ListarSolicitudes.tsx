import { useCallback, useEffect, useState } from "react";
import useRrhh from "../../../hooks/useRrhh";
import { Card, Form, Pagination, Table } from "react-bootstrap";
import { Edit2 } from "react-feather";
import { t } from "i18next";

interface Props {
    actualizarListado: boolean;
}

const ListarSolicitudes: React.FC<Props> = ({ actualizarListado }) => {
    const [showModal, setShowModal] = useState(false);
    const [colaborador, setColaborador] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        nombres: "",
        apellidos: "",
        email: "",
    });
    const { listCollaborator } = useRrhh();

    const [idColaborador, setIdColaborador] = useState<number | null>(null);
    const [idDepartamento, setIdDepartamento] = useState<number | null>(null);
    const [ dpi, setDpi] = useState<number | null>(null);
    const [nombres, setNombres] = useState<string>("");
    const [apellidos, setApellidos] = useState<string>("");
    const [telefono1, setTelefono] = useState<string>("");
    const [direccion, setDireccion] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>();
    const [foto, setFoto] = useState<File | null>(null);

    useEffect(() => {
        listarColaborador();
    }, [actualizarListado, currentPage, tasksPerPage]);

    const listarColaborador = async () => {
    try {
        const listado = await listCollaborator();
        setColaborador(listado);
    } catch (error) {
        setError("Error al cargar los colaboradores.");
    }
    };
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: value,
    }));
    }, []);
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(Math.ceil(colaborador.length / tasksPerPage));
    const goToNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(colaborador.length / tasksPerPage)));
    const goToPrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));  
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = colaborador.slice(indexOfFirstTask, indexOfLastTask);

    const filteredTasks = colaborador.filter((item) =>
        Object.keys(filters).every((key) =>
        item[key].toLowerCase().includes(filters[key].toLowerCase())
        )
    );
    const handleEdit = (
        idColaborador: number,
        idDepartamento: number,
        dpi: number,
        nombres: string,
        apellidos: string,
        telefono1: string,
        direccion: string,
        email: string,
        fechaNacimiento: Date,
        foto: File
    ) => {
        setShowModal(true);
        setIdColaborador(idColaborador);
        setIdDepartamento(idDepartamento);
        setDpi(dpi);
        setNombres(nombres);
        setApellidos(apellidos);
        setTelefono(telefono1);
        setDireccion(direccion);
        setEmail(email);
        setFechaNacimiento(fechaNacimiento);
        setFoto(foto);
    }
    const handleUpdateList = async () => {
        await listarColaborador();
    };
    return (
        <div>
            <Card>
                <Table striped bordered style={{ textAlign: "center"}} responsive>
                    <thead>
                    <tr>
                        <th className="col">No.</th>
                        <th className="col">
                            <span>Nombres</span>
                            <Form.Control 
                                type="text"
                                placeholder="Buscar por nombres"
                                value={filters.nombres}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    handleFilterChange("nombres", e.target.value)}
                            />
                        </th>
                        <th className="col">
                        <span>Apellidos</span>
                        <Form.Control
                            type="text"
                            placeholder="Filtrar por apellido"
                            value={filters.apellidos}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("apellidos", e.target.value)
                            }
                            />
                        </th>
                        <th className="col">Telefono 1</th>
                        <th className="col">Direccion</th>
                        <th className="col">
                            <span>Email</span>
                            <Form.Control
                            type="text"
                            placeholder="Filtrar por email"
                            value={filters.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("email", e.target.value)
                            }
                            />
                        </th>
                        <th className="col">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map((col, index) => (
                    <tr key={index}>
                        <td>{index}</td>
                        <td>{col.nombres}</td>
                        <td>{col.apellidos}</td>
                        <td>{col.telefono1}</td>
                        <td>{col.direccion}</td>
                        <td>{col.email}</td>
                        <th className="table-action">
                        <Edit2
                            className="align-middle me-1"
                            size={18}
                            onClick={() =>
                            handleEdit(
                                col.idColaborador,
                                col.idDepartamento,
                                col.dpi,
                                col.nombres,
                                col.apellidos,
                                col.telefono1,
                                col.direccion,
                                col.email,
                                col.fechaNacimiento,
                                col.foto
                            )
                            }
                        />
                        </th>
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
        {/* {showModal &&  idColaborador !== null && (
            <UpdateColaborador
            setShowModal={setShowModal}
            idColaborador={idColaborador ?? 0}
            idDepartamento={idDepartamento ?? 0}
            dpi={dpi ?? 0}
            nombres={nombres ?? ""}
            apellidos={apellidos ?? ""}
            telefono1={telefono1 ??  ""}
            direccion={direccion ?? ""}
            email={email ?? ""}
            fechaNacimiento={fechaNacimiento ?? new Date()}
            foto={foto ?? new File([], "")}
            updateList={handleUpdateList}
            />
        )} */}
        </div>
    )
}

export default ListarSolicitudes;