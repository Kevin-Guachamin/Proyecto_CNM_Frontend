import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import "./MateriasPorPeriodo.css";

const nivelesMap = {
    "1ro BE": "1ro Básico Elemental",
    "2do BE": "2do Básico Elemental",
    "1ro BM": "1ro Básico Medio",
    "2do BM": "2do Básico Medio",
    "3ro BM": "3ro Básico Medio",
    "1ro BS": "1ro Básico Superior",
    "2do BS": "2do Básico Superior",
    "3ro BS": "3ro Básico Superior",
    "1ro BCH": "1ro Bachillerato",
    "2do BCH": "2do Bachillerato",
    "3ro BCH": "3ro Bachillerato",
};

function MateriasPorPeriodo() {
    const { idPeriodo } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [modules, setModules] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [agrupadoPorNivel, setAgrupadoPorNivel] = useState({});
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/obtener/periodo_academico/${idPeriodo}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setAsignaciones(res.data.data);
                agruparPorNivelData(res.data.data);
            })
            .catch((err) => {
                ErrorMessage(err);
                Swal.fire("Error", "No se pudieron cargar las materias del período.", "error");
            })
            .finally(() => setLoading(false));
    }, [idPeriodo, navigate]);

    const agruparPorNivelData = (data) => {
        const grupos = {};
        data.forEach((item) => {
            const nivel = item.Materia?.nivel || "Sin nivel";
            if (!grupos[nivel]) {
                grupos[nivel] = [];
            }
            grupos[nivel].push(item);
        });
        setAgrupadoPorNivel(grupos);
        // Configuramos la pestaña activa como la primera clave si aún no hay una seleccionada
        if (!activeTab && Object.keys(grupos).length > 0) {
            setActiveTab(Object.keys(grupos)[0]);
        }
    };

    const handleTabClick = (nivelKey) => {
        setActiveTab(nivelKey);
    };

    const handleSidebarNavigation = (path) => {
        setLoading(true);
        setTimeout(() => navigate(path), 800);
    };

    if (loading) return <Loading />;

    return (
        <>
            <div className="container-fluid p-0 sticky-header">
                {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>
            <Layout modules={modules} onNavigate={handleSidebarNavigation}>
                <div className="content-container mt-3">
                    <h2 className="mb-4">Materias del Período</h2>
                    <div className="tabs-scroll-wrapper mb-3">
                        <ul className="nav nav-tabs flex-nowrap" role="tablist">
                            {Object.keys(agrupadoPorNivel).map((nivelKey) => (
                                <li className="nav-item" key={nivelKey}>
                                    <button
                                        className={`nav-link ${activeTab === nivelKey ? "active" : ""}`}
                                        onClick={() => handleTabClick(nivelKey)}
                                        type="button"
                                        role="tab"
                                    >
                                        {nivelesMap[nivelKey] || nivelKey}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="tab-content mt-3">
                        {Object.entries(agrupadoPorNivel).map(([nivelKey, asignacionesList]) => (
                            <div
                                className={`tab-pane fade ${activeTab === nivelKey ? "show active" : ""}`}
                                role="tabpanel"
                                key={nivelKey}
                            >
                                <Row xs={1} md={2} lg={3} className="g-4">
                                    {asignacionesList.map((asig) => {
                                        const nombreCompletoDocente = `${asig.Docente?.primer_nombre} ${asig.Docente?.segundo_nombre || ""} ${asig.Docente?.primer_apellido} ${asig.Docente?.segundo_apellido || ""}`.trim();

                                        return (
                                            <Col key={asig.ID}>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>{asig.Materia?.nombre}</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">
                                                            {asig.Materia?.tipo} | Paralelo: {asig.paralelo}
                                                        </Card.Subtitle>
                                                        <Card.Text>
                                                            <strong>Horario:</strong> {asig.horaInicio} - {asig.horaFin} <br />
                                                            <strong>Días:</strong> {asig.dias.join(", ")} <br />
                                                            <strong>Docente:</strong> {nombreCompletoDocente} <br />
                                                        </Card.Text>
                                                        <div className="d-flex justify-content-between mt-3">
                                                            <button
                                                                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                                                onClick={() =>
                                                                    navigate(`/secretaria/periodo/materias/estudiantes/${asig.ID}`, {
                                                                        state: {
                                                                          ID: asig.ID,
                                                                          materia: asig.Materia?.nombre,
                                                                          docente: nombreCompletoDocente,
                                                                          paralelo: asig.paralelo,
                                                                          descripcionPeriodo: asig.Periodo_Academico?.descripcion,
                                                                          horario: `${asig.horaInicio}-${asig.horaFin}`,
                                                                          idPeriodo, 
                                                                        }
                                                                      })                                                                      
                                                                }
                                                            >
                                                                <i className="bi bi-people-fill"></i> Ver Lista
                                                            </button>

                                                            <button
                                                                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                                                                onClick={() =>
                                                                    navigate(`/secretaria/calificaciones/asignacion/${asig.ID}`, {
                                                                      state: {
                                                                        ID: asig.ID,
                                                                        materia: asig.Materia?.nombre,
                                                                        docente: nombreCompletoDocente,
                                                                        paralelo: asig.paralelo,
                                                                        periodo: asig.Periodo_Academico?.descripcion,
                                                                        horario: `${asig.horaInicio}-${asig.horaFin}`,
                                                                        idPeriodo,
                                                                        nivel: asig.Materia?.nivel,
                                                                        soloLectura: true, 
                                                                      }
                                                                    })
                                                                  }                                                                  
                                                            >
                                                                <i className="bi bi-journal-check"></i> Ver Calificaciones
                                                            </button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        ))}
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default MateriasPorPeriodo;
