import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Tabla from '../Representante/components/Tabla_Representante';
import Header from "../../components/Header";
import Modulo from "../../components/Modulo";
import Layout from "../../layout/Layout"; // antes "../../layout/components/Layout"
import Loading from "../../components/Loading";
import { RiLockPasswordFill } from "react-icons/ri";
import Swal from 'sweetalert2';

const Index = () => {
  const  navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modulos] = useState([
    { id: 1, titulo: "Información representante", icono: "📄", link: "/representante/perfil" },
    { id: 2, titulo: "Información estudiantil", icono: "✏️", link: "/representante/estudiantes" },
    { id: 3, titulo: "Matriculación", icono: "📝",  link: "/representante/inscripcion"},
    { id: 4, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/representante/password"}
  ]);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
    // Limpiar cualquier estado de error al cargar el componente
    setError(false);
    setLoading(false);
  }, []);
  
  const handleModuloClick = (modulo) => {
    setLoading(true);
    setError(false);
    
    // Timeout para detectar si la carga tarda demasiado
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError(true);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo cargar el módulo. Por favor, verifica tu conexión a internet e intenta nuevamente.',
        confirmButtonColor: '#003F89',
        confirmButtonText: 'Entendido'
      });
    }, 1000); // 10 segundos de timeout
    
    // Simular carga antes de navegar (en una app real, aquí irían las llamadas API)
    const navigationTimeout = setTimeout(() => {
      clearTimeout(timeoutId); // Cancelar el timeout de error
      setLoading(false);
      
      // Verificar que el usuario aún existe antes de navegar
      if (usuario && usuario.nroCedula) {
        navigate(modulo.link, {
          state: { nroCedula: usuario.nroCedula}
        });
      } else {
        setError(true);
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          confirmButtonColor: '#003F89',
          confirmButtonText: 'Ir al login'
        }).then(() => {
          navigate('/login');
        });
      }
    }, 500); // Tiempo normal de carga (1.5 segundos)
    
    // Limpiar timeouts si el componente se desmonta
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(navigationTimeout);
    };
  };

  return(
    <div>
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Layout showSidebar={false}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '60vh',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
            <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>Error de conexión</h3>
            <p style={{ color: '#6c757d', marginBottom: '20px' }}>
              No se pudo cargar el contenido. Verifica tu conexión a internet.
            </p>
            <button 
              onClick={() => {
                setError(false);
                window.location.reload();
              }}
              style={{
                backgroundColor: '#003F89',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Intentar nuevamente
            </button>
          </div>
        </Layout>
      ) : (
        <Layout showSidebar={false}> 
          <Modulo modulos={modulos} onModuloClick={handleModuloClick} />
        </Layout>
      )}
    </div> 
  );
};

export default Index;
