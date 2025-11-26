import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import "./Login.css";
import Swal from "sweetalert2";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import { Facebook, Instagram } from "@mui/icons-material"; // iconos para el footer local

function Login() {
  const navigate = useNavigate();
  const [nroCedula, setnroCedula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (nroCedula.length < 10) {
      Swal.fire({
        icon: "error",
        title: "Cédula incompleta",
        text: "La cédula debe tener 10 dígitos",
        confirmButtonText: "Cerrar",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_DEL_BACKEND}/login`,
        { nroCedula, password }
      );
      const { token, ...user } = response.data;
      localStorage.setItem("usuario", JSON.stringify(user));
      localStorage.setItem("token", token);
      setLoading(false);

      if (user.rol === "representante") navigate("/representante");
      else if (["Profesor", "Administrador", "Vicerrector", "Secretaria"].includes(user.subRol))
        navigate("/inicio");
      else {
        Swal.fire({
          icon: "error",
          title: "Acceso no permitido",
          text: "No tienes permiso para acceder a esta sección",
          confirmButtonText: "Cerrar",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("este es el error de inicio de sesion")
      ErrorMessage(error);
    }
  };

  const handlenroCedulaChange = (e) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    if (onlyNumbers.length <= 10) setnroCedula(onlyNumbers);
  };

  if (loading) return <Loading />;

  return (
    <div className="page page-login">
      <Header />

      {/* MAIN que crece y empuja al footer */}
      <main className="login-main">
        <div className="login-content">
          <section className="login-logo-section">
            <img
              src="/ConservatorioNacional.png"
              alt="Logo Conservatorio Nacional de Música"
              className="login-logo"
            />
            <h2 className="login-title">SISTEMA DE GESTIÓN ESTUDIANTIL</h2>
          </section>

          <section className="login-form-section">
            <div className="login-form-container">
              <h3 className="login-form-title">Iniciar Sesión</h3>
              <form onSubmit={handleLogin}>
                <div className="login-field">
                  <label htmlFor="nroCedula">Cédula o Pasaporte</label>
                  <Input
                    fondo="Cédula"
                    tipo="text"
                    value={nroCedula}
                    onChange={handlenroCedulaChange}
                    maxLength={10}
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="login-button">Ingresar</button>
              </form>

              <div className="links">
                <Link to="/request-recover-password">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER LOCAL (mismo contenido) */}
      <footer className="footer-login">
        <div className="footer-login__title">
          Conservatorio Nacional de Música © Todos los Derechos Reservados.
        </div>

        <div className="footer-login__info">
          <div className="footer-login__item">
            📍 Dirección: Cochapata E12 56 y Manuel de Abascal (El Batán) Quito - Ecuador
          </div>
          <div className="footer-login__item">📞 Teléfono: 248 666 ext. 117</div>
          <div className="footer-login__item">⏰ Horario: 08:00 - 20:00</div>
        </div>

        <div className="footer-login__social">
          <a
            href="https://www.facebook.com/conservatorioquito/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-login__icon"
            aria-label="Facebook"
          >
            <Facebook style={{ fontSize: 36 }} />
          </a>
          <a
            href="https://www.instagram.com/conamusi_oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-login__icon"
            aria-label="Instagram"
          >
            <Instagram style={{ fontSize: 36 }} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
