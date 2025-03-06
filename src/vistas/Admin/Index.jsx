import React from 'react'
import Layout from '../../layout/containers/Layout'
import { Home, Users, Settings, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";

function Index() {
  const modules = [
    { name: "Inicio", icon: <Home size={20} /> },
    { name: "Usuarios", icon: <Users size={20} /> },
    { name: "Configuración", icon: <Settings size={20} /> },
  ];
  return (
    <div>
      <Layout modules={modules}>

      </Layout>
    </div>
  )
}

export default Index