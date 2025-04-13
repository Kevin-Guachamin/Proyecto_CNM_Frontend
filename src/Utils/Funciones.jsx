
export function calcularEdad(fechaNacimiento) {

    let fechaNac = fechaNacimiento; // Convertir la fecha a objeto Date
    let hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear(); // Restar años

    // Ajustar si aún no ha pasado el cumpleaños este año
    let mesActual = hoy.getMonth();
    let diaActual = hoy.getDate();
    let mesNac = fechaNac.getMonth();
    let diaNac = fechaNac.getDate();

    if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
        edad--;
    }

    return edad;
}
export  function convertirFecha  (fecha)  {
    if (!fecha) return null;
    const [dia, mes, año] = fecha.split('/');
    return new Date(`${año}-${mes}-${dia}`); // Convertir a formato ISO (yyyy-mm-dd)
  };

  export function generarCodigoEstudiante (anio, idEstudiante) {
    const secuencial = String(idEstudiante).padStart(4, "0"); // Asegura 4 dígitos
    return `${anio}${secuencial}`;
  };

    
   
 