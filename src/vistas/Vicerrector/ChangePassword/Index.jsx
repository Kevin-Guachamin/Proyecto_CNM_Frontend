import React, { useState, useEffect } from 'react'
import Header from "../../../components/Header";
import ChangePassword from '../../components/ChangePassword';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Utils/useAuth';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';

function Index() {
    // Protección de ruta para Vicerrector
    const auth = useAuth("Vicerrector");
    
    // Si no está autenticado, mostrar mensaje de error
    if (!auth.isAuthenticated) {
        return <ErrorMessage message="No tienes permisos para acceder a esta página" />;
    }

    const [usuario, setUsuario] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);
        console.log("este es el usuario", parsedUser)
        if (!parsedUser || parsedUser.subRol !== "Vicerrector") {
            navigate("/")

        }


        setUsuario(parsedUser);
    }, [navigate]);
    return (
        <div className="section-container">
            {/* Encabezado */}
            <div className="container-fluid p-0">
                {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>

            <ChangePassword type={"docente"} redireccion={"/inicio"}/>


        </div>
    )
}

export default Index