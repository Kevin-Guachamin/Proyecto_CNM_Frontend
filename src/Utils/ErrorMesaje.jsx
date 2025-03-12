import Swal from 'sweetalert2';

export function ErrorMessage(error){
    if (error.response) {
                // Si el backend responde con un error, acceder al mensaje
                const errorMessage = error.response.data.message;
                Swal.fire({
                  title: 'Error',
                  text: errorMessage,
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentelo más tarde',
                  confirmButtonColor: '#28a745'
                });
              } else {
                // En caso de que no haya respuesta del backend
                Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al conectarse con el servidor.',
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentelo más tarde',
                  confirmButtonColor: '#28a745'
                });
              }
}