import { useCallback, useEffect, useState } from "react";
import useRrhh from "../../../hooks/useRrhh";
import { Button, Card, Form, Pagination, Table } from "react-bootstrap";
import { Edit2 } from "react-feather";
import { t } from "i18next";
import UpdateLicencias from "./UpdateSolicitud";
import { format } from "date-fns";
import { Search, Download } from "react-feather";
import ExcelJS from "exceljs";
import logo1Path from "../../../assets/img/solicitud/logo1.png";
import logo2Path from "../../../assets/img/solicitud/logo2.png";

interface Props {
    actualizarListado: boolean;
}

const ListarSolicitudes: React.FC<Props> = ({ actualizarListado }) => {
    const [showModal, setShowModal] = useState(false);
    const [colaborador, setColaborador] = useState<any[]>([]);
    const [licencia, setLicencia] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        nombreColaborador: "",
        estadoLicencia: "",
        tipoLicencia: "",
    });
    const {  listarLicencia } = useRrhh();

    const [idLicencia, setIdLicencia] = useState<number | null>(null);
    const [idColaborador, setIdColaborador] = useState<number | null>(null);
    const [idEstadoLicencia, setIdEstadoLicencia] = useState<number | null>(null);
    const [idTipoLicencia, setIdTipoLicencia] = useState<number | null>(null);
    const [fechaInicio, setFechaInicio] = useState<Date>();
    const [fechaFin, setFechaFin] = useState<Date>();
    const [observaciones, setObservaciones] = useState<string>("");
    

    useEffect(() => {
        listarLicencias();
    }, [actualizarListado, currentPage, tasksPerPage]);

    const listarLicencias = async () => {
        try{
            const listado = await listarLicencia();
            console.log(listado);
            setLicencia(listado);
        }catch (error) {
            setError("Error al cargar las licencias.");
        }
    };
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: value,
    }));
    }, []);
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(Math.ceil(licencia.length / tasksPerPage));
    const goToNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(licencia.length / tasksPerPage)));
    const goToPrevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));  
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = licencia.slice(indexOfFirstTask, indexOfLastTask);

    const filteredTasks = licencia.filter((item) =>
        Object.keys(filters).every((key) =>
        item[key].toLowerCase().includes(filters[key].toLowerCase())
        )
    );
    const handleEdit = (
        id: number,
        idColaborador: number,
        idEstadoLicencia: number,
        idTipoLicencia: number,
        fechaInicio: Date,
        fechaFin: Date,
        observaciones: string

    ) => {
        setShowModal(true);
        setIdLicencia(id);
        setIdColaborador(idColaborador);
        setIdEstadoLicencia(idEstadoLicencia);
        setIdTipoLicencia(idTipoLicencia);
        setFechaInicio(fechaInicio);
        setFechaFin(fechaFin);
        setObservaciones(observaciones);
    }
    const handleUpdateList = async () => {
        await listarLicencias();
    };
