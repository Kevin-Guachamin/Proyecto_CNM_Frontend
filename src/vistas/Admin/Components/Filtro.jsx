import React from 'react';
import BotonAdd from '../../../components/BotonAdd'
import "../Styles/Filtro.css"


function Filtro({ search, toggleModal, filterKey, filtrar, disabled = false, placeholder }) {





  return (
    <div className="filtro-container">
      <div className="form-group filtro-input">
        <input
          value={search}
          onChange={(e) => {
            if (disabled) return;
            filtrar(e);
          }}
          className="search-input"
          placeholder={placeholder ?? (disabled ? `Seleccione un grupo para filtrar` : `Filtrar por ${filterKey}`)}
          disabled={disabled}
        />
      </div>
      <div className="form-group filtro-button">
        <BotonAdd onClick={toggleModal} />
      </div>
    </div>
  );
}
export default Filtro