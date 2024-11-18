import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Download } from "react-feather";
import ExcelJS from "exceljs";
import SelectWithVirtualization from "../../SelectWithVirtualization";
import useRrhh from "../../../hooks/useRrhh";
import { set } from "react-datepicker/dist/date_utils";
interface Values {
    idColaborador: number;
  }
const HistorialDepartamento: React.FC = () => {
  const [values, setValues] = useState<Values>({ idColaborador: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ colaborador, setColaborador] = useState<any[]>([]);
    const { listCollaborator,listarHistorialDepartamentoColaborador, listarHistorialDepartamento } = useRrhh();


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
      if (values.idColaborador) {
        fetchedData = await listarHistorialDepartamentoColaborador(values.idColaborador);
        console.log(fetchedData);
      } else {
        fetchedData = await listarHistorialDepartamento();
        console.log(fetchedData);
      }
      setData(fetchedData);
    } catch (err) {
      setError("Ocurrió un error al obtener el reporte.");
    } finally {
      setLoading(false);
    }
  }, [ listarHistorialDepartamentoColaborador, listarHistorialDepartamento, values.idColaborador]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [message, error]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ReporteHistorialDepartamentos");
  
    // Definir encabezados y estilo de encabezado
    const headers = ["Nombre Colaborador", "Departamento", "Fecha Inicio", "Fecha Fin"];
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
    link.download = `ReporteHistorialDepartamentos_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
        <Col md={4}>
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
        <Col
          md={4}
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
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((historial, index) => (
            <MemoizedTableRow key={index} historial={historial} />
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center">
              No hay datos disponibles
            </td>
          </tr>
        )}
      </tbody>
    </Table>
    </div>
  );
};

interface TableRowProps {
  historial: {
    nombreCompleto: string;
    departamento: string;
    fechaInicio: string;
    fechaFin: string;
  };
}

const TableRow: React.FC<TableRowProps> = ({ historial }) => {
  return (
    <tr>
      <td>{historial.nombreCompleto}</td>
      <td>{historial.departamento}</td>
      <td>{new Date(historial.fechaInicio).toLocaleDateString()}</td>
      <td>{new Date(historial.fechaFin).toLocaleDateString()}</td>
    </tr>
  );
};

const MemoizedTableRow = React.memo(TableRow);

export default HistorialDepartamento;