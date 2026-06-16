import Swal from "sweetalert2";

// Inject SweetAlert custom styles once on module load
const styleId = "swal-custom-styles";
if (!document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .swal-custom-popup {
      background: rgba(24, 24, 27, 0.95) !important;
      backdrop-filter: blur(24px) saturate(1.5) !important;
      -webkit-backdrop-filter: blur(24px) saturate(1.5) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 1rem !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
      max-width: 22rem !important;
      padding: 2rem 1.5rem !important;
    }
    .swal-custom-popup .swal2-icon {
      margin: 0 auto 1rem auto !important;
      border-width: 3px !important;
    }
    .swal-custom-popup .swal2-title {
      color: #fff !important;
      font-size: 1.35rem !important;
      font-weight: 700 !important;
      margin-bottom: 0.5rem !important;
    }
    .swal-custom-popup .swal2-html-container {
      color: rgba(255, 255, 255, 0.6) !important;
      font-size: 0.9rem !important;
      line-height: 1.5 !important;
    }
    .swal-custom-popup .swal2-confirm {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
      border: none !important;
      border-radius: 0.65rem !important;
      padding: 0.6rem 2rem !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35) !important;
      transition: all 0.2s ease !important;
    }
    .swal-custom-popup .swal2-confirm:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5) !important;
    }
    .swal-custom-popup .swal2-confirm:focus {
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3) !important;
    }
    .swal-custom-popup .swal2-cancel {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 0.65rem !important;
      padding: 0.6rem 2rem !important;
      color: #fff !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      transition: all 0.2s ease !important;
      margin: 0 !important;
    }
    .swal-custom-popup .swal2-cancel:hover {
      background: rgba(255, 255, 255, 0.15) !important;
    }
    .swal-custom-popup .swal2-actions {
      display: flex !important;
      gap: 0.75rem !important;
      width: 100% !important;
      margin-top: 1.5rem !important;
    }
  `;
  document.head.appendChild(style);
}

const getSweetAlert = (alertTitle, alertText, alertIcon) => {
  Swal.fire({
    title: alertTitle,
    html: alertText,
    icon: alertIcon,
    background: "transparent",
    backdrop: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    showConfirmButton: true,
    confirmButtonText: "OK",
    customClass: {
      popup: "swal-custom-popup",
    },
  });
};

export default getSweetAlert;
