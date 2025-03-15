import axios from 'axios'
import { ErrorMessage } from '../ErrorMesaje';

export function Editar (dataToUpdate,newData, URL, setData, setIsModalOpen, PK,headers){
    
    if (dataToUpdate) {
        // Si estamos editando un usuario, lo actualizamos
        axios
          .put(`${URL}/editar/${dataToUpdate[PK]}`, newData,headers)
          .then((res) => {
            // Actualizamos el array de usuarios con la respuesta del servidor
            setData((prevData) =>
              prevData.map((data) =>
                data[PK] === dataToUpdate[PK] ? res.data : data
              )
            );
            setIsModalOpen(false); // Cerrar el modal
          })
          .catch((error) => {
            ErrorMessage(error)
            console.log(error)
          });
      } else {
        // Si no estamos editando, agregamos uno nuevo
        
        axios
          .post(`${URL}/crear`, newData,headers)
          .then((res) => {
            setData((prevData) => [...prevData, res.data]);
            setIsModalOpen(false); // Cerrar el modal
          })
          .catch((error) => {
            ErrorMessage(error)
            console.log(error)
          });
       
}
}