import React, { useState } from 'react';
import Filtro from '../../../Components/Filtro';
import Tabla from './TablaCursos';
import { Eliminar } from '../../../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../../../Utils/CRUD/Editar';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import "../../../Styles/Contenedor.css"
import CrearCurso from "./CrearCurso";
import { useEffect } from 'react';
import Loading from '../../../../../components/Loading';
import Paginación from '../../../Components/Paginación';

function ContenedorCursos({ apiEndpoint, PK}) {
    const [data,setData]=useState([])
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('')
    const [entityToUpdate, setEntityToUpdate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [periodo, setPeriodo] = useState("")
    const [periodos, setPeriodos] = useState([])
    const [page,setPage]=useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const [width, setWidth] = useState(window.innerWidth);
    const [limit, setLimit] = useState(0);
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    
    const token = localStorage.getItem("token")
    const key1 = "Materia"
    const key2 = "nombre"
    // ✅ Detectar cambio de tamaño de pantalla
      useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
    
      // ✅ Establecer límite de resultados según resolución
      useEffect(() => {
    
        const isLaptop = width <= 1822;
        setLimit(isLaptop ? 13 : 21);
      }, [width]);

    useEffect(() => {
        axios.get(`${API_URL}/periodo_academico/obtener`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setPeriodos(response.data.data);
                
            })
            .catch(error => {
                ErrorMessage(error);
            })
    }, [API_URL])
    
    
      
    
    const handlePeriodoChange = (e) => {
        const selectedPeriodo = e.target.value;
        setPeriodo(selectedPeriodo);

        if (!selectedPeriodo) {
            setData([])
            return; // Evitar peticiones innecesarias
        }
        axios.get(`${API_URL}/asignacion/obtener/periodo/${selectedPeriodo}?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                console.log(response.data)
                setData(response.data.data);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => {
                ErrorMessage(error);
            });
    };

    const obtenerAsignaciones = async (tipo) => {
        try {
            if (!periodo) {
                throw new Error("No se ha seleccionado un periodo");
            }
            const response = await axios.get(`${API_URL}/${apiEndpoint}/nivel/${tipo}/${periodo}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoading(false);
            return response.data; // Retornar los datos obtenidos
        } catch (error) {
            ErrorMessage(error);
            setLoading(false);
            return null; // Retornar null en caso de error
        }
    };

    const agruparAsignaciones = async (niveles) => {
        try {
            // Obtener asignaciones en paralelo para todos los niveles
            const asignaciones = await Promise.all(niveles.map(nivel => obtenerAsignaciones(nivel)));
            // Combinar todos los resultados en un solo array
            const datosCombinados = asignaciones.flat(); // `flat()` es más eficiente y limpio para unir arrays
            setData(datosCombinados);
        } catch (error) {
            ErrorMessage(error)
        }
    };

    const HandleTable = (valor) => {
        if (!periodo) {
            return
        }
        const grupos = {
            "BE": ["1ro BE", "2do BE"],
            "BM": ["1ro BM", "2do BM", "3ro BM"],
            "BS": ["1ro BS", "2do BS", "3ro BS"],
            "BCH": ["1ro BCH", "2do BCH", "3ro BCH"],
            "Agr": ["BM", "BS", "BCH", "BS BCH"],

        };

        if (grupos[valor]) {
            agruparAsignaciones(grupos[valor]);
        }
        else {
            console.log("este es el periodo ID", periodo)
            axios.get(`${API_URL}/asignacion/obtener/periodo/${periodo}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    ErrorMessage(error);
                });
        }
        console.log("Esta es la data", data);
    };

    const filteredData = Array.isArray(data)
        ? data.filter((item) => {
            

            const value = item?.[key1]?.[key2];

           

            return typeof value === "string"
                ? value.toLowerCase().includes(search.toLowerCase())
                : false;
        })
        : [];

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
        setEntityToUpdate(null);
    };

    const handleSaveEntity = (newEntity, headers) => {
        Editar(entityToUpdate, newEntity, `${API_URL}/${apiEndpoint}`, setData, setIsModalOpen, PK, headers);
        console.log("esta es la data despues de editar,", data)
    };

    const handleEdit = (entity) => {
        setEntityToUpdate(entity);
        setIsModalOpen(true);
    };

    const handleDelete = (entity) => {
        Eliminar(entity, `${API_URL}/${apiEndpoint}/eliminar`, "esta asignación", setData, PK);
    };

    return (
        <div className='Contenedor-general'>
            {!periodo && (
                <label className="label-error">
                    *Se requiere un periodo
                </label>
            )}
            <div className='filtros'>

                <div className='form-group'>

                    <select
                        onChange={handlePeriodoChange}
                        className="input-field"
                    >
                        <option value="">Seleccione un periodo</option>
                        {periodos.map((periodo) => (
                            <option key={periodo.ID} value={periodo.ID}>
                                {periodo.descripcion}
                            </option>
                        ))}
                    </select>


                </div>
                <div className='form-group'>
                    <select
                        onChange={(e) => HandleTable(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Selecciona un grupo </option>
                        <option value="BE">Básico Elemental</option>
                        <option value="BM">Básico Medio</option>
                        <option value="BS">Básico Superior</option>
                        <option value="BCH">Bachillerato</option>
                        <option value="Agr">Agrupaciones</option>

                    </select>
                </div>
                <Filtro search={search} setSearch={setSearch} toggleModal={toggleModal} filterKey={key1} />
            </div>
            {isModalOpen && (
                <CrearCurso
                    onCancel={toggleModal}
                    entityToUpdate={entityToUpdate}
                    onSave={handleSaveEntity}
                    periodo={periodo}
                />
            )}
            {loading ? <Loading /> : <Tabla
                filteredData={filteredData}
                OnEdit={handleEdit}
                OnDelete={handleDelete}
                headers={Headers}

            />
            }
            {Paginación && data.length > 0 && <Paginación totalPages={totalPages} page={page} setPage={setPage} />}
        </div>
    );
}

export default ContenedorCursos;