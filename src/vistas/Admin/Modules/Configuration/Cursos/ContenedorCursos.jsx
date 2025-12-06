import React, { useEffect, useState } from 'react';
import Filtro from '../../../Components/Filtro';
import Tabla from './TablaCursos';
import { Eliminar } from '../../../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../../../Utils/CRUD/Editar';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import "../../../Styles/Contenedor.css";
import CrearCurso from "./CrearCurso";
import Loading from '../../../../../components/Loading';

function ContenedorCursos({ 
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
  const [entityToUpdate, setEntityToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["ID", "Nivel", "Materia", "Paralelo", "Docente", "Acciones"];

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
  const toggleModal = () => { setIsModalOpen(prev => !prev); setEntityToUpdate(null); };
  const handleSaveEntity = (newEntity, headersExtra) =>
    Editar(entityToUpdate, newEntity, `${API_URL}/asignacion`, setData, setIsModalOpen, "ID", headersExtra);
  const handleEdit = (entity) => { setEntityToUpdate(entity); setIsModalOpen(true); };
  const handleDelete = (entity) => Eliminar(entity, `${API_URL}/asignacion/eliminar`, "esta asignación", setData, "ID");

  return (
    <div className='Contenedor-general'>
      {!periodo && (
        <div className="alert-message">
          ⚠️ Debe seleccionar un período académico para poder ver y agregar cursos
        </div>
      )}

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
          <Filtro
            search={search}
            filtrar={filtrar}
            toggleModal={!periodo ? null : toggleModal}
            filterKey="Nombre materia"
            placeholder={"Filtrar por nombre materia"}
            addButtonDisabled={!periodo}
          />
        </div>
      </div>

      {isModalOpen && periodo && (
        <CrearCurso
          onCancel={toggleModal}
          entityToUpdate={entityToUpdate}
          onSave={handleSaveEntity}
          periodo={periodo}
        />
      )}

      {/* Tabla sin paginación */}
      <div className="tabla-wrapper">
        {loading ? (
          <Loading />
        ) : (
          <Tabla
            filteredData={data}
            OnEdit={handleEdit}
            OnDelete={handleDelete}
            headers={headers}
          />
        )}
      </div>
    </div>
  );
}

export default ContenedorCursos;
