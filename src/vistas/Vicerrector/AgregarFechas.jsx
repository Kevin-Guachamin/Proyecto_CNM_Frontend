import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import axios from "axios";
import { ErrorMessage } from "../../Utils/ErrorMesaje";
import CrearFechas from "./CrearFechas";
import Filtro from "../Admin/Components/Filtro";
import Tabla from "../Admin/Components/Tabla";
import Swal from "sweetalert2";
import { getModulos, transformModulesForLayout } from "../getModulos";
import { Eliminar } from '../../Utils/CRUD/Eliminar';

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
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      const modulosBase = getModulos(parsedUser.subRol, true);
      setModules(transformModulesForLayout(modulosBase));
      fetchFechas();
    } else {
      navigate("/");
    }
  }, [navigate]);
  

  const parseFecha = (strFecha) => {
    if (!strFecha) return "";
    // Suponiendo que strFecha viene como "YYYY-MM-DD"
    const [year, month, day] = strFecha.split("-");
    return `${day}/${month}/${year}`;
  };  

  const fetchFechas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/obtener_todo`
      );
      // Transformar los datos para que las fechas se muestren en formato DD/MM/YYYY
      const transformedData = response.data.map(item => ({
        ...item,
        fecha_inicio: parseFecha(item.fecha_inicio),
        fecha_fin: parseFecha(item.fecha_fin)
      }));
      setFechas(transformedData);
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

  // En este caso, usamos "ID" como la clave primaria (PK)
  const PK = "ID";
  const URL = `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_notas/eliminar`;

  const handleDeleteFecha = (fecha) => {
    Eliminar(fecha, URL, fecha.descripcion, setFechas, PK);
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

  const filteredFechas = fechas.filter(fecha =>
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