import React from "react";
import ReactPaginate from "react-paginate";
import "../Styles/Paginacion.css"

function Paginación({ totalPages, page, setPage }) {
  const handlePageClick = (data) => {
    setPage(data.selected + 1); // ReactPaginate usa índice basado en 0
  };

  return (
    <div className="paginacion-contenedor">
      <ReactPaginate
        previousLabel={"← Anterior"}
        nextLabel={"Siguiente →"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"selected"}
        forcePage={page - 1}
      />
    </div>
  );
}

export default Paginación;