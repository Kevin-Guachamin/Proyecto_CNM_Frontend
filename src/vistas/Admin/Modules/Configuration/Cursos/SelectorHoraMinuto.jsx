import { useEffect, useState } from "react";

export default function SelectorHoraMinuto({
  value = "",
  onChange,
  min = "07:00",
  max = "19:00"
}) {
  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");

  // Sincronizar cuando el padre cambie el value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHora(h);
      setMinuto(m);
    } else {
      setHora("");
      setMinuto("");
    }
  }, [value]);

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
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select
        value={hora}
        onChange={e => {
          setHora(e.target.value);
          emitirCambio(e.target.value, minuto);
        }}
      >
        <option value="" disabled>HH</option>
        {horas.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      :

      <select
        value={minuto}
        onChange={e => {
          setMinuto(e.target.value);
          emitirCambio(hora, e.target.value);
        }}
      >
        <option value="" disabled>MM</option>
        {minutos.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}

