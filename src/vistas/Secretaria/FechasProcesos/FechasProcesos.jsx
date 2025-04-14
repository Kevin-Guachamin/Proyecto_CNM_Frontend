import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Loading from "../../../components/Loading";
import axios from "axios";
import { ErrorMessage } from "../../../Utils/ErrorMesaje";
import CrearProceso from "./CrearProceso";
import Filtro from "../../Admin/Components/Filtro";
import Tabla from "../../Admin/Components/Tabla";
import Swal from "sweetalert2";
import { getModulos, transformModulesForLayout } from "../../getModulos";
import { Eliminar } from "../../../Utils/CRUD/Eliminar";

function FechasProcesos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [procesoToUpdate, setProcesoToUpdate] = useState(null);
  const [search, setSearch] = useState("");
  const filterKey = "proceso";

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      setModules(transformModulesForLayout(getModulos(parsedUser.subRol, true)));
      fetchProcesos();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const parseFecha = (strFecha) => {
    if (!strFecha) return "";
    const [year, month, day] = strFecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchProcesos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/obtener_todo`);
      const transformedData = response.data.map(item => ({
        ...item,
        fecha_inicio: parseFecha(item.fecha_inicio),
        fecha_fin: parseFecha(item.fecha_fin)
      }));
      setProcesos(transformedData);
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProceso = () => {
    setProcesoToUpdate(null);
    setShowModal(true);
  };

  const handleEditProceso = (proceso) => {
    setProcesoToUpdate(proceso);
    setShowModal(true);
  };

  const handleDeleteProceso = (proceso) => {
    const URL = `${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/eliminar/${proceso.ID}`;
    Eliminar(proceso, URL, proceso.proceso, setProcesos, "ID");
  };

  const handleSaveProceso = async (data) => {
    try {
      setLoading(true);
      if (procesoToUpdate) {
        await axios.put(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/editar/${procesoToUpdate.ID}`, data);
        Swal.fire("Actualizado", "El proceso fue actualizado correctamente", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_URL_DEL_BACKEND}/fechas_procesos/crear`, data);
        Swal.fire("Creado", "El proceso fue creado correctamente", "success");
      }
      await fetchProcesos();
      setProcesoToUpdate(null);
      setShowModal(false);
      setSearch("");
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setProcesoToUpdate(null);
    setShowModal(false);
  };

  const filteredProcesos = procesos.filter(p =>
    p.proceso?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <>
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modules}>
        <div className="content-container">
          <h2 className="mb-4">Administrar Fechas de Procesos</h2>
          <Filtro
            search={search}
            setSearch={setSearch}
            toggleModal={handleAddProceso}
            filterKey={filterKey}
          />
          <Tabla
            key={procesos.length}
            filteredData={filteredProcesos}
            OnEdit={handleEditProceso}
            OnDelete={handleDeleteProceso}
            headers={["Proceso", "Fecha Inicio", "Fecha Fin", "Acciones"]}
            columnsToShow={["proceso", "fecha_inicio", "fecha_fin"]}
          />
        </div>
      </Layout>

      {showModal && (
        <CrearProceso
          onCancel={handleCancelModal}
          entityToUpdate={procesoToUpdate}
          onSave={handleSaveProceso}
        />
      )}
    </>
  );
}

export default FechasProcesos;