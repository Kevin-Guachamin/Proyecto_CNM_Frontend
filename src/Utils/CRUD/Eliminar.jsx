import Swal from 'sweetalert2';
import axios from 'axios';
import { ErrorMessage } from '../ErrorMesaje';

export function Eliminar (data, URL, descripcion, setData, PK){
    const token= localStorage.getItem("token")
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar a ${descripcion}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar usuario por PK
            axios
                .delete(`${URL}/${data[PK]}`, 
                    {headers: { Authorization: `Bearer ${token}` },
                  })
                .then(() => {
                  
                  setData((prevData) => prevData.filter((d) => d[PK] !== data[PK]));
                    Swal.fire(
                        'Eliminado!',
                        `${descripcion} ha sido eliminado.`,
                        'success'
                    );
                })
                .catch((error) => {
                    ErrorMessage(error)
                });
        }
    });
}