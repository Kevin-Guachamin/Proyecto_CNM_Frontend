import Swal from "sweetalert2";

export function InfoMessage({
  title = "Información",
  text = "",
  confirmText = "Entendido",
}) {
  Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: confirmText,
    confirmButtonColor: "#0d6efd", // azul Bootstrap
  });
}
