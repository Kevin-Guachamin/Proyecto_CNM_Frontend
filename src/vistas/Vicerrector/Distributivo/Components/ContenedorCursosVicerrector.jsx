import React, { useEffect, useState } from 'react';
import FiltroVicerrector from '../../Components/FiltroVicerrector';
import Tabla from './TablaCursosVicerrector';
import axios from 'axios';
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import "../../../Admin/Styles/Contenedor.css";
import Loading from '../../../../components/Loading';

function ContenedorCursosVicerrector({ 
  search, 
  filtrar, 
  data, 
  setData, 
  periodo, 
  setPeriodo, 
  grupo, 
  setGrupo,
  loading 
}) {
  const [periodos, setPeriodos] = useState([]);

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["ID", "Nivel", "Materia", "Paralelo", "Docente"];

  // === Cargar periodos ===
  useEffect(() => {
    axios.get(`${API_URL}/periodo_academico/obtener`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setPeriodos(res.data.data ?? []))
    .catch(ErrorMessage);
  }, [API_URL, token]);

  // Handlers
  const handlePeriodoChange = (e) => setPeriodo(e.target.value);
  const Handle = (valor) => setGrupo(valor || '');

  return (
    <div className='Contenedor-general'>
      {!periodo && <label className="label-error">*Se requiere un periodo</label>}

      {/* Filtros (fila) */}
      <div className='filtros'>
        <div className='form-group'>
          <select onChange={handlePeriodoChange} className="input-field" value={periodo}>
            <option value="">Seleccione un periodo</option>
            {periodos.map((p) => (
              <option key={p.ID} value={p.ID}>{p.descripcion}</option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <select onChange={(e) => Handle(e.target.value)} className="input-field" value={grupo}>
            <option value="">Selecciona un grupo</option>
            <option value="BE">Básico Elemental</option>
            <option value="BM">Básico Medio</option>
            <option value="BS">Básico Superior</option>
            <option value="BCH">Bachillerato</option>
            <option value="Agr">Agrupaciones</option>
          </select>
        </div>

        <div className='form-group'>
          <FiltroVicerrector
            search={search}
            filtrar={filtrar}
            filterKey="Nombre materia"
            disabled={!grupo}
            placeholder={"Filtrar por Nombre materia"}
          />
        </div>
      </div>

      {/* Tabla sin paginación */}
      <div className="tabla-wrapper">
        {loading ? (
          <Loading />
        ) : (
          <Tabla
            filteredData={data}
            headers={headers}
          />
        )}
      </div>
    </div>
  );
}

export default ContenedorCursosVicerrector;
