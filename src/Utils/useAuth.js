import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const useAuth = (requiredRole = null) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    // Solo verificar y actuar si realmente faltan token o usuario
    if (!token || !usuario) {
      setIsAuthenticated(false);
      setIsChecking(false);

      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // Redirigir y mostrar mensaje
      navigate('/', { replace: true });

      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Token inválido o expirado',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#003F89',
          timer: 3000,
          timerProgressBar: true
        });
      }, 100);
      return;
    }

    // Verificar rol solo si se especifica y hay un requiredRole
    if (requiredRole) {
      try {
        const parsedUser = JSON.parse(usuario);

        // Verificar tanto 'rol' como 'subRol' para compatibilidad
        const userRole = parsedUser.subRol || parsedUser.rol;

        if (Array.isArray(requiredRole)) {
          // Si es array, validar con includes
          if (!requiredRole.includes(userRole)) {
            setIsAuthenticated(false);
            setIsChecking(false);

            navigate('/', { replace: true });

            setTimeout(() => {
              Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'No tienes permisos para acceder a esta página',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#003F89',
                timer: 3000,
                timerProgressBar: true
              });
            }, 100);
            return;
          }
        } else {
          // Si es string, comparar directamente
          if (userRole !== requiredRole) {
            setIsAuthenticated(false);
            setIsChecking(false);

            navigate('/', { replace: true });

            setTimeout(() => {
              Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'No tienes permisos para acceder a esta página',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#003F89',
                timer: 3000,
                timerProgressBar: true
              });
            }, 100);
            return;
          }
        }
      } catch (error) {
        // Solo actuar si hay un error real en el parsing
        console.error('Error parsing user:', error);
        setIsAuthenticated(false);
        setIsChecking(false);

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/', { replace: true });

        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Token inválido o expirado',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#003F89',
            timer: 3000,
            timerProgressBar: true
          });
        }, 100);
        return;
      }
    }

    // Si llegamos aquí, todo está bien - mantener autenticado
    setIsAuthenticated(true);
    setIsChecking(false);
  }, []); // Remover navigate y requiredRole de las dependencias para evitar re-renders

  return {
    isAuthenticated,
    isChecking,
    token: localStorage.getItem('token'),
    usuario: (() => {
      try {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
      } catch (e) {
        return null;
      }
    })()
  };
};
