import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import BuscarEstudiante from '../../../components/BuscarEstudiante';
import InfoEstudiante from '../Estudiantil/Estudiantes/InfoEstudiante';
import { useNavigate } from 'react-router-dom';
import '../../../components/BuscarEstudiante.css';

function Busqueda({ subRol }) {
  const [periodo, setPeriodo] = useState('');
  const [cedula, setCedula] = useState('');
  const [estudiante, setEstudiante] = useState('');
  const [buscado, setBuscado] = useState(false);
  const [matricula, setMatricula] = useState('');

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
      const h = Math.max(360, window.innerHeight - top - 8);
      document.documentElement.style.setProperty('--busq-h', `${h}px`);
    };
    updateHeight();
    const onResize = () => requestAnimationFrame(updateHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
  }, [estudiante]);

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
  const HandleMatricular = async () => {
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

          <BuscarEstudiante
            estudiante={estudiante}
            setEstudiante={setEstudiante}
            setBuscado={setBuscado}
            cedula={cedula}
            setCedula={setCedula}
          />

          <div className="Contenedor-estudiante">
            {buscado && !estudiante && (
              <p className="no-registros">No se encontró el estudiante.</p>
            )}

            {estudiante && (
              <div className="info-estudiante-wrapper">
                <InfoEstudiante estudiante={estudiante} />
              </div>
            )}
          </div>
        </div>

        {/* Footer sticky (solo si hay estudiante) */}
        {estudiante && (
          <div ref={ctaRef} className="cta-footer">
            <button className="btn-buscar btn-cta" onClick={HandleMatricular}>
              Empezar o modificar matrícula
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Busqueda;
