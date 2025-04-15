import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import "./ChangePassword.css";


function ChangePassword({redireccion}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token=localStorage.getItem("token")

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
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <ul className="password-rules">
            <li>🔒 Mínimo 8 caracteres</li>
            <li>🔠 Al menos una letra mayúscula</li>
            <li>🔢 Al menos un número</li>
            <li>🔣 Al menos un carácter especial (ej. !, @, #, $)</li>
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