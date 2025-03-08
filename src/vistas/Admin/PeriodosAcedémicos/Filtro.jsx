import React from 'react'
import BotonAdd from '../../../components/BotonAdd'
import "./Filtro.css"


function Filtro({search, setSearch, toggleModal}) {
  return (
    <div className="filter-container">
        <input
          fondo="periodo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder='Filtrar por descripción'
        />
        <BotonAdd  onClick={()=>toggleModal()} />
      </div>
  )
}

export default Filtro