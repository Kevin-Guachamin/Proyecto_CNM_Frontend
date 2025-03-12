import React from 'react'
import BotonAdd from '../../../components/BotonAdd'
import "../Styles/Filtro.css"


function Filtro({search, setSearch, toggleModal,filterKey}) {
  return (
    <div className="filter-container">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder={`Filtrar por ${filterKey}`}
        />
        <BotonAdd  onClick={()=>toggleModal()} />
      </div>
  )
}

export default Filtro