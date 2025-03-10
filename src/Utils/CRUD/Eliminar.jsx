import Swal from 'sweetalert2';
import axios from 'axios';
import { ErrorMessage } from '../ErrorMesaje';

export function Eliminar (data, URL, descripcion, setData){
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
            // Eliminar usuario por ID
            axios
                .delete(`${URL}/${data.ID}`)
                .then(() => {
                  
                  setData((prevData) => prevData.filter((d) => d.ID !== data.ID));
                    Swal.fire(
                        'Eliminado!',
                        `El periodo ${descripcion} ha sido eliminado.`,
                        'success'
                    );
                })
                .catch((error) => {
                    ErrorMessage(error)
                });
        }
    });
}