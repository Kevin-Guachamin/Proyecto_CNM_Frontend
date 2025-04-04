import Swal from 'sweetalert2';

export function ErrorMessage(error){
  console.log("Este es el error",error)
    if (error.response) {
                // Si el backend responde con un error, acceder al mensaje
                console.log("entre aquí??")
                const errorMessage = error.response.data.message;
                Swal.fire({
                  title: 'Error',
                  text: errorMessage,
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentelo más tarde',
                  confirmButtonColor: '#28a745'
                });
              } 
              else{
                Swal.fire({
                  title: 'Error',
                  text: "No se puedo conectar con el servidor",
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentelo más tarde',
                  confirmButtonColor: '#28a745'
                });
              }
}