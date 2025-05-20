import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import { Card, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import "./Reportes.css";

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

const iconoPorNivel = {
    "1ro BE": "bi-book",
    "2do BE": "bi-book",
    "1ro BM": "bi-journal-bookmark",
    "2do BM": "bi-journal-bookmark",
    "3ro BM": "bi-journal-bookmark",
    "1ro BS": "bi-mortarboard",
    "2do BS": "bi-mortarboard",
    "3ro BS": "bi-mortarboard",
    "1ro BCH": "bi-award",
    "2do BCH": "bi-award",
    "3ro BCH": "bi-award",
    default: "bi-folder"
};

function Reportes() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [modules, setModules] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");
    const [niveles, setNiveles] = useState([]);
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
        setModules(transformModulesForLayout(getModulos(parsedUser.subRol, true)));

        axios
            .get(`${import.meta.env.VITE_URL_DEL_BACKEND}/periodo_academico/obtener`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setPeriodos(res.data.data);
                const estadoGuardado = JSON.parse(sessionStorage.getItem("estadoReporte") || "{}");
                if (estadoGuardado?.idPeriodo) {
                    setPeriodoSeleccionado(estadoGuardado.idPeriodo);
                }
            })
            .catch((err) => {
                ErrorMessage(err);
                Swal.fire("Error", "No se pudieron obtener los períodos académicos.", "error");
            });
    }, [navigate]);

    useEffect(() => {
        if (!periodoSeleccionado) return;
        const token = localStorage.getItem("token");
        setLoading(true);

        axios
            .get(`${import.meta.env.VITE_URL_DEL_BACKEND}/asignacion/obtener/periodo_academico/${periodoSeleccionado}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const nivelesUnicos = [...new Set(res.data.data.map((a) => a.Materia?.nivel).filter(Boolean))];
                setNiveles(nivelesUnicos);
            })
            .catch((err) => {
                ErrorMessage(err);
                Swal.fire("Error", "No se pudieron obtener los niveles del período.", "error");
                setNiveles([]);
            })
            .finally(() => setLoading(false));
    }, [periodoSeleccionado]);

    const handleNivelClick = (nivel) => {
        const periodo = periodos.find(p => p.ID === parseInt(periodoSeleccionado));
        const estado = {
            idPeriodo: periodoSeleccionado,
            descripcionPeriodo: periodo?.descripcion || "",
            nivel
        };
    
        sessionStorage.setItem("estadoReporte", JSON.stringify(estado));
    
        navigate(`/secretaria/reportes/nivel/${nivel}?idPeriodo=${periodoSeleccionado}`, {
            state: estado
        });
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
                    <h2 className="mb-4">Reportes de calificaciones por Nivel</h2>
                    <Form.Group className="mb-4" controlId="periodoSelect">
                        <Form.Label>Selecciona un período académico:</Form.Label>
                        <Form.Select
                            value={periodoSeleccionado}
                            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                        >
                            <option value="">-- Selecciona un período --</option>
                            {periodos.map((periodo) => (
                                <option key={periodo.ID} value={periodo.ID}>
                                    {periodo.descripcion} {periodo.estado === "Activo" ? "(Activo)" : ""}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {niveles.length > 0 ? (
                        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                            {niveles.map((nivel) => (
                                <Col key={nivel} className="d-flex">
                                    <Card className="reporte-card w-100">
                                        <Card.Body className="text-center d-flex flex-column justify-content-between">
                                            <Card.Title className="text-primary">
                                                <i className={`bi ${iconoPorNivel[nivel] || iconoPorNivel.default} me-2`}></i>
                                                {nivelesMap[nivel] || nivel}
                                            </Card.Title>
                                            <Card.Text className="text-muted mb-3">
                                                Accede a los reportes académicos registrados para este nivel.
                                            </Card.Text>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleNivelClick(nivel)}
                                            >
                                                <i className="bi bi-clipboard-data me-1"></i> Ver Reportes de Estudiantes
                                            </button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : periodoSeleccionado ? (
                        <p className="text-muted">No se encontraron niveles para este período.</p>
                    ) : null}
                </div>
            </Layout>
        </>
    );
}

export default Reportes;