// Tabla para ver reporte de calificaciones de un estudiante
import { useEffect, useState } from "react";
import { Table, Tabs, Tab, Container } from "react-bootstrap";
import Header from "../../../components/Header";
import { 
    calcularPromedioAnual, 
    calcularPromedioFinalConSupletorio, 
    calcularPromedioQuimestral,
    determinarEstado 
} from "../../Docente/Promedios";


const TablaEstudianteCalificaciones = ({datos, estudiante, periodosMatriculados}) => {
    const [finalData, setFinalData] = useState([]);

    const [materiasTabla, setMateriasTabla] =useState([]);
    const [activeTab, setActiveTab] = useState('quimestre1');
    const [isLoading, setIsLoading] = useState(true);

   console.log("Datos que llegan a tabla: ", datos); 
   console.log("Datos del estudiante que llegan a tabla: ", estudiante); 
   console.log("Datos del periodo que llegan a tabla: ", periodosMatriculados); 
   
    // Función para obtener la equivalencia según la nota
    const obtenerEquivalencia = (nota) => {
        const n = parseFloat(nota);
        if (isNaN(n)) return "Sin calificación";
        
        if (n >= 9.00) return "Domina los aprendizajes requeridos";
        if (n >= 7.00) return "Alcanza los aprendizajes requeridos";
        if (n >= 4.01) return "Está próximo a alcanzar los aprendizajes requeridos";
        return "No alcanza los aprendizajes requeridos";
    };

    // Función para formatear notas con 2 decimales
    const formatearNota = (nota) => {
        const n = parseFloat(nota);
        return isNaN(n) ? "0.00" : n.toFixed(2);
    };

    // Función para calcular las notas finales usando la misma lógica del docente
    const calcularNotasFinales = (materiaData) => {
        if (materiaData.esBasicoElemental) {
            return calcularNotasBE(materiaData);
        } else {
            return calcularNotasNormales(materiaData);
        }
    };

    // Cálculo para niveles normales (no BE)
    const calcularNotasNormales = (materiaData) => {
        const { calificaciones: parciales, quimestrales, finales } = materiaData;
        
        if (!parciales || parciales.length === 0) {
            return { 
                notaq1: "0.00", 
                notaq2: "0.00", 
                notaFinal: "0.00", 
                estado: "Sin datos",
                equivalenciaQ1: "Sin calificación",
                equivalenciaQ2: "Sin calificación", 
                equivalenciaFinal: "Sin calificación"
            };
        }
        
        // Separar parciales por quimestre
        const p1Q1 = parciales.find(p => p.parcial === 'P1' && p.quimestre === 'Q1');
        const p2Q1 = parciales.find(p => p.parcial === 'P2' && p.quimestre === 'Q1');
        const p1Q2 = parciales.find(p => p.parcial === 'P1' && p.quimestre === 'Q2');
        const p2Q2 = parciales.find(p => p.parcial === 'P2' && p.quimestre === 'Q2');

        // Calcular promedios parciales Q1
        const promP1Q1 = calcularPromedioParcialNormal(p1Q1);
        const promP2Q1 = calcularPromedioParcialNormal(p2Q1);
        
        // Calcular promedios parciales Q2
        const promP1Q2 = calcularPromedioParcialNormal(p1Q2);
        const promP2Q2 = calcularPromedioParcialNormal(p2Q2);

        // Obtener exámenes quimestrales
        const examenQ1 = quimestrales && quimestrales.length > 0 
            ? quimestrales.find(q => q.quimestre === 'Q1')?.examen || 0 
            : 0;
        const examenQ2 = quimestrales && quimestrales.length > 0 
            ? quimestrales.find(q => q.quimestre === 'Q2')?.examen || 0 
            : 0;

        // Calcular promedios quimestrales usando la función del docente
        const { promedioFinal: notaQ1 } = calcularPromedioQuimestral(promP1Q1, promP2Q1, examenQ1);
        const { promedioFinal: notaQ2 } = calcularPromedioQuimestral(promP1Q2, promP2Q2, examenQ2);

        // Calcular promedio anual
        const promedioAnual = calcularPromedioAnual(notaQ1, notaQ2);

        // Calcular nota final con supletorio si existe
        const examenSupletorio = finales && finales.length > 0 ? finales[0].examen_recuperacion : "";
        const notaFinal = calcularPromedioFinalConSupletorio(promedioAnual, examenSupletorio);

        return {
            notaq1: formatearNota(notaQ1),
            notaq2: formatearNota(notaQ2),
            notaFinal: formatearNota(notaFinal),
            estado: determinarEstado(notaFinal),
            equivalenciaQ1: obtenerEquivalencia(notaQ1),
            equivalenciaQ2: obtenerEquivalencia(notaQ2),
            equivalenciaFinal: obtenerEquivalencia(notaFinal)
        };
    };

    // Función auxiliar para calcular promedio parcial normal
    const calcularPromedioParcialNormal = (parcial) => {
        if (!parcial) return 0;
        const insumo1 = parseFloat(parcial.insumo1) || 0;
        const insumo2 = parseFloat(parcial.insumo2) || 0;
        const evaluacion = parseFloat(parcial.evaluacion) || 0;
        
        const ponderacion70 = ((insumo1 + insumo2) / 2) * 0.7;
        const ponderacion30 = evaluacion * 0.3;
        
        return ponderacion70 + ponderacion30;
    };

    const calcularNotasBE = (notasBEMateria) => {
        const { calificaciones: parciales, quimestrales } = notasBEMateria;
        
        if (!parciales || parciales.length === 0) {
            return { 
                notaq1: "0.00", 
                notaq2: "0.00", 
                notaFinal: "0.00", 
                estado: "Sin datos",
                equivalenciaQ1: "Sin calificación",
                equivalenciaQ2: "Sin calificación", 
                equivalenciaFinal: "Sin calificación"
            };
        }
        
        // Separar parciales por quimestre
        const p1Q1 = parciales.find(p => p.parcial === 'P1' && p.quimestre === 'Q1');
        const p2Q1 = parciales.find(p => p.parcial === 'P2' && p.quimestre === 'Q1');
        const p1Q2 = parciales.find(p => p.parcial === 'P1' && p.quimestre === 'Q2');
        const p2Q2 = parciales.find(p => p.parcial === 'P2' && p.quimestre === 'Q2');

        // Calcular notas parciales BE
        const notasP1Q1 = calcularParcialBE(p1Q1);
        const notasP2Q1 = calcularParcialBE(p2Q1);
        const notasP1Q2 = calcularParcialBE(p1Q2);
        const notasP2Q2 = calcularParcialBE(p2Q2);

        // Obtener exámenes quimestrales
        const examenQ1 = quimestrales && quimestrales.length > 0 
            ? quimestrales.find(q => q.quimestre === 'Q1')?.examen || 0 
            : 0;
        const examenQ2 = quimestrales && quimestrales.length > 0 
            ? quimestrales.find(q => q.quimestre === 'Q2')?.examen || 0 
            : 0;

        // Calcular notas quimestrales
        const notaQ1 = calcularQuimestral(notasP1Q1, notasP2Q1, examenQ1);
        const notaQ2 = calcularQuimestral(notasP1Q2, notasP2Q2, examenQ2);

        // Para BE, la nota final es el promedio de los dos quimestres
        const notaFinal = calcularPromedioAnual(notaQ1, notaQ2);

        return {
            notaq1: formatearNota(notaQ1),
            notaq2: formatearNota(notaQ2),
            notaFinal: formatearNota(notaFinal),
            estado: notaFinal >= 7 ? "Aprobado" : "Reprobado",
            equivalenciaQ1: obtenerEquivalencia(notaQ1),
            equivalenciaQ2: obtenerEquivalencia(notaQ2),
            equivalenciaFinal: obtenerEquivalencia(notaFinal)
        };
    };

    // Calculo de la nota Quimestral
    const calcularQuimestral = (notaP1, notaP2, notaExamen) => {
        const p1 = parseFloat(notaP1);
        const p2 = parseFloat(notaP2);
        const examen = parseFloat(notaExamen);

        const valP1 = isNaN(p1) ? 0 : p1;
        const valP2 = isNaN(p2) ? 0 : p2;
        const valExamen = isNaN(examen) ? 0 : examen;
        
        const promedioAcademico = (valP1 + valP2) / 2;
        const ponderacion70 = promedioAcademico * 0.7;
        const ponderacion30 = valExamen * 0.3;
        
        const promedioFinal = parseFloat((ponderacion70 + ponderacion30).toFixed(2));
       
        return promedioFinal;
    }

    // Calculo de la nota Parcial de cada Quimestre para basico elemental
    const calcularParcialBE = (notasParcial) => {
        if (!notasParcial) return 0;
        
        // Convierte a número o asigna 0 si no es un número válido
        const insumo1 = parseFloat(notasParcial.insumo1);
        const insumo2 = parseFloat(notasParcial.insumo2);
        const evaluacion = parseFloat(notasParcial.evaluacion);
        const mejora = parseFloat(notasParcial.mejoramiento || notasParcial.mejora);

        // Función auxiliar para validar números
        const validarNumero = (num) => (isNaN(num) ? 0 : num);

        // Validar cada valor para evitar NaN
        const valInsumo1 = validarNumero(insumo1);
        const valInsumo2 = validarNumero(insumo2);
        const valEvaluacion = validarNumero(evaluacion);
        const valMejora = validarNumero(mejora);
        let promedioSumativas = 0.0;

        // Calcular el promedio de los insumos
        const promedio = (valInsumo1 + valInsumo2) / 2;
        const ponderacion70 = promedio * 0.7;
        
        // Calcular promedio de mejora y evaluacion
        const promedioDeMejora = (valEvaluacion + valMejora) / 2;
        const promedioMejora = parseFloat(promedioDeMejora.toFixed(2));
        
        // Calcular promedio sumativas segun condicion
        if (valMejora >= valEvaluacion) {
            promedioSumativas = ((promedioMejora + valEvaluacion) / 2);
        } else {
            promedioSumativas = valEvaluacion;
        }

        const ponderacion30 = promedioSumativas * 0.3;

        // Calcular nota parcial
        const notaParcial = parseFloat((ponderacion70 + ponderacion30).toFixed(2));

        return notaParcial;
    };   

    // Calculo del promedio de todas las materias
    const calcularPromedio = (notas) => {
        let sumatoriaQ1 = 0.0;
        let sumatoriaQ2 = 0.0;
        let sumatoriaFinal = 0.0;
        
        let promedioQ1 = 0.0;
        let promedioQ2 = 0.0;
        let promedioFinal = 0.0;
        
        let numeroMaterias = notas.length;

        notas.forEach(notaMateria => {
           sumatoriaQ1 += parseFloat(notaMateria.notaq1);
           sumatoriaQ2 += parseFloat(notaMateria.notaq2);
           sumatoriaFinal += parseFloat(notaMateria.notaFinal);
        });

        promedioQ1 = sumatoriaQ1/numeroMaterias;
        promedioQ2 = sumatoriaQ2/numeroMaterias;
        promedioFinal = sumatoriaFinal/numeroMaterias;

        return {
            nombreMateria: "Promedio", 
            notaq1: formatearNota(promedioQ1), 
            notaq2: formatearNota(promedioQ2), 
            notaFinal: formatearNota(promedioFinal),
            estado: promedioFinal >= 7 ? "Aprobado" : "Reprobado",
            equivalenciaQ1: obtenerEquivalencia(promedioQ1),
            equivalenciaQ2: obtenerEquivalencia(promedioQ2),
            equivalenciaFinal: obtenerEquivalencia(promedioFinal)
        };
    };
    
    const cargarDatos = () => {
        setIsLoading(true);

        if (!Array.isArray(datos) || datos.length === 0) {
            console.error('No hay datos válidos para procesar');
            setIsLoading(false);
            return;
        }

        console.log('Notas estudiante en tablaEstudiante: ', datos);
        try {
            const notasMateria = datos.map(materias => {
                // Usar la función unificada para calcular las notas
                const resultadoNotas = calcularNotasFinales(materias);
                
                return {
                    nombreMateria: materias.nombreMateria || 'Sin nombre',
                    notaq1: resultadoNotas.notaq1,
                    notaq2: resultadoNotas.notaq2,
                    notaFinal: resultadoNotas.notaFinal,
                    estado: resultadoNotas.estado,
                    equivalenciaQ1: resultadoNotas.equivalenciaQ1,
                    equivalenciaQ2: resultadoNotas.equivalenciaQ2,
                    equivalenciaFinal: resultadoNotas.equivalenciaFinal
                };
            });

            const promedio = calcularPromedio(notasMateria);
            setMateriasTabla([...notasMateria, promedio]);

        } catch (error) {
           console.error('Error al procesar los datos:', error); 
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelecTab = (key) => {
        setActiveTab(key);
    }

    useEffect(() => {
    	cargarDatos();
    }, [datos]);

    // Si no hay datos para mostrar después de la carga
    if (!datos  || materiasTabla.length === 0) {
        return (
            <div className="alert alert-info">
                No hay calificaciones disponibles para mostrar.
            </div>
        );
    }
   

   return(
       <div className="content-container">
           
           <Container className="mt-4">
		   <div className="d-flex justify-content-center align-items-center mb-4">
			   <h2 className="mb-0"> Reporte de Calificaciones </h2>
		   </div>
		   <div className="d-flex justify-content-center align-items-center mb-4">
			   <h3 className="mb-0"> {periodosMatriculados[0].descripcion} </h3>
		   </div>
	   <div className="d-flex justify-content-between align-items-center mb-4">
		<div>
		   <p className="mb-0"> <strong> Estudiante: </strong>   {estudiante.primer_nombre} {estudiante.segundo_nombre} {estudiante.primer_apellido} {estudiante.segundo_apellido}</p>
		   <p className="mb-0"> <strong> Nivel: </strong>  {periodosMatriculados[0].nivel}</p>
	   	</div> 
		   <div>
			   <button
				   className="btn btn-danger me-2"
				   //onClick={handleExportPDF}
				   title="Exportar a PDF"
				   >
				   <i className="bi bi-file-earmark-pdf-fill"></i>
			   </button>
		   </div>
           </div>


               {/* TABS PRINCIPALES */}
               <Tabs 
                    defaultActiveKey="quimestre1" 
                    id="calificaciones-tabs" 
                    className="mb-3" 
                    fill
                    activeKey={activeTab}
                    onSelect={handleSelecTab}
                >
                   {/* QUIMESTRE 1 */}
                   <Tab eventKey="quimestre1" title="Quimestre 1" >
                        <Table striped bordered hover>
                           <thead>
                               <tr>
                                   <th> Asignatura </th>
                                   <th> Nota </th>
                                   <th> Equivalencia </th>
                               </tr>
                           </thead>
                           <tbody>
                               {materiasTabla.map((dato, index) => (
                                   <tr key={index} className={parseFloat(dato.notaq1) < 7 && dato.nombreMateria !== "Promedio" ? "table-warning" : ""}>
                                       <td>{dato.nombreMateria}</td>
                                       <td>{dato.notaq1}</td>
                                       <td>{dato.equivalenciaQ1}</td>
                                   </tr>
                               ))}
                           </tbody> 
                        </Table> 
                   </Tab>

                   {/* QUIMESTRE 2 */}
                   <Tab eventKey="quimestre2" title="Quimestre 2" >
                      <Table striped bordered hover>
                           <thead>
                               <tr>
                                   <th> Asignatura </th>
                                   <th> Nota </th>
                                   <th> Equivalencia </th>
                               </tr>
                           </thead>
                           <tbody>
                               {materiasTabla.map((dato, index) => (
                                   <tr key={index} className={parseFloat(dato.notaq2) < 7 && dato.nombreMateria !== "Promedio" ? "table-warning" : ""}>
                                       <td>{dato.nombreMateria}</td>
                                       <td>{dato.notaq2}</td>
                                       <td>{dato.equivalenciaQ2}</td>
                                   </tr>
                               ))}
                           </tbody> 
                       </Table> 
                   </Tab>

                   {/* NOTA FINAL */}
                   <Tab eventKey="notaFinal" title="Nota Final" >
                      <Table striped bordered hover>
                           <thead>
                               <tr>
                                   <th> Asignatura </th>
                                   <th> Nota </th>
                                   <th> Equivalencia </th>
                               </tr>
                           </thead>
                           <tbody>
                               {materiasTabla.map((dato, index) => (
                                   <tr key={index} className={dato.estado === "Reprobado" ? "table-danger" : ""}>
                                       <td>{dato.nombreMateria}</td>
                                       <td>{dato.notaFinal}</td>
                                       <td>{dato.equivalenciaFinal}</td>
                                   </tr>
                               ))}
                           </tbody>
                      </Table> 
                   </Tab>
               </Tabs>
           </Container>
       </div> 
   );
}

export default TablaEstudianteCalificaciones;
