import React from "react";
import { Table} from "react-bootstrap";
import '../../../Admin/Styles/Horario.css'


const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const Horario = ({ materiasSeleccionadas, jornada }) => {

  
    const horasMatutina = [
        "07:00 - 07:45",
        "07:45 - 08:30",
        "08:30 - 09:15",
        "09:15 - 10:00",
        "10:00 - 10:45",
        "10:45 - 11:30",
        "11:30 - 12:15",
    ];

    const horasVespertina = [
        "14:30 - 15:15",
        "15:15 - 16:00",
        "16:00 - 16:45",
        "16:45 - 17:30",
        "17:30 - 18:15",
        "18:15 - 19:00",
    ];

    const horas = jornada === "Matutina" ? horasMatutina : horasVespertina;



    const obtenerMateria = (dia, hora) => {
        return materiasSeleccionadas.find((inscripcion) => {
            const asignacion = inscripcion.Asignacion;
            const horaAsignacion = `${asignacion.horaInicio} - ${asignacion.horaFin}`;
            return (
                horaAsignacion === hora &&
                asignacion.dias.includes(dia)
            );
        });
    };

    return (
        <div className="horario-table-responsive">
            <Table bordered hover className="horario-tabla text-center">
                <thead>
                    <tr>
                        <th className="horario-header">Hora</th>
                        {diasSemana.map((dia) => (
                            <th className="horario-header" key={dia}>{dia}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {horas.map((hora) => (
                        <tr key={hora}>
                            <td className="horario-hora"><strong>{hora}</strong></td>
                            {diasSemana.map((dia) => {
                                const inscripcion = obtenerMateria(dia, hora);
                                return (
                                    <td key={dia + hora} className={`horario-celda ${inscripcion ? "horario-celda-asignada" : ""}`}>
                                        {inscripcion ? (
                                            <div className="horario-materia-container">
                                                <span className="horario-materia-nombre">{inscripcion.Asignacion.Materia.nombre}</span>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Horario;