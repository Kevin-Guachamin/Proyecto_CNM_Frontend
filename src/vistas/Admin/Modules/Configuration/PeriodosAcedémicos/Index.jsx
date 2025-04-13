import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from '../../../../../layout/Layout'
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { modulesSettings } from "../../../Components/Modulos"
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import CrearPeriodo from "./CrearPeriodo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paginación from "../../../Components/Paginación";

function Index() {

  const [loading, setLoading] = useState(true); // Estado para mostrar la carga
  const [usuario, setUsuario] = useState(null);
  const [periodos, setPeriodos] = useState([])
  const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
   const [limit, setLimit] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token=localStorage.getItem("token")
  const headers = ["Descripción", "Fecha inicio", "Fecha fin", "Estado", "Acciones"];
  const colums = ["descripcion", "fecha_inicio", "fecha_fin", "estado"]
  const filterKey = "descripcion"
  const PK = "ID"

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
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    console.log("este es el usuario", parsedUser)
    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/")
    }
    

    // Mientras no se conecte al backend, dejamos un usuario de prueba
    setUsuario(parsedUser);

  }, [API_URL, navigate]);
  useEffect(() => {
    if (!limit) return; // ⚠️ Esperar a que el limit se actualice

    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
        console.log("este es el limite",limit)
        const { data } = await axios.get(`${API_URL}/periodo_academico/obtener?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPeriodos(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        ErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaturas();
  }, [page, limit, API_URL, token]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulesSettings}>
        {loading ? <Loading /> : <Contenedor data={periodos} setData={setPeriodos} headers={headers} columnsToShow={colums} filterKey={filterKey} apiEndpoint={"periodo_academico"} CrearEntidad={CrearPeriodo} PK={PK}  Paginación={
              <Paginación totalPages={totalPages} page={page} setPage={setPage} />
            }/>}

      </Layout>
    </div>
  )
}

export default Index