// Tabla para ver reporte de calificaciones de un estudiante
import { useEffect, useState } from "react";
import { Table, Tabs, Tab, Container } from "react-bootstrap";
import Header from "../../../components/Header";


const TablaEstudianteCalificaciones = ({datos, estudiante, periodosMatriculados}) => {
    const [finalData, setFinalData] = useState([]);

    const [materiasTabla, setMateriasTabla] =useState([]);
    const [activeTab, setActiveTab] = useState('quimestre1');
    const [isLoading, setIsLoading] = useState(true);

   console.log("Datos que llegan a tabla: ", datos); 
   console.log("Datos del estudiante que llegan a tabla: ", estudiante); 
   console.log("Datos del periodo que llegan a tabla: ", periodosMatriculados); 
    const calcularNotasBE = (notasBEMateria) => {
        let notasP1Q1 = 0.0;
        let notasP2Q1 = 0.0;
        let notasP1Q2 = 0.0;
        let notasP2Q2 = 0.0;

        let evaluacionP1Q1 = 0.0;
        let evaluacionP2Q1 = 0.0;
        let evaluacionP1Q2 = 0.0;
        let evaluacionP2Q2 = 0.0;

        let notaQ1 = 0.0;
        let notaQ2 = 0.0;

        
        notasBEMateria.calificaciones.map(calificaciones => {
           if (calificaciones.parcial === 'P1' && calificaciones.quimestre === 'Q1') {
                notasP1Q1 = calcularParcialBE(calificaciones); 
                evaluacionP1Q1 = calificaciones.evaluacion;
           } else if (calificaciones.parcial === 'P2' && calificaciones.quimestre === 'Q1') {
                notasP2Q1 = calcularParcialBE(calificaciones); 
                evaluacionP2Q1 = calificaciones.evaluacion;
           } else if (calificaciones.parcial === 'P1' && calificaciones.quimestre === 'Q2') {
                notasP1Q2 = calcularParcialBE(calificaciones); 
                evaluacionP1Q2 = calificaciones.evaluacion;
           } else {
                notasP2Q2 = calcularParcialBE(calificaciones); 
                evaluacionP2Q2 = calificaciones.evaluacion;
           } 
        });


        // Falta obtener las evaluaciones de la tabla calificaciones_quimestrales_BE
        
         notaQ1 = calcularQuimestral(notasP1Q1, notasP2Q1, evaluacionP1Q1); // Las evaluaciones no corresponden a las quimestrales. REVISAR
         notaQ2 = calcularQuimestral(notasP1Q2, notasP2Q2, evaluacionP1Q2); // Las evaluaciones no corresponden a las quimestrales. REVISAR

        return [notaQ1, notaQ2];
    }

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
        // Convierte a número o asigna 0 si no es un número válido
        const insumo1 = parseFloat(notasParcial.insumo1);
        const insumo2 = parseFloat(notasParcial.insumo2);
        const evaluacion = parseFloat(notasParcial.evaluacion);
        const mejora = parseFloat(notasParcial.mejora);

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

        // Caluclar nota parcial
        const notaParcial = parseFloat((ponderacion70 + ponderacion30).toFixed(2));


        return notaParcial;

    }   

    // Calculo del promedio de todas las materias
    const calcularPromedio = (notas) => {
        let sumatoriaQ1 = 0.0;
        let sumatoriaQ2 = 0.0;
        let sumatoriaFinal = 0.0;
        
        let promedioQ1 = 0.0;
        let promedioQ2 = 0.0;
        let promedioFinal = 0.0;
        
        let numeroMaterias = notas.length;


        notas.map(notaMateria => {
           sumatoriaQ1 += notaMateria.notaq1;
           sumatoriaQ2 += notaMateria.notaq2;
           sumatoriaFinal += notaMateria.notaFinal;
        });

        promedioQ1 = parseFloat((sumatoriaQ1/numeroMaterias).toFixed(2));
        promedioQ2 = parseFloat((sumatoriaQ2/numeroMaterias).toFixed(2));
        promedioFinal = parseFloat((sumatoriaFinal/numeroMaterias).toFixed(2));

        return {nombreMateria: "Promedio", notaq1: promedioQ1, notaq2: promedioQ2, notaFinal: promedioFinal}
    }
    
    const cargarDatos = () => {

        setIsLoading(true);

        if (!Array.isArray(datos) || datos.length === 0) {
            console.error('No hay datos válidos para procesar');
            return;
        }

        console.log('Notas estudiante en tablaEstudiante: ', datos);
        try {
            const notasMateria = datos.map(materias => {
                if (materias.nivel && (materias.nivel.includes('Básico elemental') || materias.nivel.includes('BE'))) {
                    if (materias.calificaciones && Array.isArray(materias.calificaciones)) {
                        const [notaQ1, notaQ2] = calcularNotasBE(materias);

                        console.log("Calculo de las notas de BE");
                        return {
                            nombreMateria: materias.nombreMateria,
                            notaq1: notaQ1,
                            notaq2: notaQ2
                        };
                    }
                } else {
                    console.log("Calculo de las notas los demas niveles");
                }

                // Caso por defecto si no entra en la condición
                return {
                    nombreMateria: materias.nombreMateria || 'Sin nombre',
                    notaq1: 0,
                    notaq2: 0
                };
            });

            const promedio = calcularPromedio(notasMateria);
            setMateriasTabla([...notasMateria, promedio]);

        } catch (error) {
           console.error('Error al procesar los datos:', error); 
        } finally {
            setIsLoading(false);
        }
    }
    
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
                                   <tr key={index}>
                                       <td>{dato.nombreMateria}</td>
                                       <td>{dato.notaq1}</td>
                                       <td> Domina </td>
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
                                   <tr key={index}>
                                       <td>{dato.nombreMateria}</td>
                                       <td>{dato.notaq2}</td>
                                       <td> Domina </td>
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
                                   <tr key={index}>
                                       <td>{dato.nombreMateria}</td>
                                       <td> Nota final </td>
                                       <td> Domina </td>
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
