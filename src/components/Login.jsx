import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Input from "./Input";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // try {
      // const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
      //   correo: email,
      //   password: password,
      // });

      // const { token, ...user } = response.data;
    //   localStorage.setItem("usuario", JSON.stringify(user));
    //   localStorage.setItem("token", token);

    //   if (user.role === "admin") {
    //     navigate("/administrador/inicio");
    //   } else if (user.role === "conductor") {
    //     navigate("/conductor/inicio");
    //   } else if (user.role === "estudiante") {
    //     navigate("/estudiante/inicio");
    //   } else {
    //     alert("Rol desconocido");
    //   }
    // } catch (error) {
    //   console.error("Error al iniciar sesión:", error);
    //   alert(error.response?.status === 401 ? "Correo o contraseña incorrectos" : "Ocurrió un error en el servidor");
    // }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-content">
          {/* Logo e información */}
          <div className="login-logo-section">
            <img src="/ConservatorioNacional.png" alt="Logo Conservatorio Nacional de Música" className="login-logo" />
            <h2 className="login-title">SISTEMA DE GESTIÓN ESTUDIANTIL</h2>
          </div>

          {/* Formulario */}
          <div className="login-form-section">
            <div className="login-form-container">
              <h3 className="login-form-title">Iniciar Sesión</h3>
              <form onSubmit={handleLogin}>
                <div className="login-field">
                  <label htmlFor="email">Usuario</label>
                  
                   <Input
                    fondo="Cédula"
                    tipo="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required={true}
                    />
                </div>
                <div className="login-field">
                  <label htmlFor="password">Contraseña</label>
                  <Input
                    fondo=""
                    tipo="password"
                    value={password}
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="login-button">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
