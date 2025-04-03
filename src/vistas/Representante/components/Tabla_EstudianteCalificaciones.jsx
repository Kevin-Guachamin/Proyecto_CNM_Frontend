// Tabla para ver reporte de calificaciones de un estudiante
import { Tabs, Tab, Container } from "react-bootstrap";


const TablaEstudianteCalificaciones = () => {
   return(
       <div className="content-container">
           <Container className="mt-4">
               <div className="d-flex justify-content-between align-items-center mb-4">
                   <h2 className="mb-0">Gestión de Calificaciones</h2>
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
               <Tabs defaultActiveKey="quimestre1" id="calificaciones-tabs" className="mb-3" fill>
                   {/* QUIMESTRE 1 */}
                   <Tab eventKey="quimestre1" title="Quimestre 1">
                       
                   </Tab>

                   {/* QUIMESTRE 2 */}
                   <Tab eventKey="quimestre2" title="Quimestre 2">
                       
                   </Tab>

                   {/* NOTA FINAL */}
                   <Tab eventKey="notaFinal" title="Nota Final">
                       
                   </Tab>
               </Tabs>
           </Container>
       </div> 
   );
}

export default TablaEstudianteCalificaciones;