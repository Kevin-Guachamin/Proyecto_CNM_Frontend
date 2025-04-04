import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import "./Login.css";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../Utils/ErrorMesaje";

function Login() {
  const navigate = useNavigate();
  const [nroCedula, setnroCedula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el loading justo después de enviar el formulario
    try {
      // Realizar la solicitud POST usando cédula y contraseña (enviado como "contraseña")
      const response = await axios.post(`${import.meta.env.VITE_URL_DEL_BACKEND}/login`, {
        nroCedula,
        password,
      });
      console.log("esto me respondio el login",response)

      const { token, ...user } = response.data;
      localStorage.setItem("usuario", JSON.stringify(user));
      localStorage.setItem("token", token);
      // Redirección basada en el rol del usuario:
      if (user.rol === "representante") {
        navigate("/representante");
      } else if (user.subRol === "Profesor") {
        // Por el momento, para todos los rols de docentes se redirige a "/inicio"
        // Luego se puede afinar la lógica según rols específicos
        navigate("/inicio");
      } 
      else if(user.subRol==="Administrador"){
        navigate("/admin")
      }
      else if(user.subRol==="Vicerrector"){
        navigate("/inicio")
      }
      else if(user.subRol==="Secretaria"){
        navigate("/inicio")
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Acceso no permitido",
          text: "No tienes permiso para acceder a esta sección",
          confirmButtonText: "Cerrar",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "Cédula o contraseña incorrectos",
          confirmButtonText: "Intentar de nuevo",
        });
      } else {
        ErrorMessage(error);
      }
    }
  };

  // Función para manejar la entrada y permitir solo números, limitando a 10 caracteres.
  const handlenroCedulaChange = (e) => {
    // Remover caracteres no numéricos
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    // Permitir solo hasta 10 dígitos
    if (onlyNumbers.length <= 10) {
      setnroCedula(onlyNumbers);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-content">
          {/* Logo e información */}
          <div className="login-logo-section">
            <img
              src="/ConservatorioNacional.png"
              alt="Logo Conservatorio Nacional de Música"
              className="login-logo"
            />
            <h2 className="login-title">SISTEMA DE GESTIÓN ESTUDIANTIL</h2>
          </div>

          {/* Formulario */}
          <div className="login-form-section">
            <div className="login-form-container">
              <h3 className="login-form-title">Iniciar Sesión</h3>
              <form onSubmit={handleLogin}>
                <div className="login-field">
                  <label htmlFor="nroCedula">Cédula</label>
                  <Input
                    fondo="Cédula"
                    tipo="text"
                    value={nroCedula}
                    onChange={handlenroCedulaChange}
                    required={true}
                    maxLength={10} // Se asegura que el input no supere los 10 dígitos
                  />
                  {nroCedula.length < 10 && (
                    <small className="input-help-text">Máximo 10 números</small>
                  )}
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
                <button type="submit" className="login-button">
                  Ingresar
                </button>
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
