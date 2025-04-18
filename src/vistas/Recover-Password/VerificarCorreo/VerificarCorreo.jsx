import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerificarCorreo() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

  const OnCancel=()=>{
    navigate("/")
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    setMsg("");
    setError("");
    axios.post(`${API_URL}/verificar_email`,{email: email})
    .then(response=>{
      setMsg(response.data.message);
      setEmail("");
      setTimeout(() => {
        console.log("Redirigiendo...");
        window.location.href = "/";
      }, 2500);
    })
    .catch(error=>{
      setError(error.response.data.message)
    })
  }
  return (
    <div className="change-password-container">
      <h2 className="title">Verifique su identidad</h2>

      {msg && <p className="success-message">{msg}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="login-field">
          <label>Ingrese su correo electrónico:</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btns primary">Enviar</button>
          <button type="button" className="btns secondary" onClick={OnCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default VerificarCorreo