// Función para convertir una imagen a base64
const getBase64ImageFromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Error al convertir la imagen a Base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const handleDownload = (
    id: number,
    idColaborador: number,
    idEstadoLicencia: number,
    idTipoLicencia: number,
    fechaInicio: Date,
    fechaFin: Date,
    observaciones: string,
    dpi: string,
  ) => {
    if (idTipoLicencia === 1) {
        exportSolicitudVacaciones(fechaInicio, fechaFin);
    }
    if (idTipoLicencia === 2) {
        exportSolicitudMedica(fechaInicio, fechaFin);
    }
    if (idTipoLicencia === 3) {
        exportSolicitudIGSS(fechaInicio, fechaFin);
    }
    if (idTipoLicencia === 4) {
        exportSolicitudCumpleanios(fechaInicio, fechaFin, dpi);
    }
    if (idTipoLicencia === 5) {
        exportSolicitudCongreso(fechaInicio, fechaFin);
    }
    
  }

  const exportSolicitudVacaciones = async ( fechaInicio:Date, fechaFin:Date) => {
    const fecha = new Date();
    const diaActual = fecha.getDate(); // Día del mes
    const mesActual = fecha.toLocaleString("es-ES", { month: "long" }); // Nombre del mes en español
    const añoActual = fecha.getFullYear(); // Año actual
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SolicitudVacaciones");
  
    // Convertir las imágenes a base64
    const logo1Base64 = await getBase64ImageFromUrl(logo1Path);
    const logo2Base64 = await getBase64ImageFromUrl(logo2Path);
  
    // Agregar las imágenes al workbook
    const logo1 = workbook.addImage({
      base64: logo1Base64.split(',')[1],
      extension: 'png',
    });
  
    const logo2 = workbook.addImage({
      base64: logo2Base64.split(',')[1],
      extension: 'png',
    });
      // Calcular el ancho total de las celdas fusionadas
  const columnWidth = 11; // Ancho de cada columna
  const mergedCellWidth1 = columnWidth * 4; // A1:D5 (4 columnas)
  const mergedCellWidth2 = columnWidth * 3; // F1:H5 (3 columnas)
     // Posicionar las imágenes en las celdas deseadas
     worksheet.mergeCells("A1:D5");
     worksheet.addImage(logo1, {
       tl: { col: 0, row: 0 },
       ext: { width: mergedCellWidth1 * 7.5, height: 100 }, // Ajustar el ancho de la imagen
     });
   
     worksheet.mergeCells("F1:H5");
     worksheet.addImage(logo2, {
       tl: { col: 5, row: 0 },
       ext: { width: mergedCellWidth2 * 7, height: 100 }, // Ajustar el ancho de la imagen
     });
        // Datos de la solicitud
        worksheet.mergeCells("A6:C6");
        worksheet.getCell("C6").value = "Quetzaltenango";
        worksheet.getCell("C6").alignment = { horizontal: "center" };
    
        worksheet.getCell("D6").value = diaActual;
        worksheet.getCell("D6").alignment = { horizontal: "center" };
        worksheet.getCell("D6").font = { bold: true };
        worksheet.getCell("D6").border = {
          bottom: { style: 'thin' },
        };
        worksheet.getCell("F6").value = "DE";
        worksheet.getCell("F6").alignment = { horizontal: "center" };
    
        worksheet.getCell("G6").value = mesActual;
        worksheet.getCell("G6").alignment = { horizontal: "center" };
        worksheet.getCell("G6").font = { bold: true };
        worksheet.getCell("G6").border = {
          bottom: { style: 'thin' },
        };
    
        worksheet.getCell("H6").value = añoActual;
        worksheet.getCell("H6").alignment = { horizontal: "center" };
        worksheet.getCell("H6").font = { bold: true };
        worksheet.getCell("H6").border = {
          bottom: { style: 'thin' },
        };
        // Cuerpo de la solicitud
        worksheet.mergeCells("A8:B8");
        worksheet.getCell("A8").value = "Señor Director:";
        worksheet.getCell("A8").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A8").font = { bold: true };
        worksheet.mergeCells("A9:C9");
        worksheet.getCell("A9").value = "Hospital Regional de Occidente";
        worksheet.getCell("A9").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A9").font = { bold: true };
        worksheet.mergeCells("A10:B10");
        worksheet.getCell("A10").value = "Su Despacho";
        worksheet.getCell("A10").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A10").font = { bold: true };
      
        worksheet.mergeCells("A12:F12");
        worksheet.getCell("A12").value = "Atentamente me dirijo a usted, para solicitarle se sirva autorizarme:";
        worksheet.getCell("A12").alignment = { horizontal: "left" };
        worksheet.getCell("A12").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("G12:H12");
        worksheet.getCell("G12").value = "QUINCE (15) DIAS HABILES";
        worksheet.getCell("G12").alignment = { horizontal: "left" };
        worksheet.getCell("G12").border = {
            bottom: { style: 'thin' },
          };
      
        worksheet.mergeCells("A13:H13");
        worksheet.getCell("A13").value = "A CUENTA DE VACACIONES PER 2024-2025 adjunto JUSTIFICACION";
        worksheet.getCell("A13").alignment = { horizontal: "left" };
        worksheet.getCell("A13").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A14:H14");
        worksheet.getCell("A14").value = "";
        worksheet.getCell("A14").alignment = { horizontal: "left" };
        worksheet.getCell("A14").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A15:H15");
        worksheet.getCell("A15").value = "";
        worksheet.getCell("A15").alignment = { horizontal: "left" };
        worksheet.getCell("A15").border = {
            bottom: { style: 'thin' },
          };

        // Rango de fechas
        worksheet.getCell("A17").value = "Del";
        worksheet.getCell("A17").alignment = { horizontal: "center" };

        worksheet.mergeCells("B17:D17");
        worksheet.getCell("B17").value = fechaInicio.toLocaleDateString();
        worksheet.getCell("B17").alignment = { horizontal: "center" };
        worksheet.getCell("B17").border = {
            bottom: { style: 'thin' },
          };

        worksheet.getCell("E17").value = "Al";
        worksheet.getCell("E17").alignment = { horizontal: "center" };

        worksheet.mergeCells("F17:H17");
        worksheet.getCell("F17").value = fechaFin.toLocaleDateString();
        worksheet.getCell("F17").alignment = { horizontal: "center" };
        worksheet.getCell("F17").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("B18:H18");
        worksheet.getCell("D18").value = "SUJETO A PREVIA AUTORIZACION DEL JEFE INMEDIATO";
        worksheet.getCell("D18").alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell("D18").font = { bold: true };

        worksheet.getCell("A19").value = "Atentamente:";
        worksheet.getCell("A19").alignment = { horizontal: "left" };

        // Firmas y cargos
        worksheet.mergeCells("A22:C22");
        worksheet.getCell("A22").value = "VINICIO JOSE PEREYRA CASTILLO";
        worksheet.getCell("A22").alignment = { horizontal: "center" };
        worksheet.getCell("A22").border = {
            top: { style: 'thin' },
          };

        worksheet.getCell("B23").value = "11";
        worksheet.getCell("B23").alignment = { horizontal: "center" };
      
        worksheet.mergeCells("D22:E22");
        worksheet.getCell("D22").value = "JEFE DE SERVICIO";
        worksheet.getCell("D22").alignment = { horizontal: "center" };
        worksheet.getCell("D22").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("G22:H22");
        worksheet.getCell("G22").value = "JEFE DE DEPARTAMENTO";
        worksheet.getCell("G22").alignment = { horizontal: "center" };
        worksheet.getCell("G22").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("A25:D25");
        worksheet.getCell("A25").value = "JEFE DE PERSONAL";
        worksheet.getCell("A25").alignment = { horizontal: "center" };
        worksheet.getCell("A25").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("F25:H25");
        worksheet.getCell("F25").value = "DIRECCION EJECUTIVA ";
        worksheet.getCell("F25").alignment = { horizontal: "center" };
        worksheet.getCell("F25").border = {
            top: { style: 'thin' },
          };

        worksheet.mergeCells("A26:D26");
        worksheet.getCell("A26").value = "VP";
        worksheet.getCell("A26").alignment = { horizontal: "center" };

        worksheet.mergeCells("F26:H26");
        worksheet.getCell("F26").value = "Y/O SUBDIRECCION";
        worksheet.getCell("F26").alignment = { horizontal: "center" };

        // Ajustar ancho de las columnas para que el contenido se vea mejor
        worksheet.columns.forEach((column) => {
          column.width = 11.2;
        });
      
        // Exportar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `SolicitudVacaciones_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
      };
  const exportSolicitudCongreso = async ( fechaInicio:Date, fechaFin:Date) => {
    const fecha = new Date();
    const diaActual = fecha.getDate(); // Día del mes
    const mesActual = fecha.toLocaleString("es-ES", { month: "long" }); // Nombre del mes en español
    const añoActual = fecha.getFullYear(); // Año actual
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SolicitudCongreso");
  
    // Convertir las imágenes a base64
    const logo1Base64 = await getBase64ImageFromUrl(logo1Path);
    const logo2Base64 = await getBase64ImageFromUrl(logo2Path);
  
    // Agregar las imágenes al workbook
    const logo1 = workbook.addImage({
      base64: logo1Base64.split(',')[1],
      extension: 'png',
    });
  
    const logo2 = workbook.addImage({
      base64: logo2Base64.split(',')[1],
      extension: 'png',
    });
      // Calcular el ancho total de las celdas fusionadas
  const columnWidth = 11; // Ancho de cada columna
  const mergedCellWidth1 = columnWidth * 4; // A1:D5 (4 columnas)
  const mergedCellWidth2 = columnWidth * 3; // F1:H5 (3 columnas)
     // Posicionar las imágenes en las celdas deseadas
     worksheet.mergeCells("A1:D5");
     worksheet.addImage(logo1, {
       tl: { col: 0, row: 0 },
       ext: { width: mergedCellWidth1 * 7.5, height: 100 }, // Ajustar el ancho de la imagen
     });
   
     worksheet.mergeCells("F1:H5");
     worksheet.addImage(logo2, {
       tl: { col: 5, row: 0 },
       ext: { width: mergedCellWidth2 * 7, height: 100 }, // Ajustar el ancho de la imagen
     });
        // Datos de la solicitud
        worksheet.mergeCells("A6:C6");
        worksheet.getCell("C6").value = "Quetzaltenango";
        worksheet.getCell("C6").alignment = { horizontal: "center" };
    
        worksheet.getCell("D6").value = diaActual;
        worksheet.getCell("D6").alignment = { horizontal: "center" };
        worksheet.getCell("D6").font = { bold: true };
        worksheet.getCell("D6").border = {
          bottom: { style: 'thin' },
        };
        worksheet.getCell("F6").value = "DE";
        worksheet.getCell("F6").alignment = { horizontal: "center" };
    
        worksheet.getCell("G6").value = mesActual;
        worksheet.getCell("G6").alignment = { horizontal: "center" };
        worksheet.getCell("G6").font = { bold: true };
        worksheet.getCell("G6").border = {
          bottom: { style: 'thin' },
        };
    
        worksheet.getCell("H6").value = añoActual;
        worksheet.getCell("H6").alignment = { horizontal: "center" };
        worksheet.getCell("H6").font = { bold: true };
        worksheet.getCell("H6").border = {
          bottom: { style: 'thin' },
        };
        // Cuerpo de la solicitud
        worksheet.mergeCells("A8:B8");
        worksheet.getCell("A8").value = "Señores Recursos Humanos:";
        worksheet.getCell("A8").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A8").font = { bold: true };
        worksheet.mergeCells("A9:C9");
        worksheet.getCell("A9").value = "Hospital Regional de Occidente";
        worksheet.getCell("A9").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A9").font = { bold: true };
      
        worksheet.mergeCells("A12:F12");
        worksheet.getCell("A12").value = "Atentamente me dirijo a usted, para solicitarle se sirva autorizarme:";
        worksheet.getCell("A12").alignment = { horizontal: "left" };
        worksheet.getCell("A12").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("G12:H12");
        worksheet.getCell("G12").value = "(2) DIAS HABILES";
        worksheet.getCell("G12").alignment = { horizontal: "left" };
        worksheet.getCell("G12").border = {
            bottom: { style: 'thin' },
          };
      
        worksheet.mergeCells("A13:H13");
        worksheet.getCell("A13").value = "por reposicion de tiempo ya laborado";
        worksheet.getCell("A13").alignment = { horizontal: "left" };
        worksheet.getCell("A13").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A14:H14");
        worksheet.getCell("A14").value = "";
        worksheet.getCell("A14").alignment = { horizontal: "left" };
        worksheet.getCell("A14").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A15:H15");
        worksheet.getCell("A15").value = "";
        worksheet.getCell("A15").alignment = { horizontal: "left" };
        worksheet.getCell("A15").border = {
            bottom: { style: 'thin' },
          };

        // Rango de fechas
        worksheet.getCell("A17").value = "Del";
        worksheet.getCell("A17").alignment = { horizontal: "center" };

        worksheet.mergeCells("B17:D17");
        worksheet.getCell("B17").value = fechaInicio.toLocaleDateString();
        worksheet.getCell("B17").alignment = { horizontal: "center" };
        worksheet.getCell("B17").border = {
            bottom: { style: 'thin' },
          };

        worksheet.getCell("E17").value = "Al";
        worksheet.getCell("E17").alignment = { horizontal: "center" };

        worksheet.mergeCells("F17:H17");
        worksheet.getCell("F17").value = fechaFin.toLocaleDateString();
        worksheet.getCell("F17").alignment = { horizontal: "center" };
        worksheet.getCell("F17").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("B18:H18");
        worksheet.getCell("D18").value = "SUJETO A PREVIA AUTORIZACION DEL JEFE INMEDIATO";
        worksheet.getCell("D18").alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell("D18").font = { bold: true };

        worksheet.getCell("A19").value = "Atentamente:";
        worksheet.getCell("A19").alignment = { horizontal: "left" };

        // Firmas y cargos
        worksheet.mergeCells("A22:C22");
        worksheet.getCell("A22").value = "SANTOS MERCEDES GOMEZ";
        worksheet.getCell("A22").alignment = { horizontal: "center" };
        worksheet.getCell("A22").border = {
            top: { style: 'thin' },
          };

        worksheet.getCell("B23").value = "11";
        worksheet.getCell("B23").alignment = { horizontal: "center" };
      
        worksheet.mergeCells("D22:E22");
        worksheet.getCell("D22").value = "JEFE DE SERVICIO (si aplica)";
        worksheet.getCell("D22").alignment = { horizontal: "center" };
        worksheet.getCell("D22").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("G22:H22");
        worksheet.getCell("G22").value = "JEFE DE DEPARTAMENTO";
        worksheet.getCell("G22").alignment = { horizontal: "center" };
        worksheet.getCell("G22").border = {
            top: { style: 'thin' },
          };
        worksheet.mergeCells("D26:E27");
        worksheet.getCell("D26").value = "Oficina De Recursos Humanos (firma y sello) ";
        worksheet.getCell("D26").alignment = { horizontal: "center", wrapText: true  };
        worksheet.getCell("D26").border = {
            top: { style: 'thin' },
          };

        // Ajustar ancho de las columnas para que el contenido se vea mejor
        worksheet.columns.forEach((column) => {
          column.width = 11.2;
        });
      
        // Exportar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `SolicitudCongreso_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
      };
  const exportSolicitudIGSS = async ( fechaInicio:Date, fechaFin:Date) => {
    const fecha = new Date();
    const diaActual = fecha.getDate(); // Día del mes
    const mesActual = fecha.toLocaleString("es-ES", { month: "long" }); // Nombre del mes en español
    const añoActual = fecha.getFullYear(); // Año actual
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SolicitudIGSS");
  
    // Convertir las imágenes a base64
    const logo1Base64 = await getBase64ImageFromUrl(logo1Path);
    const logo2Base64 = await getBase64ImageFromUrl(logo2Path);
  
    // Agregar las imágenes al workbook
    const logo1 = workbook.addImage({
      base64: logo1Base64.split(',')[1],
      extension: 'png',
    });
  
    const logo2 = workbook.addImage({
      base64: logo2Base64.split(',')[1],
      extension: 'png',
    });
      // Calcular el ancho total de las celdas fusionadas
  const columnWidth = 11; // Ancho de cada columna
  const mergedCellWidth1 = columnWidth * 4; // A1:D5 (4 columnas)
  const mergedCellWidth2 = columnWidth * 3; // F1:H5 (3 columnas)
     // Posicionar las imágenes en las celdas deseadas
     worksheet.mergeCells("A1:D5");
     worksheet.addImage(logo1, {
       tl: { col: 0, row: 0 },
       ext: { width: mergedCellWidth1 * 7.5, height: 100 }, // Ajustar el ancho de la imagen
     });
   
     worksheet.mergeCells("F1:H5");
     worksheet.addImage(logo2, {
       tl: { col: 5, row: 0 },
       ext: { width: mergedCellWidth2 * 7, height: 100 }, // Ajustar el ancho de la imagen
     });
        // Datos de la solicitud
        worksheet.mergeCells("A6:C6");
        worksheet.getCell("C6").value = "Quetzaltenango";
        worksheet.getCell("C6").alignment = { horizontal: "center" };
    
        worksheet.getCell("D6").value = diaActual;
        worksheet.getCell("D6").alignment = { horizontal: "center" };
        worksheet.getCell("D6").font = { bold: true };
        worksheet.getCell("D6").border = {
          bottom: { style: 'thin' },
        };
        worksheet.getCell("F6").value = "DE";
        worksheet.getCell("F6").alignment = { horizontal: "center" };
    
        worksheet.getCell("G6").value = mesActual;
        worksheet.getCell("G6").alignment = { horizontal: "center" };
        worksheet.getCell("G6").font = { bold: true };
        worksheet.getCell("G6").border = {
          bottom: { style: 'thin' },
        };
    
        worksheet.getCell("H6").value = añoActual;
        worksheet.getCell("H6").alignment = { horizontal: "center" };
        worksheet.getCell("H6").font = { bold: true };
        worksheet.getCell("H6").border = {
          bottom: { style: 'thin' },
        };
        // Cuerpo de la solicitud
        worksheet.mergeCells("A8:B8");
        worksheet.getCell("A8").value = "Señores Recursos Humanos:";
        worksheet.getCell("A8").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A8").font = { bold: true };
        worksheet.mergeCells("A9:C9");
        worksheet.getCell("A9").value = "Hospital Regional de Occidente";
        worksheet.getCell("A9").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A9").font = { bold: true };
      
        worksheet.mergeCells("A12:F12");
        worksheet.getCell("A12").value = "Atentamente me dirijo a ustedes, para solicitarles se sirva autorizarme:";
        worksheet.getCell("A12").alignment = { horizontal: "left" };
        worksheet.getCell("A12").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("G12:H12");
        worksheet.getCell("G12").value = "(1) DIA HABIL";
        worksheet.getCell("G12").alignment = { horizontal: "left" };
        worksheet.getCell("G12").border = {
            bottom: { style: 'thin' },
          };
      
        worksheet.mergeCells("A13:H13");
        worksheet.getCell("A13").value = "POR CITA AL IGSS";
        worksheet.getCell("A13").alignment = { horizontal: "left" };
        worksheet.getCell("A13").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A14:H14");
        worksheet.getCell("A14").value = "";
        worksheet.getCell("A14").alignment = { horizontal: "left" };
        worksheet.getCell("A14").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A15:H15");
        worksheet.getCell("A15").value = "";
        worksheet.getCell("A15").alignment = { horizontal: "left" };
        worksheet.getCell("A15").border = {
            bottom: { style: 'thin' },
          };

        // Rango de fechas
        worksheet.getCell("A17").value = "Del";
        worksheet.getCell("A17").alignment = { horizontal: "center" };

        worksheet.mergeCells("B17:D17");
        worksheet.getCell("B17").value = fechaInicio.toLocaleDateString();
        worksheet.getCell("B17").alignment = { horizontal: "center" };
        worksheet.getCell("B17").border = {
            bottom: { style: 'thin' },
          };

        worksheet.getCell("E17").value = "Al";
        worksheet.getCell("E17").alignment = { horizontal: "center" };

        worksheet.mergeCells("F17:H17");
        worksheet.getCell("F17").value = fechaFin.toLocaleDateString();
        worksheet.getCell("F17").alignment = { horizontal: "center" };
        worksheet.getCell("F17").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("B18:H18");
        worksheet.getCell("D18").value = "SUJETO A PREVIA AUTORIZACION DEL JEFE INMEDIATO";
        worksheet.getCell("D18").alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell("D18").font = { bold: true };

        worksheet.getCell("A19").value = "Atentamente:";
        worksheet.getCell("A19").alignment = { horizontal: "left" };

        // Firmas y cargos
        worksheet.mergeCells("A22:C22");
        worksheet.getCell("A22").value = "SANDRA ETELBINA RAMIREZ";
        worksheet.getCell("A22").alignment = { horizontal: "center" };
        worksheet.getCell("A22").border = {
            top: { style: 'thin' },
          };

        worksheet.getCell("B23").value = "11";
        worksheet.getCell("B23").alignment = { horizontal: "center" };
      
        worksheet.mergeCells("D22:E22");
        worksheet.getCell("D22").value = "JEFE DE SERVICIO(si aplica)";
        worksheet.getCell("D22").alignment = { horizontal: "center" };
        worksheet.getCell("D22").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("G22:H22");
        worksheet.getCell("G22").value = "JEFE DE DEPARTAMENTO";
        worksheet.getCell("G22").alignment = { horizontal: "center" };
        worksheet.getCell("G22").border = {
            top: { style: 'thin' },
          };
        worksheet.mergeCells("D26:E27");
        worksheet.getCell("D26").value = "Oficina De Recursos Humanos (firma y sello) ";
        worksheet.getCell("D26").alignment = { horizontal: "center", wrapText: true  };
        worksheet.getCell("D26").border = {
            top: { style: 'thin' },
          };

        // Ajustar ancho de las columnas para que el contenido se vea mejor
        worksheet.columns.forEach((column) => {
          column.width = 11.2;
        });
      
        // Exportar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `SolicitudIGSS_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
      };
  const exportSolicitudCumpleanios = async ( fechaInicio:Date, fechaFin:Date, dpi:string) => {
    const fecha = new Date();
    const diaActual = fecha.getDate(); // Día del mes
    const mesActual = fecha.toLocaleString("es-ES", { month: "long" }); // Nombre del mes en español
    const añoActual = fecha.getFullYear(); // Año actual
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SolicitudCumpleaños");
  
    // Convertir las imágenes a base64
    const logo1Base64 = await getBase64ImageFromUrl(logo1Path);
    const logo2Base64 = await getBase64ImageFromUrl(logo2Path);
  
    // Agregar las imágenes al workbook
    const logo1 = workbook.addImage({
      base64: logo1Base64.split(',')[1],
      extension: 'png',
    });
  
    const logo2 = workbook.addImage({
      base64: logo2Base64.split(',')[1],
      extension: 'png',
    });
      // Calcular el ancho total de las celdas fusionadas
  const columnWidth = 11; // Ancho de cada columna
  const mergedCellWidth1 = columnWidth * 4; // A1:D5 (4 columnas)
  const mergedCellWidth2 = columnWidth * 3; // F1:H5 (3 columnas)
     // Posicionar las imágenes en las celdas deseadas
     worksheet.mergeCells("A1:D5");
     worksheet.addImage(logo1, {
       tl: { col: 0, row: 0 },
       ext: { width: mergedCellWidth1 * 7.5, height: 100 }, // Ajustar el ancho de la imagen
     });
   
     worksheet.mergeCells("F1:H5");
     worksheet.addImage(logo2, {
       tl: { col: 5, row: 0 },
       ext: { width: mergedCellWidth2 * 7, height: 100 }, // Ajustar el ancho de la imagen
     });
        // Datos de la solicitud
        worksheet.mergeCells("A6:C6");
        worksheet.getCell("C6").value = "Quetzaltenango";
        worksheet.getCell("C6").alignment = { horizontal: "center" };
    
        worksheet.getCell("D6").value = diaActual;
        worksheet.getCell("D6").alignment = { horizontal: "center" };
        worksheet.getCell("D6").font = { bold: true };
        worksheet.getCell("D6").border = {
          bottom: { style: 'thin' },
        };
        worksheet.getCell("F6").value = "DE";
        worksheet.getCell("F6").alignment = { horizontal: "center" };
    
        worksheet.getCell("G6").value = mesActual;
        worksheet.getCell("G6").alignment = { horizontal: "center" };
        worksheet.getCell("G6").font = { bold: true };
        worksheet.getCell("G6").border = {
          bottom: { style: 'thin' },
        };
    
        worksheet.getCell("H6").value = añoActual;
        worksheet.getCell("H6").alignment = { horizontal: "center" };
        worksheet.getCell("H6").font = { bold: true };
        worksheet.getCell("H6").border = {
          bottom: { style: 'thin' },
        };
        // Cuerpo de la solicitud
        worksheet.mergeCells("A8:B8");
        worksheet.getCell("A8").value = "Señores Recursos Humanos:";
        worksheet.getCell("A8").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A8").font = { bold: true };
        worksheet.mergeCells("A9:C9");
        worksheet.getCell("A9").value = "Hospital Regional de Occidente";
        worksheet.getCell("A9").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A9").font = { bold: true };
      
        worksheet.mergeCells("A12:F12");
        worksheet.getCell("A12").value = "Atentamente me dirijo a ustedes, para solicitarles se sirva autorizarme:";
        worksheet.getCell("A12").alignment = { horizontal: "left" };
        worksheet.getCell("A12").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("G12:H12");
        worksheet.getCell("G12").value = "(1) DIA HABIL";
        worksheet.getCell("G12").alignment = { horizontal: "left" };
        worksheet.getCell("G12").border = {
            bottom: { style: 'thin' },
          };
      
        worksheet.mergeCells("A13:H13");
        worksheet.getCell("A13").value = "POR CUMPLEAÑOS ADJUNTO COPIA DE DPI  " + dpi;
        worksheet.getCell("A13").alignment = { horizontal: "left" };
        worksheet.getCell("A13").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A14:H14");
        worksheet.getCell("A14").value = "";
        worksheet.getCell("A14").alignment = { horizontal: "left" };
        worksheet.getCell("A14").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A15:H15");
        worksheet.getCell("A15").value = "";
        worksheet.getCell("A15").alignment = { horizontal: "left" };
        worksheet.getCell("A15").border = {
            bottom: { style: 'thin' },
          };

        // Rango de fechas
        worksheet.getCell("A17").value = "Del";
        worksheet.getCell("A17").alignment = { horizontal: "center" };

        worksheet.mergeCells("B17:D17");
        worksheet.getCell("B17").value = fechaInicio.toLocaleDateString();
        worksheet.getCell("B17").alignment = { horizontal: "center" };
        worksheet.getCell("B17").border = {
            bottom: { style: 'thin' },
          };

        worksheet.getCell("E17").value = "Al";
        worksheet.getCell("E17").alignment = { horizontal: "center" };

        worksheet.mergeCells("F17:H17");
        worksheet.getCell("F17").value = fechaFin.toLocaleDateString();
        worksheet.getCell("F17").alignment = { horizontal: "center" };
        worksheet.getCell("F17").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("B18:H18");
        worksheet.getCell("D18").value = "SUJETO A PREVIA AUTORIZACION DEL JEFE INMEDIATO";
        worksheet.getCell("D18").alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell("D18").font = { bold: true };

        worksheet.getCell("A19").value = "Atentamente:";
        worksheet.getCell("A19").alignment = { horizontal: "left" };

        // Firmas y cargos
        worksheet.mergeCells("A22:C22");
        worksheet.getCell("A22").value = "SANDRA ETELBINA RAMIREZ";
        worksheet.getCell("A22").alignment = { horizontal: "center" };
        worksheet.getCell("A22").border = {
            top: { style: 'thin' },
          };

        worksheet.getCell("B23").value = "11";
        worksheet.getCell("B23").alignment = { horizontal: "center" };
      
        worksheet.mergeCells("D22:E22");
        worksheet.getCell("D22").value = "JEFE DE SERVICIO(si aplica)";
        worksheet.getCell("D22").alignment = { horizontal: "center" };
        worksheet.getCell("D22").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("G22:H22");
        worksheet.getCell("G22").value = "JEFE DE DEPARTAMENTO";
        worksheet.getCell("G22").alignment = { horizontal: "center" };
        worksheet.getCell("G22").border = {
            top: { style: 'thin' },
          };
        worksheet.mergeCells("D26:E27");
        worksheet.getCell("D26").value = "Oficina De Recursos Humanos (firma y sello) ";
        worksheet.getCell("D26").alignment = { horizontal: "center", wrapText: true  };
        worksheet.getCell("D26").border = {
            top: { style: 'thin' },
          };

        // Ajustar ancho de las columnas para que el contenido se vea mejor
        worksheet.columns.forEach((column) => {
          column.width = 11.2;
        });
      
        // Exportar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `SolicitudCumpleaños_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
      };
  const exportSolicitudMedica = async ( fechaInicio:Date, fechaFin:Date) => {
    const fecha = new Date();
    const diaActual = fecha.getDate(); // Día del mes
    const mesActual = fecha.toLocaleString("es-ES", { month: "long" }); // Nombre del mes en español
    const añoActual = fecha.getFullYear(); // Año actual
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SolicitudMedica");
  
    // Convertir las imágenes a base64
    const logo1Base64 = await getBase64ImageFromUrl(logo1Path);
    const logo2Base64 = await getBase64ImageFromUrl(logo2Path);
  
    // Agregar las imágenes al workbook
    const logo1 = workbook.addImage({
      base64: logo1Base64.split(',')[1],
      extension: 'png',
    });
  
    const logo2 = workbook.addImage({
      base64: logo2Base64.split(',')[1],
      extension: 'png',
    });
      // Calcular el ancho total de las celdas fusionadas
  const columnWidth = 11; // Ancho de cada columna
  const mergedCellWidth1 = columnWidth * 4; // A1:D5 (4 columnas)
  const mergedCellWidth2 = columnWidth * 3; // F1:H5 (3 columnas)
     // Posicionar las imágenes en las celdas deseadas
     worksheet.mergeCells("A1:D5");
     worksheet.addImage(logo1, {
       tl: { col: 0, row: 0 },
       ext: { width: mergedCellWidth1 * 7.5, height: 100 }, // Ajustar el ancho de la imagen
     });
   
     worksheet.mergeCells("F1:H5");
     worksheet.addImage(logo2, {
       tl: { col: 5, row: 0 },
       ext: { width: mergedCellWidth2 * 7, height: 100 }, // Ajustar el ancho de la imagen
     });
        // Datos de la solicitud
        worksheet.mergeCells("A6:C6");
        worksheet.getCell("C6").value = "Quetzaltenango";
        worksheet.getCell("C6").alignment = { horizontal: "center" };
    
        worksheet.getCell("D6").value = diaActual;
        worksheet.getCell("D6").alignment = { horizontal: "center" };
        worksheet.getCell("D6").font = { bold: true };
        worksheet.getCell("D6").border = {
          bottom: { style: 'thin' },
        };
        worksheet.getCell("F6").value = "DE";
        worksheet.getCell("F6").alignment = { horizontal: "center" };
    
        worksheet.getCell("G6").value = mesActual;
        worksheet.getCell("G6").alignment = { horizontal: "center" };
        worksheet.getCell("G6").font = { bold: true };
        worksheet.getCell("G6").border = {
          bottom: { style: 'thin' },
        };
    
        worksheet.getCell("H6").value = añoActual;
        worksheet.getCell("H6").alignment = { horizontal: "center" };
        worksheet.getCell("H6").font = { bold: true };
        worksheet.getCell("H6").border = {
          bottom: { style: 'thin' },
        };
        // Cuerpo de la solicitud
        worksheet.mergeCells("A8:B8");
        worksheet.getCell("A8").value = "Señores Recursos Humanos:";
        worksheet.getCell("A8").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A8").font = { bold: true };
        worksheet.mergeCells("A9:C9");
        worksheet.getCell("A9").value = "Hospital Regional de Occidente";
        worksheet.getCell("A9").alignment = { horizontal: "left", wrapText: true };
        worksheet.getCell("A9").font = { bold: true };
      
        worksheet.mergeCells("A12:F12");
        worksheet.getCell("A12").value = "Atentamente me dirijo a ustedes, para solicitarles se sirva autorizarme:";
        worksheet.getCell("A12").alignment = { horizontal: "left" };
        worksheet.getCell("A12").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("G12:H12");
        worksheet.getCell("G12").value = "(2) DIAS HABILES";
        worksheet.getCell("G12").alignment = { horizontal: "left" };
        worksheet.getCell("G12").border = {
            bottom: { style: 'thin' },
          };
      
        worksheet.mergeCells("A13:H13");
        worksheet.getCell("A13").value = "POR SUSPENSION MEDICA   " ;
        worksheet.getCell("A13").alignment = { horizontal: "left" };
        worksheet.getCell("A13").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A14:H14");
        worksheet.getCell("A14").value = "";
        worksheet.getCell("A14").alignment = { horizontal: "left" };
        worksheet.getCell("A14").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("A15:H15");
        worksheet.getCell("A15").value = "";
        worksheet.getCell("A15").alignment = { horizontal: "left" };
        worksheet.getCell("A15").border = {
            bottom: { style: 'thin' },
          };

        // Rango de fechas
        worksheet.getCell("A17").value = "Del";
        worksheet.getCell("A17").alignment = { horizontal: "center" };

        worksheet.mergeCells("B17:D17");
        worksheet.getCell("B17").value = fechaInicio.toLocaleDateString();
        worksheet.getCell("B17").alignment = { horizontal: "center" };
        worksheet.getCell("B17").border = {
            bottom: { style: 'thin' },
          };

        worksheet.getCell("E17").value = "Al";
        worksheet.getCell("E17").alignment = { horizontal: "center" };

        worksheet.mergeCells("F17:H17");
        worksheet.getCell("F17").value = fechaFin.toLocaleDateString();
        worksheet.getCell("F17").alignment = { horizontal: "center" };
        worksheet.getCell("F17").border = {
            bottom: { style: 'thin' },
          };
        worksheet.mergeCells("B18:H18");
        worksheet.getCell("D18").value = "SUJETO A PREVIA AUTORIZACION DEL JEFE INMEDIATO";
        worksheet.getCell("D18").alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell("D18").font = { bold: true };

        worksheet.getCell("A19").value = "Atentamente:";
        worksheet.getCell("A19").alignment = { horizontal: "left" };

        // Firmas y cargos
        worksheet.mergeCells("A22:C22");
        worksheet.getCell("A22").value = "DANNY AROLDO MORALES ";
        worksheet.getCell("A22").alignment = { horizontal: "center" };
        worksheet.getCell("A22").border = {
            top: { style: 'thin' },
          };

        worksheet.getCell("B23").value = "Personal 011";
        worksheet.getCell("B23").alignment = { horizontal: "center" };
      
        worksheet.mergeCells("D22:E22");
        worksheet.getCell("D22").value = "JEFE DE SERVICIO(si aplica)";
        worksheet.getCell("D22").alignment = { horizontal: "center" };
        worksheet.getCell("D22").border = {
            top: { style: 'thin' },
          };
      
        worksheet.mergeCells("G22:H22");
        worksheet.getCell("G22").value = "JEFE DE DEPARTAMENTO";
        worksheet.getCell("G22").alignment = { horizontal: "center" };
        worksheet.getCell("G22").border = {
            top: { style: 'thin' },
          };
        worksheet.mergeCells("D26:E27");
        worksheet.getCell("D26").value = "Oficina De Recursos Humanos (firma y sello) ";
        worksheet.getCell("D26").alignment = { horizontal: "center", wrapText: true  };
        worksheet.getCell("D26").border = {
            top: { style: 'thin' },
          };

        // Ajustar ancho de las columnas para que el contenido se vea mejor
        worksheet.columns.forEach((column) => {
          column.width = 11.2;
        });
      
        // Exportar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `SolicitudCumpleaños_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
      };

    return (
        <div>
            <Card>
                <Table striped bordered style={{ textAlign: "center"}} responsive>
                    <thead>
                    <tr>
                        <th className="col">No.</th>
                        <th className="col">
                            <span>Colaborador</span>
                            <Form.Control 
                                type="text"
                                placeholder="Buscar por nombres"
                                value={filters.nombreColaborador}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    handleFilterChange("nombres", e.target.value)}
                            />
                        </th>
                        <th className="col">Inicio</th>
                        <th className="col">Fin</th>
                        <th className="col">
                        <span>Tipo</span>
                        <Form.Control
                            type="text"
                            placeholder="Filtrar por tipo"
                            value={filters.tipoLicencia}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("tipoLicencia", e.target.value)
                            }
                            />
                        </th>
                        <th className="col">
                            <span>Estado</span>
                            <Form.Control
                            type="text"
                            placeholder="Filtrar por estado"
                            value={filters.estadoLicencia}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFilterChange("estadoLicencia", e.target.value)
                            }
                            />
                        </th>
                        <th className="col">Acciones</th>
                        {/* <th className="col">Descargar</th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map((col, index) => (
                    <tr key={index}>
                        <td>{index}</td>
                        <td>{col.nombreColaborador}</td>
                        <td>{format(new Date(col.fechaInicio), "dd/MM/yyyy")}</td>
                        <td>{format(new Date(col.fechaFin), "dd/MM/yyyy")}</td>
                        <td>{col.tipoLicencia}</td>
                        <td>{col.estadoLicencia}</td>
                        <th className="table-action">
                        <Edit2
                            className="align-middle me-1"
                            size={18}
                            onClick={() =>
                            handleEdit(
                                col.id,
                                col.idColaborador,
                                col.idEstadoLicencia,
                                col.idTipoLicencia,
                                col.fechaInicio,
                                col.fechaFin,
                                col.observaciones
                            )
                            }
                        />
                        <Button variant="success" className="ml-2" onClick={() =>
                            handleDownload(
                                col.id,
                                col.idColaborador,
                                col.idEstadoLicencia,
                                col.idTipoLicencia,
                                new Date(col.fechaInicio), // Convertir a Date aquí
                                new Date(col.fechaFin),    // Convertir a Date aquí
                                col.observaciones,
                                col.dpi
                            )}>
                        Descargar <Download />
                        </Button>
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
        {showModal &&  idLicencia !== null && (
            <UpdateLicencias
            setShowModal={setShowModal}
            idLicencia={idLicencia ?? 0}
            idColaborador={idColaborador ?? 0}
            idEstadoLicencia={idEstadoLicencia ?? 0}
            idTipoLicencia={idTipoLicencia ?? 0}
            fechaInicio={fechaInicio ?? new Date()}
            fechaFin={fechaFin ?? new Date()}
            observaciones={observaciones}
            updateList={handleUpdateList}
            />
        )}
        </div>
    )
}

export default ListarSolicitudes;