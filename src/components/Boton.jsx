import React from 'react';
import './Boton.css';

const Boton = ({ texto, onClick, estilo, type }) => {
  return (
    <button onClick={onClick} className={estilo} type={type}>
      {texto}
    </button>
  );
};

export default Boton;