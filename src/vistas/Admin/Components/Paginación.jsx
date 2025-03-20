import React from "react";
import ReactPaginate from "react-paginate";
import "../Styles/Paginacion.css"

function Paginación({ totalPages, page, setPage }) {
  const handlePageClick = (data) => {
    setPage(data.selected + 1); // ReactPaginate usa índice basado en 0
  };

  return (
    <div>
      <ReactPaginate
        previousLabel={"← Anterior"}
        nextLabel={"Siguiente →"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={1} // Cantidad de páginas visibles en los extremos
        pageRangeDisplayed={3} // Cantidad de páginas visibles en el centro
        onPageChange={handlePageClick}
        containerClassName={"pagination"} // Clase para estilizar
        activeClassName={"selected"} // Clase para la página activa
        forcePage={page - 1} // Para sincronizar con el estado
      />
    </div>
  );
}

export default Paginación;