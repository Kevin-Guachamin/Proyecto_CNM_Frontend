import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Materias from "./Materias";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import { getModulos, transformModulesForLayout } from "../../getModulos";
function Index() {
    const [usuario, setUsuario] = useState(null);
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const navigate = useNavigate()

    const token = localStorage.getItem("token")
    const [inscripciones, setInscripciones] = useState([])

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser || (parsedUser.subRol !== "Profesor")) {
            navigate("/");
        } else {
            setUsuario(parsedUser);
            console.log("este es el parseUser",parsedUser)

        }
    }, [API_URL, navigate]);
    useEffect(() => {
        if (usuario) {
          axios.get(`${API_URL}/inscripcion/obtener/docente/${usuario.nroCedula}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => {
            setInscripciones(res.data);
          })
          .catch(err => {
            ErrorMessage(err);
          });
        }
      }, [usuario]); // 👈 impo



    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>
            <Layout modules={transformModulesForLayout(getModulos("Profesor", true))}>
                {console.log("asqui va el usuario", usuario)}
                {usuario && (
                    <Materias docente={usuario} inscripciones={inscripciones} />
                )}
            </Layout>
        </div>
    )
}

export default Index