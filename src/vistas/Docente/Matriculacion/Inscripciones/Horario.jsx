import { Table } from "react-bootstrap";
import '../../../Admin/Styles/Horario.css'


const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const Horario = ({ materiasSeleccionadas, jornada, nivel }) => {

    console.log("materiasSeleccionadas", materiasSeleccionadas);
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

    let horas = jornada === "Matutina" ? horasMatutina : horasVespertina;
    if (nivel === "3ro Bachillerato") {
        horas = [
            "07:00 - 07:45",
            "07:45 - 08:30",
            "08:30 - 09:15",
            "09:15 - 10:00",
            "10:00 - 10:45",
            "10:45 - 11:30",
            "11:30 - 12:15",
            "14:30 - 15:15",
            "15:15 - 16:00",
            "16:00 - 16:45",
            "16:45 - 17:30",
            "17:30 - 18:15",
            "18:15 - 19:00",
        ]
    }




    const obtenerMateria = (dia, bloqueHora) => {
        const [inicioBloque, finBloque] = bloqueHora.split(" - ");

        const toMin = (h) => {
            if (!h) return null;
            const [HH, MM] = h.split(":").map(Number);
            return HH * 60 + MM;
        };

        const inicioB = toMin(inicioBloque);
        const finB = toMin(finBloque);

        return materiasSeleccionadas.find((inscripcion) => {
            const {
                horaInicio,
                horaFin,
                hora1,
                hora2,
                dias
            } = inscripcion.Asignacion;

            // 1️⃣ Validar día
            const indexDia = dias.indexOf(dia);
            if (indexDia === -1) return false;

            let inicioA, finA;

            // 2️⃣ Decidir horario
            if (hora1 && hora2) {
                // 📌 Hay horarios distintos
                if (indexDia === 0) {
                    inicioA = toMin(horaInicio);
                    finA = toMin(horaFin);
                } else if (indexDia === 1) {
                    inicioA = toMin(hora1);
                    finA = toMin(hora2);
                } else {
                    return false;
                }
            } else {
                // 📌 Horario único para todos los días
                inicioA = toMin(horaInicio);
                finA = toMin(horaFin);
            }

            if (inicioA === null || finA === null) return false;

            // 3️⃣ Validar bloque horario
            return inicioB >= inicioA && finB <= finA;
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