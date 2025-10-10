import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  ToastContainer,
  Toast,
  Modal,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Download, Eye } from "react-feather";
import ExcelJS from "exceljs";
import SelectWithVirtualization from "../../SelectWithVirtualization";
import useRrhh from "../../../hooks/useRrhh";
import DT from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { set } from "react-datepicker/dist/date_utils";
import axios from "axios";
import { apiURL } from "../../../utils/endpoints";

interface Values {
    idColaborador: number;
  }
  // @ts-ignore
  const DateTime = DT.default ? DT.default : DT;

const HistorialLicencia: React.FC = () => {
  const [values, setValues] = useState<Values>({ idColaborador: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ colaborador, setColaborador] = useState<any[]>([]);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContentUrl, setModalContentUrl] = useState<string | null>(null);
  const { listCollaborator,listarHistorialLicenciaColaborador, listarHistorialLicencia } = useRrhh();

  const handleCloseModal = () => {
    if (modalContentUrl && modalContentUrl.startsWith("blob:")) {
        URL.revokeObjectURL(modalContentUrl);
    }
    setShowModal(false);
    setModalContentUrl(null);
  };

  const obtenerColaboradores = useCallback(async () => {
    try {
      const response = await listCollaborator();
      setColaborador(response);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error fetching collaborators");
    }
  }, [listCollaborator]);
  useEffect(() => {
    obtenerColaboradores();
}, [obtenerColaboradores]);
  const optionColaboradores = colaborador.map(
    ({ idColaborador, nombres, primerApellido }) => ({
      value: idColaborador,
      label: `${nombres} ${primerApellido}`,
    })
  );
const setIdColaborador = (field: keyof Values, value: number) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const obtenerReporte = useCallback(async () => {
    setLoading(true);
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      let fetchedData;
      console.log (fechaInicio, fechaFin);
      if ( fechaInicio && fechaFin) {
        fetchedData = await listarHistorialLicenciaColaborador(values.idColaborador, fechaInicio, fechaFin);
        console.log(fetchedData);
      } else {
        fetchedData = await listarHistorialLicencia();
        console.log(fetchedData);
      }
      setData(fetchedData);
    } catch (err) {
      setError("Ocurrió un error al obtener el reporte.");
    } finally {
      setLoading(false);
    }
  }, [ listarHistorialLicencia, listarHistorialLicenciaColaborador, values.idColaborador, fechaInicio, fechaFin]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [message, error]);

  const handleVerConstancia = async (idLicencia: number) => {
    try {
        const response = await axios.get(`${apiURL}/licencias/obtener-url-constancia/${idLicencia}`);
        const url = response.data.url;
        if (url) {
            if (url.toLowerCase().endsWith('.pdf')) {
                const fileResponse = await axios.get(url, { responseType: 'blob' });
                const blob = new Blob([fileResponse.data], { type: 'application/pdf' });
                const objectUrl = URL.createObjectURL(blob);
                setModalContentUrl(objectUrl);
            } else {
                setModalContentUrl(url);
            }
            setShowModal(true);
        } else {
            setError("No se pudo obtener la URL de la constancia.");
        }
    } catch (error) {
        setError("Error al obtener la constancia.");
    }
  };

  const handleDescargarConstancia = async (idLicencia: number) => {
    try {
        const response = await axios.get(`${apiURL}/licencias/obtener-url-constancia/${idLicencia}`);
        const url = response.data.url;
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', ''); // This will force download
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            setError("No se pudo obtener la URL de la constancia.");
        }
    } catch (error) {
        setError("Error al obtener la constancia.");
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ReporteHistorialLicencias");
  
    // Definir encabezados y estilo de encabezado
    const headers = ["Nombre Colaborador", "Departamento", "Fecha Inicio", "Fecha Fin", "Tipo", "Estado", "Observaciones"];
    const headerRow = worksheet.addRow(headers);
  
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true }; // Texto en negrita
      cell.fill = { // Fondo celeste claro
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ADD8E6" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" }; // Centrar el texto
      cell.border = { // Bordes en todas las celdas
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });
  
    // Añadir datos de historial de departamentos con bordes en cada celda
    data.forEach((datos) => {
      const row = worksheet.addRow([
        datos.nombreCompleto,
        datos.departamento,
        new Date(datos.fechaInicio).toLocaleDateString(),
        new Date(datos.fechaFin).toLocaleDateString(),
        datos.tipoLicencia,
        datos.estadoLicencia,
        datos.observaciones,
      ]);
      
      row.eachCell((cell) => {
        cell.border = { // Bordes en cada celda de la tabla
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });
    });
  
    // Ajustar ancho de las columnas
    worksheet.columns.forEach((column) => {
      column.width = 25;
    });
  
    // Exportar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ReporteHistorialLicencias_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
  };
  return (
    <div>
      {/* Mostrar mensajes de éxito o error */}
      {message && (
        <ToastContainer>
          <Toast bg="success">
            <strong style={{ color: "white" }}>{message}</strong>
          </Toast>
        </ToastContainer>
      )}
      {error && (
        <ToastContainer>
          <Toast bg="danger">
            <strong style={{ color: "white" }}>{error}</strong>
          </Toast>
        </ToastContainer>
      )}

      <Row className="mt-3">
        <Col md={3}>
        <Form.Group className="mb-3">
            <Form.Label>Seleccionar Colaborador: </Form.Label>
            <SelectWithVirtualization
              options={optionColaboradores}
              value={
                optionColaboradores.find(
                  (option) => option.value === values.idColaborador
                ) ?? null
              }
              onChange={(selectedOption: any) => {
                const selectedValue = selectedOption ? selectedOption.value : "";
                setIdColaborador("idColaborador", selectedValue);
              }}
            />
        </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <h4>Fecha de inicio:</h4>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => setFechaInicio(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <h4>Fecha de fin:</h4>
            <DatePicker
              selected={fechaFin}
              onChange={(date) => setFechaFin(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          </Form.Group>
        </Col>
        <Col
          md={3}
          className="d-flex justify-content-center align-items-center"
        >
          <Button variant="primary" onClick={obtenerReporte} disabled={loading}>
            {loading ? "Cargando..." : "Consultar"} <Search />
          </Button>
          <Button variant="danger" className="ml-2" onClick={exportToExcel}>
            Exportar <Download />
          </Button>
        </Col>
      </Row>
      <br />
      <Table striped bordered responsive>
      <thead>
        <tr>
          <th>Colaborador</th>
          <th>Departamento</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((historial, index) => (
            <MemoizedTableRow key={index} historial={historial} onVerConstancia={handleVerConstancia} onDescargarConstancia={handleDescargarConstancia} />
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center">
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </Table>

    <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Visor de Constancia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContentUrl &&
            (
              (modalContentUrl.startsWith("blob:") || modalContentUrl.toLowerCase().endsWith(".pdf")) ? (
                <object data={modalContentUrl} type="application/pdf" width="100%" height="500px">
                  <p>This browser does not support PDFs. Please download the PDF to view it: <a href={modalContentUrl}>Download PDF</a>.</p>
                </object>
              ) : (
                <img
                  src={modalContentUrl}
                  alt="Constancia"
                  style={{ width: "100%" }}
                />
              )
            )
          }
        </Modal.Body>
      </Modal>
    </div>
  );
};

interface TableRowProps {
  historial: {
    idLicencia: number;
    nombreCompleto: string;
    departamento: string;
    fechaInicio: string;
    fechaFin: string;
    tipoLicencia: string;
    estadoLicencia: string;
    observaciones: string;
  };
  onVerConstancia: (idLicencia: number) => void;
  onDescargarConstancia: (idLicencia: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ historial, onVerConstancia, onDescargarConstancia }) => {
  return (
    <tr>
      <td>{historial.nombreCompleto}</td>
      <td>{historial.departamento}</td>
      <td>{new Date(historial.fechaInicio).toLocaleDateString()}</td>
      <td>{new Date(historial.fechaFin).toLocaleDateString()}</td>
      <td>{historial.tipoLicencia}</td>
      <td>{historial.estadoLicencia}</td>
      <td>{historial.observaciones}</td>
      <td>
        <Button variant="info" size="sm" onClick={() => onVerConstancia(historial.idLicencia)}>
          <Eye size={18} />
        </Button>
        <Button variant="success" size="sm" className="ml-2" onClick={() => onDescargarConstancia(historial.idLicencia)}>
          <Download size={18} />
        </Button>
      </td>
    </tr>
  );
};

const MemoizedTableRow = React.memo(TableRow);

export default HistorialLicencia;