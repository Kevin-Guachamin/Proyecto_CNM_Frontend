import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importamos los íconos de ojo
import './Input.css';

export default function Input({ fondo, tipo, value, onChange, estado, name, required}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para mostrar/ocultar la contraseña

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Alternar la visibilidad
  };

  return (
    <div className="input-container">
      <input
        type={tipo === 'password' && isPasswordVisible ? 'text' : tipo} // Cambiar tipo de input según el estado
        name={name}
        placeholder={fondo}
        className="inputs"
        value={value} // Vinculamos el valor del input
        onChange={onChange} // Controlamos el cambio de valor
        readOnly={estado === 'readonly'} // Agregar atributo readOnly condicionalmente
        required={required}
      />
      {tipo === 'password' && (
        <span className="eye-icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
          {isPasswordVisible ? <FiEyeOff /> : <FiEye />} {/* Mostrar ícono según el estado */}
        </span>
      )}
    </div>
  );
}