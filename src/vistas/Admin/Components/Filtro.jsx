import React from 'react';
import BotonAdd from '../../../components/BotonAdd'
import "../Styles/Filtro.css"


function Filtro({ search, toggleModal, filterKey, filtrar }) {





  return (
    <div className="filtro-container">
      <div className="form-group filtro-input">
        <input
          value={search}
          onChange={(e) => {
            console.log("este fue el evento", e)
            filtrar(e)
          }}
          className="search-input"
          placeholder={`Filtrar por ${filterKey}`}
        />
      </div>
      <div className="form-group filtro-button">
        <BotonAdd onClick={toggleModal} />
      </div>
    </div>
  );
}
export default Filtro