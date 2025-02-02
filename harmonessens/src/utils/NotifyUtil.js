import Swal from 'sweetalert2';

export const NotifyError = (navigate, redirect, errorMessage) => {
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Une erreur est survenue, ${errorMessage ? errorMessage : "Veuillez réessayer plus tard."}`,
        confirmButtonColor: '#F44336',
    }).then(() => {
        if (redirect) {
            navigate(redirect);
        }
    });
};

export const NotifySuccess = (navigate, redirect) => {
    Swal.fire({
        icon: 'success',
        title: 'Réservation Confirmée',
        text: 'La réservation a été effectuée avec succès.',
        confirmButtonColor: '#4CAF50',
    }).then(() => {
        navigate(redirect);
    });
}