import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const navigate = useNavigate()
  useEffect(() => {
    // Obtener el token desde la URL
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromURL = queryParams.get('token');
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      setError('No se encontró el token en la URL');
    }
  }, []);

  // Manejo del cambio de la contraseña
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !password) {
      setError('Por favor, ingresa todos los campos');
      return;
    }

    try {
      await axios.post(`${API_URL}/reset_password`, {
        token: token,
        newPassword: password,
      });

      setSuccess(true);
      setError('');
      setTimeout(() => {
        console.log("Redirigiendo...");
        window.location.href = "/";
      }, 2500);

    } catch (err) {
      console.log("este fue el error", err)
      setSuccess(false)
      setError(

        err.response?.data?.message || 'Hubo un error al restablecer la contraseña'
      );
    }
  };

  const OnCancel = () => {
    navigate("/")
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
      <h2 className='title'>Restablece tu contraseña</h2>
      {success ? (
        <p className='success-message'>¡Tu contraseña ha sido actualizada correctamente!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className='error-message'>{error}</p>}
          <div className="login-field">
            <label>Nueva contraseña:</label>
            <Input
              fondo=""
              tipo="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
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
  );
}

export default ResetPassword