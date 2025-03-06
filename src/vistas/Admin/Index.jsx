import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Layout from '../../layout/containers/Layout'
import { Users, Clipboard, GraduationCap, Book, UserRoundPen} from "lucide-react";
import { FaBuilding } from 'react-icons/fa';

function Index() {
  const modules = [
    { name: "Periodos académicos", icon: <GraduationCap size={20} /> },
    { name: "Asignaturas", icon: <Book size={20} /> },
    { name: "Cursos", icon: <FaBuilding size={20} /> },
    { name: "Docentes", icon: <UserRoundPen size={20}/>},
    { name: "Estdudiantes", icon: <Users size={20} /> },
    { name: "Califiaciones", icon:<Clipboard size={20}/> }
    
  ];

  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
      // Aquí se realizará la petición al backend cuando esté disponible
      // axios.get("URL_DEL_BACKEND/usuarioConectado", { headers: { Authorization: `Bearer ${TOKEN}` } })
      //   .then(response => {
      //     setUsuario(response.data); // Guardar la información del usuario en el estado
      //   })
      //   .catch(error => {
      //     console.error("Error al obtener los datos del usuario:", error);
      //   });
  
      // Mientras no se conecte al backend, dejamos un usuario de prueba
      setUsuario({ nombre: "Juan Pérez", rol: "Estudiante" });
    }, []);
  
  return (
    <div>
       {/* Encabezado */}
       <div className="container-fluid p-0">
          {usuario && <Header isAuthenticated={true} usuario={usuario} />}
        </div>
      <Layout modules={modules}>

      </Layout>
    </div>
  )
}

export default Index