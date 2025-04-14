import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import Swal from "sweetalert2";
import 'bootstrap-icons/font/bootstrap-icons.css';

const InformacionRepresentantes = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [periodos, setPeriodos] = useState([]);
  const [periodo, setPeriodo] = useState("");
  const [datosAgrupados, setDatosAgrupados] = useState({});
  const [nivelActivo, setNivelActivo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUsuario(parsedUser);

    const modulosBase = getModulos(parsedUser.subRol, true);
    setModules(transformModulesForLayout(modulosBase));

    axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/periodo_academico/obtener`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setPeriodos(res.data))
      .catch((err) => ErrorMessage(err));
  }, [navigate]);

  const handlePeriodoChange = (e) => {
    const selectedPeriodo = e.target.value;
    setPeriodo(selectedPeriodo);

    if (!selectedPeriodo) return;

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/obtener/periodo/${selectedPeriodo}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const agrupados = agruparRepresentantes(res.data);
        setDatosAgrupados(agrupados);
        setNivelActivo(Object.keys(agrupados)[0] || null);
      })
      .catch((err) => {
        ErrorMessage(err);
        Swal.fire("Error", "No se pudo cargar la información.", "error");
      })
      .finally(() => setLoading(false));
  };

  const agruparRepresentantes = (asignaciones) => {
    const resultado = {};

    asignaciones.forEach((item) => {
      const nivel = item.Materia?.nivel;
      const materia = item.Materia?.nombre;
      const paralelo = item.paralelo;

      if (!nivel || !materia || !paralelo) return;

      if (!resultado[nivel]) resultado[nivel] = {};
      if (!resultado[nivel][materia]) resultado[nivel][materia] = new Set();

      resultado[nivel][materia].add(paralelo);
    });

    // Convertimos Sets a arrays
    for (let nivel in resultado) {
      for (let materia in resultado[nivel]) {
        resultado[nivel][materia] = Array.from(resultado[nivel][materia]);
      }
    }

    return resultado;
  };

  const handleVerRepresentantes = (nivel, materia, paralelo) => {
    navigate(`/representantes/${nivel}/${materia}/${paralelo}`);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="container-fluid p-0 sticky-header">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules}>
        <div className="content-container mt-3">
          <h2 className="mb-4">Información de Representantes</h2>

          {/* Selector de período */}
          <div className="filtros mb-3">
            <div className="form-group">
              <label><strong>Selecciona un período académico:</strong></label>
              <select
                value={periodo}
                onChange={handlePeriodoChange}
                className="form-select"
              >
                <option value="">Seleccione un período</option>
                {periodos.map((p) => (
                  <option key={p.ID} value={p.ID}>
                    {p.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mostrar aviso si no hay periodo */}
          {!periodo ? (
            <div className="alert alert-warning mt-4">
              <strong>*Se requiere un período</strong>
            </div>
          ) : (
            <Tabs
              id="tabs-niveles"
              activeKey={nivelActivo}
              onSelect={(k) => setNivelActivo(k)}
              className="mb-4"
            >
              {Object.entries(datosAgrupados).map(([nivel, materias]) => (
                <Tab eventKey={nivel} title={nivel} key={nivel}>
                  <Tabs className="mb-3">
                    {Object.entries(materias).map(([materia, paralelos]) => (
                      <Tab eventKey={materia} title={materia} key={materia}>
                        <div className="d-flex flex-wrap gap-3">
                          {paralelos.map((paralelo, idx) => (
                            <div className="card tarjeta-horizontal" key={idx}>
                              <div className="card-body d-flex align-items-center">
                                <i className="bi bi-people-fill display-4 text-primary me-4"></i>
                                <div>
                                  <h5 className="card-title mb-1">Paralelo: {paralelo}</h5>
                                  <p className="mb-2">
                                    👨‍🎓 <strong>Estudiantes:</strong> 28 <br />
                                    👥 <strong>Representantes:</strong> 27
                                  </p>
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleVerRepresentantes(nivel, materia, paralelo)}
                                  >
                                    <i className="bi bi-eye-fill me-1"></i> Ver Representantes
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Tab>
                    ))}
                  </Tabs>
                </Tab>
              ))}
            </Tabs>
          )}
        </div>
      </Layout>
    </>
  );
};

export default InformacionRepresentantes;