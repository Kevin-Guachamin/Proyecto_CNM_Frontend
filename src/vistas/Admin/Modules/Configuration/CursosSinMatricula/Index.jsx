import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Cursos from "./Cursos";
import { moduloInicio, modulesSettingsBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Loading from "../../../../../components/Loading";



function Index() {
    const [usuario, setUsuario] = useState(null);
    const [cursos, setCursos] = useState([])
    const [modulos, setModulos] = useState([])
    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token = localStorage.getItem("token")
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser || parsedUser.subRol !== "Administrador") {
            navigate("/")
        }
        setUsuario(parsedUser);
        const modulosDinamicos = [
            moduloInicio,
            ...construirModulosConPrefijo(parsedUser.subRol, modulesSettingsBase)
        ];
        setModulos(modulosDinamicos);

    }, [navigate]);
    useEffect(() => {
        
        axios.get(`${API_URL}/asignacion/sinMatricula` ,{
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                setCursos(res.data)
                
                setLoading(false)
            })
            .catch(err => {
                ErrorMessage(err)
                setLoading(false)
            })
    }, [])

    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>
            <Layout modules={modulos}>
                {loading ? (<Loading />) : (<Cursos data={cursos} setData={setCursos}  />)}
            </Layout>
        </div>
    )
}

export default Index