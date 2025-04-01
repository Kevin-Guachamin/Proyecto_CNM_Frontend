import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import CrearFechas from "./CrearFechas";
import Filtro from "../Admin/components/Filtro";
import Tabla from "../Admin/components/Tabla";
import Swal from "sweetalert2";
import { getModulos, transformModulesForLayout } from "../getModulos";

function AgregarFechas() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);

  // Modal de creación/edición
  const [showModal, setShowModal] = useState(false);
  const [fechaToUpdate, setFechaToUpdate] = useState(null);

  // Filtro de búsqueda
  const [search, setSearch] = useState("");
  const filterKey = "Descripción";

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      const modulosBase = getModulos(parsedUser.subRol, true);
      setModules(transformModulesForLayout(modulosBase));
      fetchFechas();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const normalizarFechas = (fechas) => {
    return fechas.map((f) => ({
      ...f,
      fecha_inicio: convertirAISO(f.fecha_inicio),
      fecha_fin: convertirAISO(f.fecha_fin),
    }));
  };

  const convertirAISO = (fechaStr) => {
    if (!fechaStr.includes("/")) return fechaStr; // Ya está en ISO
    const [dia, mes, anio] = fechaStr.split("/");
    return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const fetchFechas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/obtener`
      );
      const fechasNormalizadas = normalizarFechas(response.data);
      console.log("✅ Datos normalizados:", fechasNormalizadas);
      setFechas([...fechasNormalizadas]);
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFecha = () => {
    setFechaToUpdate(null);
    setShowModal(true);
  };

  const handleEditFecha = (fecha) => {
    setFechaToUpdate(fecha);
    setShowModal(true);
  };

  const handleDeleteFecha = async (ID) => {
    Swal.fire({
      title: "¿Está seguro de eliminar esta fecha?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axios.delete(
            `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/eliminar/${ID}`
          );
          await fetchFechas();
          Swal.fire("Eliminado", "La fecha ha sido eliminada.", "success");
        } catch (error) {
          ErrorMessage(error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSaveFecha = async (data) => {
    try {
      setLoading(true);

      if (fechaToUpdate) {
        await axios.put(
          `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/editar/${fechaToUpdate.ID}`,
          data
        );
        Swal.fire("Actualizado", "La fecha fue actualizada correctamente", "success");
      } else {
        await axios.post(
          `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/crear`,
          data
        );
        Swal.fire("Creado", "La fecha fue creada correctamente", "success");
      }

      await fetchFechas();
      setSearch(""); // resetear búsqueda
      setFechaToUpdate(null);
      setShowModal(false);

    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setFechaToUpdate(null);
    setShowModal(false);
  };

  const filteredFechas = [...fechas].filter((fecha) =>
    fecha.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules}>
        <div className="content-container">
          <h2 className="mb-4">Administrar Fechas de Notas</h2>
          <Filtro
            search={search}
            setSearch={setSearch}
            toggleModal={handleAddFecha}
            filterKey={filterKey}
          />
          <Tabla
            key={fechas.length} // Forzar re-render
            filteredData={filteredFechas}
            OnEdit={handleEditFecha}
            OnDelete={handleDeleteFecha}
            headers={["Descripción", "Fecha Inicio", "Fecha Fin", "Acciones"]}
            columnsToShow={["descripcion", "fecha_inicio", "fecha_fin"]}
          />
        </div>
      </Layout>

      {showModal && (
        <CrearFechas
          onCancel={handleCancelModal}
          entityToUpdate={fechaToUpdate}
          onSave={handleSaveFecha}
        />
      )}
    </>
  );
}

export default AgregarFechas;
