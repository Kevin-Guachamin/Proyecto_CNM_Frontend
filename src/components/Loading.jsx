import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loading.css'; // Si tienes estilos específicos

const Loading = () => {
  return (
    <div className="loading-container">
      <ClipLoader color="#00008B" size={100} />
    </div>
  );
};

export default Loading;