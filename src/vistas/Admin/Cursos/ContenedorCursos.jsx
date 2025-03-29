import React, { useState } from 'react';
import Filtro from '../Components/Filtro';
import Tabla from '../Components/Tabla';
import { Eliminar } from '../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../Utils/CRUD/Editar';
import axios from 'axios';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import "../Styles/Contenedor.css"
import Loading from "../../../components/Loading";
import CrearCurso from "./CrearCurso";
import { useEffect } from 'react';


function Contenedor({ headers, columnsToShow, filterKey, apiEndpoint, PK, extraIcon, Paginación }) {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState([])
    const [entityToUpdate, setEntityToUpdate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [periodo, setPeriodo] = useState("")
    const [periodos, setPeriodos] = useState([])
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

    useEffect(() => {
        axios.get(`${API_URL}/periodo_academico/obtener`)
            .then(response => {
                setPeriodos(response.data);

            })
            .catch(error => {
                ErrorMessage(error);
            })
    }, [API_URL])
    const obtenerAsignaciones = async (tipo) => {
        try {
            const response = await axios.get(`${API_URL}/${apiEndpoint}/nivel/${tipo}`);
            setLoading(false);
            return response.data; // Retornar los datos obtenidos
        } catch (error) {
            ErrorMessage(error);
            setLoading(false);
            return null; // Retornar null en caso de error
        }
    };
    const AgruparBE = async () => {
        const BE1 = await obtenerAsignaciones("1ro BE")
        const BE2 = await obtenerAsignaciones("2do BE")
        const BE = [BE1, BE2]
        setData(BE)
    }
    const AgruparBM = async () => {
        const BM1 = await obtenerAsignaciones("1ro BM")
        const BM2 = await obtenerAsignaciones("2do BM")
        const BM3 = await obtenerAsignaciones("3ro BM")
        const BM = [BM1, BM2, BM3]
        setData(BM)
    }
    const AgruparBS = async () => {
        const BS1 = await obtenerAsignaciones("1ro BS")
        const BS2 = await obtenerAsignaciones("2do BS")
        const BS3 = await obtenerAsignaciones("3ro BS")
        const BS = [BS1, BS2, BS3]
        setData(BS)
    }
    const AgruparBCH = async () => {
        const BCH1 = await obtenerAsignaciones("1ro BCH")
        const BCH2 = await obtenerAsignaciones("2do BCH")
        const BCH3 = await obtenerAsignaciones("3ro BCH")
        const BCH = [BCH1, BCH2, BCH3]
        setData(BCH)
    }
    const Agrupaciones = async () => {
        const BM = await obtenerAsignaciones("BM")
        const BS = await obtenerAsignaciones("BS")
        const BCH = await obtenerAsignaciones("BCH")
        const BCH_BS = await obtenerAsignaciones("BS BCH")
        const agr = [BM, BS, BCH_BS, BCH]
        setData(agr)
    }
    const HandleTable = (valor) => {
        if (valor === "BE") {
            AgruparBE()
        }
        if (valor === "BM") {
            AgruparBM()
        }
        if (valor === "BS") {
            AgruparBS()
        }
        if (valor === "BCH") {
            AgruparBCH()
        }
        if (valor === "Agr") {
            Agrupaciones()
        }
    }

    const filteredData = data.filter((item) => {
        const value = item?.[filterKey]; // Acceder de forma segura a la propiedad
        return value ? value.toLowerCase().includes(search.toLowerCase()) : false;
    });

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
        setEntityToUpdate(null);
    };

    const handleSaveEntity = (newEntity, headers) => {
        Editar(entityToUpdate, newEntity, `${API_URL}/${apiEndpoint}`, setData, setIsModalOpen, PK, headers);
    };

    const handleEdit = (entity) => {
        setEntityToUpdate(entity);
        setIsModalOpen(true);
    };

    const handleDelete = (entity) => {
        Eliminar(entity, `${API_URL}/${apiEndpoint}/eliminar`, entity[filterKey], setData, PK);
    };

    return (
        <div className='Contenedor-general'>

            <Filtro search={search} setSearch={setSearch} toggleModal={toggleModal} filterKey={filterKey} />
            <div>
                <label >Seleccionar Grupo </label>
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
            <div>
                <label >Seleccionar Año Lectivo </label>
                <select
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="input-field"
                >
                    <option value="">Seleccione un periodo</option>
                    {periodos.map((periodo) => (
                        <option key={periodo.ID} value={periodo.descripcion}>
                            {periodo.descripcion}
                        </option>
                    ))}
                </select>
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
                headers={headers}
                columnsToShow={columnsToShow}
                extraIcon={extraIcon}
            />}
            {Paginación && data.length > 0 && <div className='Paginación'>{Paginación}</div>}
        </div>
    );
}

export default Contenedor;