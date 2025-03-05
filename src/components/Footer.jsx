import React from "react";
import { Facebook, Instagram } from "@mui/icons-material"; // Conservamos los iconos de Material-UI
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h6 className="footer-title">
          Conservatorio Nacional de Música © Todos los Derechos Reservados.
        </h6>

        <div className="footer-info">
          <div className="footer-item">
            <p>📍 Dirección: Cochapata E12 56 y Manuel de Abascal (El Batán) Quito - Ecuador</p>
          </div>
          <div className="footer-item">
            <p>📞 Teléfono: 248 666 ext. 117</p>
          </div>
          <div className="footer-item">
            <p>⏰ Horario: 08:00 - 20:00</p>
          </div>
        </div>

        <div className="footer-social">
          <a href="https://www.facebook.com/conservatorioquito/" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <Facebook style={{ fontSize: 50 }} />
          </a>
          <a href="https://www.instagram.com/conamusi_oficial/" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <Instagram style={{ fontSize: 50 }} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
