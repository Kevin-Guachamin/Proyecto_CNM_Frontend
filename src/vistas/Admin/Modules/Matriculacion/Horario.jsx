import React from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import '../../Styles/Horario.css'
import { ErrorMessage } from "../../../../Utils/ErrorMesaje";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const Horario = ({ materiasSeleccionadas, setMateriasSeleccionadas, jornada }) => {

    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token = localStorage.getItem("token")
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

    const eliminarMateria = (inscripcion) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Va a eliminar una inscripción`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_URL}/inscripcion/eliminar/${inscripcion.ID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then(() => {
                    console.log("este no tiene ID", inscripcion.Asignacion)

                    setMateriasSeleccionadas((prevData) =>
                        prevData.filter((d) => d.Asignacion && d.Asignacion.ID !== inscripcion.Asignacion.ID)
                    );
                })


            }
        });
    };

    const obtenerMateria = (dia, bloqueHora) => {
        // bloqueHora viene como "07:00 - 07:45"
        const [inicioBloque, finBloque] = bloqueHora.split(" - ");

        // Convertir a minutos
        const toMin = (h) => {
            const [HH, MM] = h.split(":").map(Number);
            return HH * 60 + MM;
        };

        const inicioB = toMin(inicioBloque);
        const finB = toMin(finBloque);

        return materiasSeleccionadas.find((inscripcion) => {
            const { horaInicio, horaFin, dias } = inscripcion.Asignacion;

            const inicioA = toMin(horaInicio);
            const finA = toMin(horaFin);

            // 1. Verificar día
            if (!dias.includes(dia)) return false;

            // 2. Verificar si el bloque está dentro del rango del horario asignado
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
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    className="horario-boton"
                                                    onClick={() => eliminarMateria(inscripcion)}
                                                >
                                                    ✖
                                                </Button>
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
