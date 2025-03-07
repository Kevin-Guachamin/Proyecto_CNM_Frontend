import React from 'react'
import BotonAdd from '../../../components/BotonAdd'
import Input from '../../../components/Input'
import './Estilos.css'

function Filtro({search, setSearch, toggleModal}) {
  return (
    <div className="filter-container">
        <Input
          fondo="periodo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <BotonAdd  onClick={()=>toggleModal()} />
      </div>
  )
}

export default Filtro