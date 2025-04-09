import axios from 'axios'
import { ErrorMessage } from '../ErrorMesaje';

export function ObtenerTodo(setData,URL, setLoading){
  const token=localStorage.getItem("token")
    setLoading(true)
    axios.get(`${URL}`,
      {headers: { Authorization: `Bearer ${token}` },
    })
        .then(response => {
          setData(response.data); // Guardar la información del usuario en el estado
          
          setLoading(false);
        })
        .catch(error => {
          ErrorMessage(error)
          setLoading(false);
        });
  
}
