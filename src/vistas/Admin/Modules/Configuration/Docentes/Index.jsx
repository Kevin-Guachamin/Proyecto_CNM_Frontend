import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { modulesSettings } from "../../../Components/Modulos"
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import CrearDocente from "./CrearDocente";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paginación from "../../../Components/Paginación";

function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [docentes, setDocentes] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token=localStorage.getItem("token")

  const headers = ["Cédula", "Primer nombre", "Primer Apellido", "Segundo Nombre", "Segundo Apellido", "Email", "Celular", "Rol", "Acciones"];
  const colums = ["nroCedula", "primer_nombre", "primer_apellido", "segundo_nombre", "segundo_apellido", "email", "celular", "rol"]
  const filterKey = "primer_nombre"
  const PK = "nroCedula"
  const navigate = useNavigate()

  // ✅ Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Establecer límite de resultados según resolución
  useEffect(() => {

    const isLaptop = width <= 1822;
    setLimit(isLaptop ? 13 : 21);
  }, [width]);
  useEffect(() => {
    if (!limit) return; // ⚠️ Esperar a que el limit se actualice

    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
       
        const { data } = await axios.get(`${API_URL}/docente/obtener?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocentes(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaturas();
  }, [page, limit, API_URL, token]);
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/")
    }
    setUsuario(parsedUser);
  }, [API_URL, navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> : <Contenedor data={docentes} setData={setDocentes} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"docente"} CrearEntidad={CrearDocente} PK={PK} Paginación={
              <Paginación totalPages={totalPages} page={page} setPage={setPage} />
            }/>}

      </Layout>
    </div>
  )
}

export default Index