import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import Layout from "../../../../../layout/Layout";
import Loading from "../../../../../components/Loading";
import Contenedor from "../../../Components/Contenedor";
import { moduloInicio, modulesSettingsBase, construirModulosConPrefijo } from "../../../Components/Modulos";
import CrearAsignatura from "./CrearAsignatura";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage } from "../../../../../Utils/ErrorMesaje";
import Paginación from "../../../Components/Paginación";

function Index() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const [modulos, setModulos] = useState([]);
  
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token");

  const headers = ["ID", "Nivel", "Nombre","Tipo", "Edad mínima", "Acciones"];
  const colums = ["ID", "nivel", "nombre","tipo", "edadMin"];
  const filterKey = "nombre";
  const PK = "ID";

  // ✅ Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Establecer límite de resultados según resolución
  useEffect(() => {

    const isLaptop = width <= 1822;
    setLimit(isLaptop ? 15 : 21);
  }, [width]);

  // ✅ Verificar usuario autenticado
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser || parsedUser.subRol !== "Administrador") {
      navigate("/");
    } else {
      setUsuario(parsedUser);
      const modulosDinamicos = [
        moduloInicio,
        ...construirModulosConPrefijo(parsedUser.subRol, modulesSettingsBase)
      ];
      setModulos(modulosDinamicos);
    }
  }, [navigate]);

  // ✅ Obtener asignaturas
  useEffect(() => {
    if (!limit) return; // ⚠️ Esperar a que limit se actualice
  
    const delayDebounceFn = setTimeout(() => {
      const fetchAsignaturas = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `${API_URL}/materia/obtener?page=${page}&limit=${limit}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setAsignaturas(data.data);
          setTotalPages(data.totalPages);
        } catch (error) {
          ErrorMessage(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAsignaturas();
    }, 350); // ⏳ Espera 500ms después de dejar de escribir para llamar
  
    return () => clearTimeout(delayDebounceFn); 
    // ✅ Limpia el timeout si el usuario sigue escribiendo antes de los 500ms
  }, [page, limit]);
  

  return (
    <div className="section-container">
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modulos}>
        {loading ? (
          <Loading />
        ) : (
          <Contenedor
            data={asignaturas}
            setData={setAsignaturas}
            headers={headers}
            columnsToShow={colums}
            filterKey={filterKey}
            apiEndpoint="materia"
            CrearEntidad={CrearAsignatura}
            PK={PK}
            Paginación={
              <Paginación totalPages={totalPages} page={page} setPage={setPage} />
            }
            page={page}
            limit={limit}
            setTotalPages={setTotalPages}
            
          />
        )}
      </Layout>
    </div>
  );
}

export default Index;
