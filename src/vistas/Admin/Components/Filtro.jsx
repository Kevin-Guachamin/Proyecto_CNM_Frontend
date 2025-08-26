import React from 'react';
import BotonAdd from '../../../components/BotonAdd'
import "../Styles/Filtro.css"


function Filtro({ 
  search, 
  toggleModal, 
  filterKey, 
  filtrar, 
  disabled = false, 
  placeholder,
  addButtonText,
  addButtonDisabled = false
}) {





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
        <BotonAdd 
          onClick={addButtonDisabled ? null : toggleModal} 
          disabled={addButtonDisabled}
          title={addButtonText}
        />
        {addButtonDisabled && addButtonText && (
          <div className="info-message">
            {addButtonText}
          </div>
        )}
      </div>
    </div>
  );
}
export default Filtro