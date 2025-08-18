import React, { useEffect, useRef, useState } from 'react';
import Filtro from '../../../Components/Filtro';
import Tabla from './TablaCursos';
import { Eliminar } from '../../../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../../../Utils/CRUD/Editar';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import "../../../Styles/Contenedor.css";
import CrearCurso from "./CrearCurso";
import Loading from '../../../../../components/Loading';
import Paginación from '../../../Components/Paginación';

function ContenedorCursos() {
  const [data, setData] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [periodo, setPeriodo] = useState("");

  const [loading, setLoading] = useState(false);
  const [entityToUpdate, setEntityToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);

  const [search, setSearch] = useState('');
  const [grupo, setGrupo] = useState(''); // BE, BM, BS, BCH, Agr o ''

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["ID", "Nivel", "Materia", "Paralelo", "Docente", "Acciones"];

  // para calcular cuántas filas caben sin scroll interno
  const wrapperRef = useRef(null);

  // === Calcula "limit" según espacio real disponible ===
  useEffect(() => {
    const calcRows = () => {
      const ROW_H = 62;            // alto aprox de fila
      const PAGINATION_H = 30;     // alto aprox de la barra de paginación
      const GAP = 24;

      const top = wrapperRef.current
        ? wrapperRef.current.getBoundingClientRect().top
        : 0;

      const available = window.innerHeight - top - PAGINATION_H - GAP;
      const rows = Math.max(5, Math.floor(available / ROW_H));
      setLimit(rows);
    };

    calcRows();
    const onResize = () => requestAnimationFrame(calcRows);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [periodo, grupo, search, isModalOpen]);

  // === Cargar periodos ===
  useEffect(() => {
    axios.get(`${API_URL}/periodo_academico/obtener`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setPeriodos(res.data.data ?? []))
    .catch(ErrorMessage);
  }, [API_URL, token]);

  // === Reset a página 1 al cambiar filtros/limit ===
  useEffect(() => {
    if (!limit) return;
    setPage(1);
  }, [periodo, grupo, search, limit]);

  // === Fetch principal ===
  useEffect(() => {
    if (!periodo || !limit) {
      setData([]);
      setTotalPages(1);
      return;
    }

    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);

        if (grupo) {
          const grupos = {
            "BE": ["1ro BE", "2do BE"],
            "BM": ["1ro BM", "2do BM", "3ro BM"],
            "BS": ["1ro BS", "2do BS", "3ro BS"],
            "BCH": ["1ro BCH", "2do BCH", "3ro BCH"],
            "Agr": ["BM", "BS", "BCH", "BS BCH"],
          };

          const niveles = grupos[grupo] ?? [];
          if (niveles.length === 0) {
            const { data: resp } = await axios.get(
              `${API_URL}/asignacion/obtener/periodo/${periodo}`,
              { params: { page, limit, search }, headers: { Authorization: `Bearer ${token}` } }
            );
            if (!mounted) return;
            setData(resp.data ?? resp);
            setTotalPages(resp.totalPages ?? 1);
          } else {
            const resultados = await Promise.all(
              niveles.map(nivel =>
                axios.get(
                  `${API_URL}/asignacion/nivel/${encodeURIComponent(nivel)}/${periodo}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                ).then(r => r.data)
              )
            );

            const combinados = resultados.flatMap(r => Array.isArray(r) ? r : (r.data ?? []));
            const filtrados = search
              ? combinados.filter(item =>
                  JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
              : combinados;

            const total = filtrados.length;
            const start = (page - 1) * limit;
            const end = start + limit;
            const pageData = filtrados.slice(start, end);

            if (!mounted) return;
            setData(pageData);
            setTotalPages(Math.max(1, Math.ceil(total / limit)));
          }
        } else {
          const { data: resp } = await axios.get(
            `${API_URL}/asignacion/obtener/periodo/${periodo}`,
            { params: { page, limit, search }, headers: { Authorization: `Bearer ${token}` } }
          );
          if (!mounted) return;
          setData(resp.data ?? resp);
          setTotalPages(resp.totalPages ?? 1);
        }
      } catch (err) {
        ErrorMessage(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [API_URL, token, periodo, page, limit, search, grupo]);

  // Handlers
  const handlePeriodoChange = (e) => setPeriodo(e.target.value);
  const Handle = (valor) => setGrupo(valor || '');
  const filtrar = (e) => setSearch(e?.target?.value ?? '');
  const toggleModal = () => { setIsModalOpen(prev => !prev); setEntityToUpdate(null); };
  const handleSaveEntity = (newEntity, headersExtra) =>
    Editar(entityToUpdate, newEntity, `${API_URL}/asignacion`, setData, setIsModalOpen, "ID", headersExtra);
  const handleEdit = (entity) => { setEntityToUpdate(entity); setIsModalOpen(true); };
  const handleDelete = (entity) => Eliminar(entity, `${API_URL}/asignacion/eliminar`, "esta asignación", setData, "ID");

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

        {/* IMPORTANTE: clase especial para controlar el layout interno del filtro */}
        <div className='form-group'>
          <Filtro
            search={search}
            filtrar={filtrar}
            toggleModal={toggleModal}
            filterKey="Nombre materia"
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

      {/* Tabla + Paginación */}
      <div className="tabla-layout">
        <div className="tabla-wrapper" ref={wrapperRef}>
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

        <div className="pagination-bar">
          {data.length > 0 && (
            <Paginación totalPages={totalPages} page={page} setPage={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ContenedorCursos;
