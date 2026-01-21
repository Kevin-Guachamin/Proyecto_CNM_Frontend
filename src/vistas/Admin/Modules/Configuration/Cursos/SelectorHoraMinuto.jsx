import React from "react";

export default function SelectorHoraMinuto({
  value = "",
  onChange,
  min = "07:00",
  max = "19:00"
}) {
  const [horaActual, minutoActual] = value ? value.split(":") : ["", ""];

  const minHora = parseInt(min.split(":")[0]);
  const maxHora = parseInt(max.split(":")[0]);

  const horas = [];
  for (let i = minHora; i <= maxHora; i++) {
    horas.push(i.toString().padStart(2, "0"));
  }

  const minutos = ["00", "15", "30", "45"];

  const emitirCambio = (h, m) => {
    if (h && m) {
      onChange({ target: { value: `${h}:${m}` } });
    } else {
      onChange({ target: { value: "" } });
    }
  };

  const handleHoraChange = (newHora) => {
    emitirCambio(newHora, minutoActual);
  };

  const handleMinutoChange = (newMinuto) => {
    emitirCambio(horaActual, newMinuto);
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select value={horaActual} onChange={e => handleHoraChange(e.target.value)}>
        <option value="" disabled>HH</option>
        {horas.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      :

      <select value={minutoActual} onChange={e => handleMinutoChange(e.target.value)}>
        <option value="" disabled>MM</option>
        {minutos.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
