import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Layout from "../../../../layout/Layout";
import Inscripciones from "./Inscripciones";
import { getModulos,transformModulesForLayout } from "../../../getModulos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../../../../Utils/ErrorMesaje";

function Index() {
    const [usuario, setUsuario] = useState(null);
    const [periodo, setPeriodo] = useState("")
    const [modulos, setModulos] = useState([]);
    const [asignaciones, setAsignaciones] = useState([])
    const token=localStorage.getItem("token")
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser || parsedUser.subRol !== "Profesor") {
            navigate("/")
        }
        setUsuario(parsedUser)
        console.log("este es el subRol", parsedUser.subRol)
       setModulos(transformModulesForLayout( getModulos(parsedUser.subRol)))
        
    }, [API_URL, navigate]);
    useEffect(() => {
        axios.get(`${API_URL}/periodo_academico/activo`,{
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                setPeriodo(res.data)
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }, [])
    useEffect(() => {
        if (usuario && periodo)
            axios.get(`${API_URL}/asignacion/obtener/docente/${usuario.noCedula}/${periodo.ID}`,{headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    setAsignaciones(res.data)
                })
                .catch(err => {
                    ErrorMessage(err)
                })

    }, [usuario, periodo])

    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>
            <Layout modules={modulos}>
                <Inscripciones docente={usuario} periodo={periodo} setAsignaciones={setAsignaciones} asignaciones={asignaciones}/>
            </Layout>
        </div>
    )
}

export default Index