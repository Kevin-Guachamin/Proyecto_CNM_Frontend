import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import "./ChangePassword.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

function ChangePassword({ redireccion }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${API_URL}/change_password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }

      );
      setSuccess(true)
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        console.log("Redirigiendo...");
        window.location.href = redireccion;
      }, 2000);

    } catch (err) {
      console.log("este es el error", err);
      setError(err.response.data.message)
      setSuccess(false)

    }
  };

  const OnCancel = () => {
    navigate(`${redireccion}`)
  }

  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    setRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  return (
    <div className="change-password-container">
      <h2 className="title">Cambiar Contraseña</h2>

      {success ? (
        <p className='success-message'>¡Tu contraseña ha sido actualizada correctamente!</p>
      ) : (

        <form onSubmit={handleSubmit} className="form">
          {error && <p className="error-message">{error}</p>}
          <div className="login-field">
            <label>Contraseña actual:</label>
            <Input
              fondo=""
              tipo="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Nueva contraseña:</label>
            <Input
              fondo=""
              tipo="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
          </div>
          <ul className="password-rules">
            <li className={rules.length ? "rule-pass" : "rule-fail"}>
              <i className={`bi ${rules.length ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
              <span> 🔒 Mínimo 8 caracteres</span>
            </li>
            <li className={rules.uppercase ? "rule-pass" : "rule-fail"}>
              <i className={`bi ${rules.uppercase ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
              <span> 🔠 Al menos una letra mayúscula</span>
            </li>
            <li className={rules.number ? "rule-pass" : "rule-fail"}>
              <i className={`bi ${rules.number ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
              <span> 🔢 Al menos un número</span>
            </li>
            <li className={rules.special ? "rule-pass" : "rule-fail"}>
              <i className={`bi ${rules.special ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
              <span> 🔣 Al menos un carácter especial (ej. !, @, #, $)</span>
            </li>
          </ul>
          <div className="button-group">
            <button type="submit" className="btns primary">Cambiar</button>
            <button type="button" className="btns secondary" onClick={OnCancel}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ChangePassword