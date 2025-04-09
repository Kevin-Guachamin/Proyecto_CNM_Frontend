import React, { useState, useEffect } from 'react'
import Header from "../../../components/Header";
import ChangePassword from '../../components/ChangePassword';
import { useNavigate } from 'react-router-dom';

function Index() {

    const [usuario, setUsuario] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        const parsedUser = JSON.parse(storedUser);
        console.log("este es el usuario", parsedUser)
        if (!parsedUser || parsedUser.subRol !== "Secretaria") {
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