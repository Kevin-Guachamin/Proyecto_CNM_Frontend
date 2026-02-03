import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import { useNavigate } from 'react-router-dom';
import '../../../components/BuscarEstudiante.css';
import BuscarEstudianteByApellido from '../../../components/BuscarEstudianteByApellido';
import Paginación from '../../Components/Paginación';

function Busqueda({ subRol }) {
  const [periodo, setPeriodo] = useState('');
  const [apellido, setApellido] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [matricula, setMatricula] = useState('');
  const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

  // refs para scroll interno y footer
  const wrapRef = useRef(null);
  const ctaRef = useRef(null);

  // Altura del contenedor con scroll interno (según su offset en viewport)
  useEffect(() => {
    const updateHeight = () => {
      if (!wrapRef.current) return;
      const top = wrapRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - top - 8;

      // Asegurar una altura mínima razonable en pantallas pequeñas
      const minHeight = window.innerWidth <= 768 ? 400 : 360;
      const h = Math.max(minHeight, availableHeight);

      document.documentElement.style.setProperty('--busq-h', `${h}px`);
    };

    // Múltiples intentos para asegurar cálculo correcto
    updateHeight();
    const timeout1 = setTimeout(updateHeight, 100);
    const timeout2 = setTimeout(updateHeight, 300);

    const onResize = () => {
      clearTimeout(window.busqResizeTimeout);
      window.busqResizeTimeout = setTimeout(() => {
        requestAnimationFrame(updateHeight);
      }, 100);
    };

    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(window.busqResizeTimeout);
      window.removeEventListener('resize', onResize);
    };
  }, []); // Agregar estudiante como dependencia para recalcular cuando aparezca

  // Altura real del footer sticky para reservar espacio al final del contenido
  useEffect(() => {
    const setCtaHeight = () => {
      const h = ctaRef.current ? ctaRef.current.offsetHeight : 0;
      document.documentElement.style.setProperty('--cta-h', `${h}px`);
    };
    setCtaHeight();

    const ro = new ResizeObserver(setCtaHeight);
    if (ctaRef.current) ro.observe(ctaRef.current);

    window.addEventListener('resize', setCtaHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setCtaHeight);
    };
  }, []);

  // Periodo activo
  useEffect(() => {
    axios
      .get(`${API_URL}/periodo_academico/activo`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPeriodo(response.data))
      .catch(ErrorMessage);
  }, [API_URL, token]);

  // Navegar / crear matrícula
  const HandleMatricular = async (estudiante) => {
    try {
      const resp = await axios.get(
        `${API_URL}/matricula/estudiante/periodo/${estudiante.ID}/${periodo.ID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let dataMatricula = resp.data;

      if (!dataMatricula) {
        const newMat = await axios.post(
          `${API_URL}/matricula/crear`,
          {
            nivel: estudiante.nivel,
            estado: 'En curso',
            ID_estudiante: estudiante.ID,
            ID_periodo_academico: periodo.ID,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dataMatricula = newMat.data;
      }

      setMatricula(dataMatricula);

      const rutaBase =
        subRol === 'Secretaria'
          ? '/secretaria/buscar_materias'
          : '/admin/buscar_materias';

      navigate(rutaBase, {
        state: { periodo, estudiante, matricula: dataMatricula.ID },
      });
    } catch (error) {
      ErrorMessage(error);
    }
  };

  return (
    <div className="Contenedor-general">
      {/* contenedor con scroll interno */}
      <div ref={wrapRef} className="busqueda-wrap">
        <div className="busqueda-content">
          <h1 className="periodo-title">
            {`Periodo académico activo ${periodo?.descripcion ?? ''}`}
          </h1>

          <BuscarEstudianteByApellido
            setEstudiantes={setEstudiantes}
            setBuscado={setBuscado}
            apellido={apellido}
            setApellido={setApellido}
            page={page}
            setTotalPages={setTotalPages}
          />

          <div className="Contenedor-estudiante">
            {buscado && estudiantes.length === 0 && (
              <p className="no-registros">No se encontró coincidencias.</p>
            )}

            {estudiantes.length > 0 && (
              <div className="scroll-tabla-matricula-estudiantes">
                <table className="tabla-matricula-estudiantes">
                  <thead>
                    <tr>
                      <th className="encabezado-tabla-matricula-estudiantes">Cédula</th>
                      <th className="encabezado-tabla-matricula-estudiantes">Primer nombre</th>
                      <th className="encabezado-tabla-matricula-estudiantes">Primer apellido</th>
                      <th className="encabezado-tabla-matricula-estudiantes">Género</th>
                      <th className="encabezado-tabla-matricula-estudiantes">Jornada</th>
                      <th className="encabezado-tabla-matricula-estudiantes">Nivel</th>
                      <th className="encabezado-tabla-matricula-estudiantes">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((estudiante, index) => (
                      <tr key={index}>
                        <td className="celda-tabla-matricula-estudiantes">{estudiante.nroCedula}</td>
                        <td className="celda-tabla-matricula-estudiantes">{estudiante.primer_nombre}</td>
                        <td className="celda-tabla-matricula-estudiantes">{estudiante.primer_apellido}</td>
                        <td className="celda-tabla-matricula-estudiantes">{estudiante.genero}</td>
                        <td className="celda-tabla-matricula-estudiantes">{estudiante.jornada}</td>
                        <td className="celda-tabla-matricula-estudiantes">{estudiante.nivel}</td>
                        <td className="acciones-tabla-matricula-estudiantes">
                          <button
                            className="btn btn-sm btn-link text-primary"
                            onClick={() => HandleMatricular(estudiante)}
                          >
                            Empezar matrícula
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
          </div>
           {/* Paginación fija en la parte inferior */}
              <div style={{ 
                flexShrink: 0,
                padding: '15px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }} >
                {totalPages > 1 && (
                  <Paginación totalPages={totalPages} page={page} setPage={setPage} />
                )}
              </div>
        </div>
      </div>
    </div>
  );
}

export default Busqueda;
