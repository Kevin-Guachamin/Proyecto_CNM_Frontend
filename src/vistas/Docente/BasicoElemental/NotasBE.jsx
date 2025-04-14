import { React, useState } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import Parcial from "./ParcialBE";
import Quimestral from "./QuimestralBE";
import Final from "./FinalBE";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";

function NotasBE({ usuario, modules, datosModulo, handleSidebarNavigation, handleExportExcel, handleExportPDF, handleSave, handleEditar,
  forceEdit, inputsDisabled, estadoFechas, textoRangoFechas, activeMainTab, activeSubTabQuim1, activeSubTabQuim2, setActiveMainTab,
  setActiveSubTabQuim1, setActiveSubTabQuim2, parcial1Quim1Data, parcial2Quim1Data, parcial1Quim2Data, parcial2Quim2Data, quim1Data,
  quim2Data, finalData, handleActualizarParcial1Quim1, handleActualizarParcial2Quim1, handleActualizarParcial1Quim2, handleActualizarParcial2Quim2,
  handleActualizarQuim1, handleActualizarQuim2, handleActualizarFinal, handleEditarFila, soloLectura, getRangoValido}) {

  const [escalaSeleccionada, setEscalaSeleccionada] = useState("cualitativa");

  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules} onNavigate={handleSidebarNavigation}>
        <div className="content-container">
          <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
              <h2 className="mb-0">Gestión de Calificaciones</h2>

              <div className="d-flex flex-column align-items-end gap-2">
                {/* Línea de Exportaciones */}
                <div className="d-flex align-items-center gap-2">
                  <span className="label-text">Exportaciones:</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleExportExcel}
                    title="Exportar a Excel"
                  >
                    <i className="bi bi-file-earmark-excel-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleExportPDF}
                    title="Exportar a PDF"
                  >
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </button>
                </div>
                {/* Línea de Acciones */}
                {!soloLectura && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="label-text">Acciones:</span>
                    <button className="btn btn-secondary btn-sm" title="Guardar" onClick={handleSave}>
                      <i className="bi bi-save"></i>
                    </button>
                    <button className="btn btn-warning btn-sm text-white" title="Habilitar edición" onClick={handleEditar}>
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                )}
                {/* Línea de Escala */}
                <div className="d-flex align-items-center gap-2">
                  <span className="label-text">Escala:</span>

                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="escala" id="cualitativa"
                      checked={escalaSeleccionada === "cualitativa"}
                      onChange={() => setEscalaSeleccionada("cualitativa")} />
                    <label className="form-check-label" htmlFor="cualitativa">Cualitativa</label>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="escala" id="cuantitativa"
                      checked={escalaSeleccionada === "cuantitativa"}
                      onChange={() => setEscalaSeleccionada("cuantitativa")} />
                    <label className="form-check-label" htmlFor="cuantitativa">Cuantitativa</label>
                  </div>
                </div>
              </div>
            </div>
            {/* TABS PRINCIPALES */}
            <Tabs defaultActiveKey="quimestre1" id="calificaciones-tabs" className="mb-3" fill onSelect={(k) => setActiveMainTab(k)}>
              {/* QUIMESTRE 1 */}
              <Tab eventKey="quimestre1" title="Quimestre 1">
                <Tabs defaultActiveKey="parcial1-quim1" className="mb-3" fill onSelect={(k) => setActiveSubTabQuim1(k)}>
                  <Tab eventKey="parcial1-quim1" title="Parcial 1 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="1"
                      actualizarDatosParcial={handleActualizarParcial1Quim1}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre1" && activeSubTabQuim1 === "parcial1-quim1"}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditarFila}
                      isWithinRange={getRangoValido("parcial1-quim1")}
                      rangoTexto={textoRangoFechas["parcial1-quim1"]}
                      forceEdit={forceEdit}
                      soloLectura={soloLectura}
                      escala={escalaSeleccionada}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim1" title="Parcial 2 - Quim 1">
                    <Parcial
                      quimestreSeleccionado="1"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={handleActualizarParcial2Quim1}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre1" && activeSubTabQuim1 === "parcial2-quim1"}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditarFila}
                      isWithinRange={getRangoValido("parcial2-quim1")}
                      rangoTexto={textoRangoFechas["parcial2-quim1"]}
                      forceEdit={forceEdit}
                      soloLectura={soloLectura}
                      escala={escalaSeleccionada}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim1" title="Quimestre 1">
                    <Quimestral
                      quimestreSeleccionado="1"
                      parcial1Data={parcial1Quim1Data}
                      parcial2Data={parcial2Quim1Data}
                      actualizarDatosQuim={handleActualizarQuim1}
                      datosModulo={datosModulo}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditarFila}
                      isWithinRange={getRangoValido("quimestral-quim1")}
                      rangoTexto={textoRangoFechas["quimestral-quim1"]}
                      forceEdit={forceEdit}
                      soloLectura={soloLectura}
                      escala={escalaSeleccionada}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* QUIMESTRE 2 */}
              <Tab eventKey="quimestre2" title="Quimestre 2">
                <Tabs defaultActiveKey="parcial1-quim2" className="mb-3" fill onSelect={(k) => setActiveSubTabQuim2(k)}>
                  <Tab eventKey="parcial1-quim2" title="Parcial 1 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="1"
                      actualizarDatosParcial={handleActualizarParcial1Quim2}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre2" && activeSubTabQuim2 === "parcial1-quim2"}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditarFila}
                      isWithinRange={getRangoValido("parcial1-quim2")}
                      rangoTexto={textoRangoFechas["parcial1-quim2"]}
                      forceEdit={forceEdit}
                      soloLectura={soloLectura}
                      escala={escalaSeleccionada}
                    />
                  </Tab>

                  <Tab eventKey="parcial2-quim2" title="Parcial 2 - Quim 2">
                    <Parcial
                      quimestreSeleccionado="2"
                      parcialSeleccionado="2"
                      actualizarDatosParcial={handleActualizarParcial2Quim2}
                      datosModulo={datosModulo}
                      activo={activeMainTab === "quimestre2" && activeSubTabQuim2 === "parcial2-quim2"}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditarFila}
                      isWithinRange={getRangoValido("parcial2-quim2")}
                      rangoTexto={textoRangoFechas["parcial2-quim2"]}
                      forceEdit={forceEdit}
                      soloLectura={soloLectura}
                      escala={escalaSeleccionada}
                    />
                  </Tab>

                  <Tab eventKey="quimestral-quim2" title="Quimestre 2">
                    <Quimestral
                      quimestreSeleccionado="2"
                      parcial1Data={parcial1Quim2Data}
                      parcial2Data={parcial2Quim2Data}
                      actualizarDatosQuim={handleActualizarQuim2}
                      datosModulo={datosModulo}
                      inputsDisabled={inputsDisabled}
                      onEditar={handleEditarFila}
                      isWithinRange={getRangoValido("quimestral-quim2")}
                      rangoTexto={textoRangoFechas["quimestral-quim2"]}
                      forceEdit={forceEdit}
                      soloLectura={soloLectura}
                      escala={escalaSeleccionada}
                    />
                  </Tab>
                </Tabs>
              </Tab>

              {/* NOTA FINAL */}
              <Tab eventKey="notaFinal" title="Nota Final">
                <div className="tab-pane active">
                  <Final
                    quim1Data={quim1Data}
                    quim2Data={quim2Data}
                    datosModulo={datosModulo}
                    actualizarDatosFinal={handleActualizarFinal}
                    inputsDisabled={inputsDisabled}
                    onEditar={handleEditarFila}
                    isWithinRange={getRangoValido("notaFinal")}
                    rangoTexto={textoRangoFechas["notaFinal"]}
                    forceEdit={forceEdit}
                    soloLectura={soloLectura}
                    escala={escalaSeleccionada}
                  />
                </div>
              </Tab>
            </Tabs>
          </Container>
        </div>
      </Layout>
    </>
  );
}

export default NotasBE; 