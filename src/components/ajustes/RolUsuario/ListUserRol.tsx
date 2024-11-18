import React, { useState, useEffect } from "react";
import { Card, Table, Pagination, Accordion } from "react-bootstrap";
import { Edit2, Trash } from "react-feather";
import useAjustes from "../../../hooks/useAjustes";

interface Props {
    actualizarListado: boolean;
}
const ListUserRol: React.FC<Props> = ({ actualizarListado }) => {
    const [showModal, setShowModal] = useState(false);
    const { listarRolPermisos } = useAjustes();
    const [ rolPermisos, setRolPermisos ] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [ idRol, setIdRol ] = useState<number | null>(null);
    const [listPermisos, setListPermisos] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);

    useEffect(() => {
        listRolPermisos();
    }, [actualizarListado]);
    const listRolPermisos = async () => {
        try {
            const response = await listarRolPermisos();
            setRolPermisos(response);
        } catch (error: any) {
            console.error(
                `Error en la solicitud de listar roles permisos: ${error.message}`
            );
        }
    }
    const handleEdit = ( idRol: number, listPermisos: []) => {
        setIdRol(idRol);
        setListPermisos(listPermisos);
        setShowModal(true);
    }
    const handleUpdateList = async () => {
        await listRolPermisos();
    }
    
    return (
        <div>
            <br />
            <h2>Listado de usuarios con Roles</h2>
            <Card className="adminReporteTask">
                <Card.Body className="">
                    <Accordion defaultActiveKey="0">
                        {rolPermisos.map((item, index1) => (
                            <Accordion.Item
                                eventKey={item.idRole}
                                className="bg-white"

                                key={item.idRole}
                            >
                                <Accordion.Header>
                                    <div style={{width: "100%"}}>
                                        {item.nombreRol}
                                    </div>
                                    <div style={{ width: "100%", textAlign: "right" }}>
                                        <Edit2
                                            className="align-middle me-1"
                                            size={18}
                                            onClick={() => handleEdit(item.idRole, item.permisos.$values)}

                                        />
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body className="row">

                                    {item.permisos.$values.map(
                                        (permiso: any, index: number) => (
                                            <div
                                                key={permiso.idPermiso}
                                                className="col-sm-6 col-md-4 col-lg-3"
                                            >
                                                <span>
                                                    {permiso.nombrePermiso}
                                                </span>

                                            </div>
                                        )
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Card.Body>

                {/* {showModal && idRol !== null && (
                    <UpdateRolPermisos
                        setShowModal={setShowModal}
                        idRol={idRol ?? 0}
                        listPermisos={listPermisos}
                        updateList={handleUpdateList} // Pasa la función de actualización
                    />
                )} */}
            </Card>
        </div>
    );
    }
    export default ListUserRol;