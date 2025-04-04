import React, { useState } from 'react'
import axios from "axios";
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import { useNavigate } from 'react-router-dom';
import Input from '../../../../components/Input';
import "./ChangePassword.css";


function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate()
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/password`,
        {
          currentPassword,
          newPassword,
          type: "Representante",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMsg(response.data.message);
      console.log("este es el response",response)
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.log("este es el error",err.response.data);
      setError(err.response.data.message)
      
    }
  };
  const OnCancel = () => {
    navigate("/representante")
  }

  return (
    <div className="change-password-container">
      <h2 className="title">Cambiar Contraseña</h2>

      {msg && <p className="success-message">{msg}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
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

        <div className="button-group">
          <button type="submit" className="btn primary">Cambiar</button>
          <button type="button" className="btn secondary" onClick={OnCancel}>Cancelar</button>
        </div>
      </form>
    </div>

  )
}

export default ChangePassword