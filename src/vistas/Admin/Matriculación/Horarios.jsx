import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';

function Horarios() {
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    // Obtener el objeto desde la URL y decodificarlo
    const estudiante = JSON.parse(decodeURIComponent(params.get("estudiante")));
    const [periodo, setPeriodo] = useState("")
    const [asignaciones,setAsignaciones]=useState([])
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

    const HandleBuscar = ()=>{
        
    }
    useEffect(() => {

        axios.get(`${API_URL}/periodo_academico/activo`)
            .then(response => {
                setPeriodo(response.data);
            })
            .catch(error => {
                ErrorMessage(error)

            });
    }, [API_URL]);

    return (
        <div>
            <h1>{`Periodo académico activo ${periodo.descripcion}`}</h1>
            <label htmlFor="">Ingrese el nombre de la Materia</label>
            <input type="text" />
            <button onClick={HandleBuscar}>Buscar</button>

        </div>
    )
}

export default Horarios