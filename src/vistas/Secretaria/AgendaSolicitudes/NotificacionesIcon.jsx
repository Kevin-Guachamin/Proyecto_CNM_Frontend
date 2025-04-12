import { Bell } from "lucide-react";
import "./NotificacionesIcon.css"; // Importa el CSS externo

export default function NotificacionesIcon({ cantidad = 0 }) {
  return (
    <div className="notificacion-container">
      <Bell size={20} className="notificacion-icon" />
      {cantidad > 0 && (
        <span className="notificacion-badge">
          {cantidad}
        </span>
      )}
    </div>
  );
}
