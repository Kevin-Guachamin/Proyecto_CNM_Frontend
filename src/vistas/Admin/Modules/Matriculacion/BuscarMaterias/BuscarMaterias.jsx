import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col } from "react-bootstrap";
import Horario from '../Horario';
import '../../../../components/BuscarEstudiante.css';
import '../../../Styles/Matricula.css';

function BuscarMaterias() {
  const [asignatura, setAsignatura] = useState('');
  const [buscarAsignacion, setBucarAsignacion] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");
  const { periodo, estudiante, matricula } = location.state || {};

  // ▶ contenedor con scroll interno
  const wrapRef = useRef(null);
  const footerRef = useRef(null);

  // Calcula la altura disponible para el contenedor con scroll interno
  useEffect(() => {
    const updateHeight = () => {
      if (!wrapRef.current) return;
      // distancia del wrapper al borde superior del viewport
      const top = wrapRef.current.getBoundingClientRect().top;
      // alto visible disponible desde ese punto
      const availableHeight = window.innerHeight - top - 8; // 8px de respiro
      
      // Asegurar una altura mínima razonable en pantallas pequeñas
      const minHeight = window.innerWidth <= 768 ? 400 : 360;
      const h = Math.max(minHeight, availableHeight);
      
      document.documentElement.style.setProperty('--matric-h', `${h}px`);
    };

    // Múltiples intentos para asegurar cálculo correcto
    updateHeight();
    const timeout1 = setTimeout(updateHeight, 100);
    const timeout2 = setTimeout(updateHeight, 300);

    const onResize = () => {
      clearTimeout(window.matricResizeTimeout);
      window.matricResizeTimeout = setTimeout(() => {
        requestAnimationFrame(updateHeight);
      }, 100);
    };

    window.addEventListener('resize', onResize);
    // si tu layout cambia alturas al hacer scroll del body, re-calcula
    window.addEventListener('scroll', onResize, { passive: true });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(window.matricResizeTimeout);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [asignaciones, inscripciones]); // Recalcular cuando cambie el contenido

  // Calcular altura del footer para reservar espacio
  useEffect(() => {
    const setFooterHeight = () => {
      const h = footerRef.current ? footerRef.current.offsetHeight : 0;
      const paddedHeight = h > 0 ? h + 16 : 0;
      document.documentElement.style.setProperty('--footer-h', `${paddedHeight}px`);
    };
    
    const timeout = setTimeout(setFooterHeight, 50);

    const ro = new ResizeObserver(() => {
      clearTimeout(window.footerResizeTimeout);
      window.footerResizeTimeout = setTimeout(setFooterHeight, 100);
    });
    
    if (footerRef.current) ro.observe(footerRef.current);

    return () => {
      clearTimeout(timeout);
      clearTimeout(window.footerResizeTimeout);
      ro.disconnect();
    };
  }, [inscripciones]); // Recalcular cuando cambien las inscripciones

  // Asegurar que el botón sea visible cuando haya contenido
  useEffect(() => {
    if (inscripciones.length > 0 && footerRef.current && wrapRef.current) {
      setTimeout(() => {
        const wrapper = wrapRef.current;
        if (wrapper) {
          // Hacer scroll hacia abajo para mostrar el botón
          wrapper.scrollTop = wrapper.scrollHeight;
        }
      }, 200);
    }
  }, [inscripciones]);

  const obtenerInscripciones = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/inscripcion/obtener/matricula/${matricula}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInscripciones(data);
    } catch (error) {
      ErrorMessage(error);
    }
  };
  useEffect(() => { obtenerInscripciones(); }, []);

  const HandleBuscarAsignaturas = async () => {
    setBucarAsignacion(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/asignacion/obtener/materias/${periodo.ID}/${estudiante.nivel}/${asignatura}/${estudiante.jornada}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("asignaciones obtenidas", data);
      setAsignaciones(data);
    } catch (error) {
      console.log("error al obtener asignaciones", error);
      ErrorMessage(error);
    }
  };

  const Inscribir = async (asig) => {
    try {
      await axios.post(
        `${API_URL}/inscripcion/crear`,
        { ID_matricula: matricula, ID_asignacion: asig.ID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Inscripción exitosa",
        iconColor: "#218838",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#003F89",
      });
      await obtenerInscripciones();
      await HandleBuscarAsignaturas();
    } catch (error) {
      ErrorMessage(error);
    }
  };

  const FinalizarMatriculas = () => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    const subRol = storedUser?.subRol;
    const rutaFinal = subRol === "Secretaria" ? "/secretaria/matriculacion" : "/admin/matriculacion";
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      iconColor: "#218838",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#003F89",
    });
    navigate(rutaFinal);
  };

  return (
    <div ref={wrapRef} className="matric-wrapper">
      <div className="matric-content">
        <h1 className="periodo-title">Matricula de {estudiante.primer_nombre} {estudiante.primer_apellido}</h1>
        {/* Filtros */}
        <div className="matric-filtros">
          <div className='search-input-container'>
            <label className='label-search'>Materia:</label>
            <input
              className="input-cedula"
              type="text"
              value={asignatura ?? 'vacio'}
              onChange={(e) => setAsignatura(e.target.value)}
            />
            <button className="btn-buscar" onClick={HandleBuscarAsignaturas}>Buscar</button>
          </div>
          <a className="malla-link" href="/public/Malla.pdf" download>
            Descargar MALLA AQUÍ
          </a>
        </div>

        {/* Resultados (cards) */}
        <div className="matric-cards">
          {buscarAsignacion && (
            asignaciones.length === 0 ? (
              <p className="no-registros">No se encontraron coincidencias</p>
            ) : (
              <Row xs={1} md={2} lg={5} className="g-2">
                {asignaciones.map((asig) => {
                  const nombreDoc = `${asig.Docente?.primer_nombre || ''} ${asig.Docente?.primer_apellido || ''}`.trim();
                  return (
                    <Col key={asig.ID} className="d-flex justify-content-center p-1">
                      <Card
                        style={{ maxWidth: 300, cursor: "pointer", backgroundColor: "#CFD8DC" }}
                        onClick={() => Inscribir(asig)}
                      >
                        <Card.Body>
                          <Card.Title>{asig.Materia?.nombre}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Paralelo: {asig.paralelo} || Cupos: {asig.cupos}
                          </Card.Subtitle>
                          <Card.Text>
                            <strong>Nivel:</strong> {asig.Materia?.nivel} <br />
                            <strong>Horario:</strong> {asig.horaInicio} - {asig.horaFin} <br />
                            <strong>Días:</strong> {asig.dias?.join(", ")} <br />
                            <strong>Docente:</strong> {nombreDoc}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )
          )}
        </div>

        {/* Horario (con scroll horizontal cuando haga falta) */}
        <div className="matric-horario">
          {inscripciones.length > 0 && (
            <Horario
              materiasSeleccionadas={inscripciones}
              setMateriasSeleccionadas={setInscripciones}
              jornada={estudiante.jornada}
              nivel={estudiante.nivel}
            />
          )}
        </div>
        {/* Botón final - ahora sticky */}
      {inscripciones.length > 0 && (
        <div ref={footerRef} className='matric-footer'>
          <button className="btn-finalizar" onClick={FinalizarMatriculas}>Finalizar</button>
        </div>
      )}
      </div>

      
    </div>
  );
}

export default BuscarMaterias;
