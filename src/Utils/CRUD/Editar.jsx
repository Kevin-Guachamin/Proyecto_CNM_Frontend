import axios from 'axios'
import { ErrorMessage } from '../ErrorMesaje';

export function Editar (dataToUpdate,newData, URL, setData, setIsModalOpen, PK,headers){
    console.log("esto es lo que se va a enviar",newData)
    if (dataToUpdate) {
        // Si estamos editando un usuario, lo actualizamos
        axios
          .put(`${URL}/editar/${dataToUpdate[PK]}`, newData,headers)
          .then((res) => {
            // Actualizamos el array de usuarios con la respuesta del servidor
            console.log("esto llego de la base después de editar", res.data)
            setData((prevData) => {
              // Comprobar el valor de prevData dentro de la actualización
              console.log("prevData dentro de setData:", prevData);
              
              return prevData.map((data) =>
                data[PK] === dataToUpdate[PK] ? res.data : data
              );
            });
            
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
            console.log("este llego de la base despues de crear",res.data)
            setData((prevData) => [...prevData, res.data]);
            setIsModalOpen(false); // Cerrar el modal
          })
          .catch((error) => {
            ErrorMessage(error)
            console.log(error)
          });
       
}
}