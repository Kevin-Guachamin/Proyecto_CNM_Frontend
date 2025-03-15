import React from 'react'

function Paginación({totalPages,page,setPage}) {
  return (
    <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Siguiente
        </button>
    </div>
    
  )
}

export default Paginación