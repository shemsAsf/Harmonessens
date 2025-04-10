import Swal from 'sweetalert2';

export const NotifyError = (navigate, redirect, errorMessage) => {
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Une erreur est survenue, ${errorMessage ? errorMessage : "Veuillez réessayer plus tard."}`,
        confirmButtonColor: '#F44336',
    }).then(() => {
        if (redirect !== null) {
            navigate(redirect);
        }
    });
};

export const NotifySuccess = (navigate, redirect, text, title) => {
    Swal.fire({
        icon: 'success',
        title: `${title ? title : 'Réservation Confirmée'}`,
        text: `${text ? text : "La réservation a été effectuée avec succès."}`,
        confirmButtonColor: '#4CAF50',
    }).then(() => {
        if (redirect !== null) {
            navigate(redirect);
        }
    });
}