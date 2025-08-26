import React from 'react';
import "../../Admin/Styles/Filtro.css";

function FiltroVicerrector({ search, filterKey, filtrar, disabled = false, placeholder }) {
  return (
    <div className="form-group filtro-input" style={{ width: '100%' }}>
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
  );
}

export default FiltroVicerrector;
