import React from "react";

export default function SelectorHoraMinuto({ value, onChange, min = "07:00", max = "19:00" }) {
  // Si no hay valor, usar el mínimo como valor por defecto
  const defaultValue = value || min;
  
  // Parsear el value en hora y minuto
  const [horaActual, minutoActual] = defaultValue.split(":");

  // Obtener rango de horas desde min a max
  const minHora = parseInt(min.split(":")[0]);
  const maxHora = parseInt(max.split(":")[0]);

  const horas = [];
  for (let i = minHora; i <= maxHora; i++) {
    horas.push(i.toString().padStart(2, "0"));
  }
  const minutos = ["00", "15", "30", "45"];

  // Función para cuando cambia hora o minuto
  const handleHoraChange = (newHora) => {
    const nuevoValor = `${newHora}:${minutoActual}`;
    onChange({ target: { value: nuevoValor } });
  };

  const handleMinutoChange = (newMinuto) => {
    const nuevoValor = `${horaActual}:${newMinuto}`;
    onChange({ target: { value: nuevoValor } });
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select value={horaActual} onChange={e => handleHoraChange(e.target.value)}>
        {horas.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      :
      <select value={minutoActual} onChange={e => handleMinutoChange(e.target.value)}>
        {minutos.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
