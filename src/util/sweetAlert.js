import Swal from "sweetalert2";

const getSweetAlert = (alertTitle, alertText, alertIcon) => {
    Swal.fire({
        title: alertTitle,
        html: alertText,
        icon: alertIcon
    });
}

export default getSweetAlert;