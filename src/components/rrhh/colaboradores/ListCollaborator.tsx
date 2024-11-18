import { useCallback, useEffect, useState } from "react";
import useRrhh from "../../../hooks/useRrhh";
import { Card, Form, Pagination, Table } from "react-bootstrap";
import { Edit2 } from "react-feather";
import UpdateColaborador from "./UpdateColaborador";
import { t } from "i18next";

interface Props {
    actualizarListado: boolean;
}

const ListCollaborator: React.FC<Props> = ({ actualizarListado }) => {
    const [showModal, setShowModal] = useState(false);
    const [colaborador, setColaborador] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        nombres: "",
        primerApellido: "",
        email: "",
        direccion: "",
        nombreDepartamento: "",
        estadoColaborador: "",

    });
    const { listCollaborator } = useRrhh();

    const [idColaborador, setIdColaborador] = useState<number | null>(null);
    const [idDepartamento, setIdDepartamento] = useState<number | null>(null);
    const [idEstadoColaborador, setIdEstadoColaborador] = useState<number | null>(null);
    const [idEstadoCivil, setIdEstadoCivil] = useState<number | null>(null);
    const [codigo, setCodigo] = useState<string>("");
    const [ dpi, setDpi] = useState<string>("");
    const [nombres, setNombres] = useState<string>("");
    const [primerApellido, setPrimerApellidos] = useState<string>("");
    const [segundoApellido, setSegundoApellido] = useState<string>("");
    const [apellidoCasada, setApellidoCasada] = useState<string>("");
    const [municipioExtendido, setMunicipioExtendido] = useState<string>("");
    const [departamentoExtendido, setDepartamentoExtendido] = useState<string>("");
    const [lugarNacimiento, setLugarNacimiento] = useState<string>("");
    const [nacionalidad, setNacionalidad] = useState<string>("");
    const [noIGSS, setNoIGSS] = useState<string>("");
    const [noNIT, setNoNIT] = useState<string>("");
    const [nombreConyuge, setNombreConyuge] = useState<string>("");
    const [noCuentaBancaria, setNoCuentaBancaria] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [direccion, setDireccion] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>();
    const [fechaInicioLabores, setFechaInicioLabores] = useState<Date>();
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
        {
            if (key === "nombres") {
                const fullName = `${item.nombres} ${item.primerApellido}`.toLowerCase();
                return fullName.includes(filters[key].toLowerCase());
            }
            return item[key].toLowerCase().includes(filters[key].toLowerCase())
        }
        )
    );
    const handleEdit = (
        idColaborador: number,
        idDepartamento: number,
        idEstadoColaborador: number,
        idEstadoCivil: number,
        codigo: string,
        dpi: string,
        nombres: string,
        primerApellido: string,
        segundoApellido: string,
        apellidoCasada: string,
        municipioExtendido: string,
        departamentoExtendido: string,
        lugarNacimiento: string,
        nacionalidad: string,
        noIGSS: string,
        noNIT: string,
        nombreConyuge: string,
        noCuentaBancaria: string,
        telefono: string,
        direccion: string,
        email: string,
        fechaNacimiento: Date,
        fechaInicioLabores: Date,
        foto: File
    ) => {
        setShowModal(true);
        setIdColaborador(idColaborador);
        setIdDepartamento(idDepartamento);
        setIdEstadoColaborador(idEstadoColaborador);
        setIdEstadoCivil(idEstadoCivil);
        setCodigo(codigo);
        setDpi(dpi);
        setNombres(nombres);
        setPrimerApellidos(primerApellido);
        setSegundoApellido(segundoApellido);
        setApellidoCasada(apellidoCasada);
        setMunicipioExtendido(municipioExtendido);
        setDepartamentoExtendido(departamentoExtendido);
        setLugarNacimiento(lugarNacimiento);
        setNacionalidad(nacionalidad);
        setNoIGSS(noIGSS);
        setNoNIT(noNIT);
        setNombreConyuge(nombreConyuge);
        setNoCuentaBancaria(noCuentaBancaria);
        setTelefono(telefono);
        setDireccion(direccion);
        setEmail(email);
        setFechaNacimiento(fechaNacimiento);
        setFechaInicioLabores(fechaInicioLabores);
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
                        {/* <th className="col">Foto</th> */}
                        <th className="col">
                            <span>Colaborador</span>
                            <Form.Control 
                                type="text"
                                placeholder="Buscar por nombres"
                                value={filters.nombres}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    handleFilterChange("nombres", e.target.value)}
                            />
                        </th>         
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
                        <th className="col"><span>Telefono</span>
                            </th>
                        <th className="col"><span>Dirección</span>
                            <Form.Control
                            type="text"
                            placeholder="Filtrar por Direccion"
                            value={filters.direccion}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("direccion", e.target.value)
                            }
                            /></th>
                        <th className="col"><span>Departamento</span>
                            <Form.Control
                            type="text"
                            placeholder="Filtrar por Departamento"
                            value={filters.nombreDepartamento}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("nombreDepartamento", e.target.value)
                            }
                            /></th>
                        <th className="col"><span>Estado</span>
                            <Form.Control
                            type="text"
                            placeholder="Filtrar por Estado"
                            value={filters.estadoColaborador}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("estadoColaborador", e.target.value)
                            }
                            /></th>

                        <th className="col">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map((col, index) => (
                    <tr key={index}>
                        <td>{index}</td>
                        {/* <td><img alt="colaborador" src={col.foto}style={{height:'64px', margin:'10px'}}/></td> */}
                        <td>{col.nombres} {col.primerApellido} {col.segundoApellido}</td>
                        <td>{col.email}</td>
                        <td>{col.telefono}</td>
                        <td>{col.direccion}</td>
                        <td>{col.nombreDepartamento}</td>
                        <td>{col.estadoColaborador}</td>
                        <th className="table-action">
                        <Edit2
                            className="align-middle me-1"
                            size={18}
                            onClick={() =>
                            handleEdit(
                                col.idColaborador,
                                col.idDepartamento,
                                col.idEstadoColaborador,
                                col.idEstadoCivil,
                                col.codigo,
                                col.dpi,
                                col.nombres,
                                col.primerApellido,
                                col.segundoApellido,
                                col.apellidoCasada,
                                col.municipioExtendido,
                                col.departamentoExtendido,
                                col.lugarNacimiento,
                                col.nacionalidad,
                                col.noIGSS,
                                col.noNIT,
                                col.nombreConyuge,
                                col.noCuentaBancaria,
                                col.telefono,
                                col.direccion,
                                col.email,
                                col.fechaNacimiento,
                                col.fechaInicioLabores,
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
        {showModal &&  idColaborador !== null && (
            <UpdateColaborador
            setShowModal={setShowModal}
            idColaborador={idColaborador ?? 0}
            idDepartamento={idDepartamento ?? 0}
            idEstadoColaborador={idEstadoColaborador ?? 0}
            idEstadoCivil={idEstadoCivil ?? 0}
            codigo={codigo ?? ""}
            dpi={dpi ?? ""}
            nombres={nombres ?? ""}
            primerApellido={primerApellido ?? ""}
            segundoApellido={segundoApellido ?? ""}
            apellidoCasada={apellidoCasada ?? ""}
            municipioExtendido={municipioExtendido ?? ""}
            departamentoExtendido={departamentoExtendido ?? ""}
            lugarNacimiento={lugarNacimiento ?? ""}
            nacionalidad={nacionalidad ?? ""}
            noIGSS={noIGSS ?? ""}
            noNIT={noNIT ?? ""}
            nombreConyuge={nombreConyuge ?? ""}
            noCuentaBancaria={noCuentaBancaria ?? ""}
            telefono={telefono ??  ""}
            direccion={direccion ?? ""}
            email={email ?? ""}
            fechaNacimiento={fechaNacimiento ?? new Date()}
            fechaInicioLabores={fechaInicioLabores ?? new Date()}
            foto={foto ?? new File([], "")}
            updateList={handleUpdateList}
            />
        )}
        </div>
    )
}

export default ListCollaborator;