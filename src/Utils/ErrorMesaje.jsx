import Swal from 'sweetalert2';

export function ErrorMessage(error){
  console.log("Este es el error",error.message)
    if (error.response) {
                // Si el backend responde con un error, acceder al mensaje
                console.log("entre aquí??")
                const errorMessage = error.response.data.message;
                Swal.fire({
                  title: 'Error',
                  text: errorMessage,
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentar de nuevo',
                  confirmButtonColor: '#28a745'
                });
              } 
              else if(error.message=="Network Error"){
                Swal.fire({
                  title: 'Error',
                  text: "No se pudo conectar con el servidor",
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentar de nuevo',
                  confirmButtonColor: '#28a745'
                });
              }
              else{
                Swal.fire({
                  title: 'Error',
                  text: `${error.message}`,
                  icon: 'error',
                  iconColor:"#dc3545",
                  confirmButtonText: 'Intentar de nuevo',
                  confirmButtonColor: '#28a745'
                });
              }
}