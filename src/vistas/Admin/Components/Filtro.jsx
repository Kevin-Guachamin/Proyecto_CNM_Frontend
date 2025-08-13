import React from 'react';
import BotonAdd from '../../../components/BotonAdd'
import "../Styles/Filtro.css"


function Filtro({search, toggleModal, filterKey,filtrar }) {
  

  
  

  return (
    <div className="form-group">
      <input
        
        value={search}
        onChange={(e) => {
          console.log("este fue el evento",e)
          filtrar(e)}}
        className="search-input"
        placeholder={`Filtrar por ${filterKey}`}
      />
      <BotonAdd onClick={toggleModal} />
    </div>
  );
}
export default Filtro