import React, { useState, useEffect } from 'react'
import Header from "../../../components/Header";
import ChangePassword from '../../components/ChangePassword';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Utils/useAuth';

function Index() {
    // Protección de ruta
    const auth = useAuth("Profesor");
    
    // Si no está autenticado, no renderizar nada
    if (!auth.isAuthenticated) {
        return null;
    }

    const [usuario, setUsuario] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);
        console.log("este es el usuario", parsedUser)
        if (!parsedUser || parsedUser.subRol !== "Profesor") {
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