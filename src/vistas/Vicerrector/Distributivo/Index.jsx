import React, { useState, useEffect } from 'react'
import Header from "../../../components/Header";
import Layout from '../../../layout/Layout';
import { useNavigate } from 'react-router-dom';
import ContenedorCursos from '../../Admin/Modules/Configuration/Cursos/ContenedorCursos';
import { getModulos, transformModulesForLayout } from "../../getModulos";
import { useAuth } from '../../../Utils/useAuth';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';

function Index() {
    // Protección de ruta para Vicerrector
    const auth = useAuth("Vicerrector");
    
    // Si no está autenticado, mostrar mensaje de error
    if (!auth.isAuthenticated) {
        return <ErrorMessage message="No tienes permisos para acceder a esta página" />;
    }

     const [modules, setModules] = useState([]);
    
    const [usuario, setUsuario] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);
        console.log("este es el usuario", parsedUser)
        if (!parsedUser || parsedUser.subRol !== "Vicerrector") {
            navigate("/")

        }

        const modulosBase = getModulos(parsedUser.subRol, true);
        setModules(transformModulesForLayout(modulosBase));
        setUsuario(parsedUser);
    }, [navigate]);
    
    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>
            <Layout modules={modules }>
                <ContenedorCursos apiEndpoint={"asignacion"} PK={"ID"} />

            </Layout>
        </div>
    )
}

export default Index