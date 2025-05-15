import React from 'react';
import './Boton.css';

const Boton = ({ texto, onClick, disabled, estilo, type }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={estilo} type={type}>
      {texto}
    </button>
  );
};

export default Boton;
