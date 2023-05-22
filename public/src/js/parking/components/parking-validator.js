export const validateForm = () => {
    const arrivalDateInput = document.getElementById('date-arrival');
    const arrivalTimeInput = document.getElementById('date-arrival-time');
    const exitDateInput = document.getElementById('date-exit');
    const exitTimeInput = document.getElementById('date-exit-time');
    const formError = document.querySelector('.form-error');

    formError.textContent = '';
    formError.classList.remove('success');

    const arrivalDateValue = arrivalDateInput.value;
    const arrivalTimeValue = arrivalTimeInput.value;
    const exitDateValue = exitDateInput.value;
    const exitTimeValue = exitTimeInput.value;

    const currentDateTime = new Date();
    const arrivalDateTime = new Date(arrivalDateValue + 'T' + arrivalTimeValue);
    if (arrivalDateTime < currentDateTime) {
        formError.textContent = 'Arrival Date and Time cannot be in the past';
        return false;
    }
    if ((arrivalDateTime - currentDateTime) > 3 * 24 * 60 * 60 * 1000) {
        formError.textContent = 'Arrival Date and Time cannot be more than 3 days from now';
        return false;
    }

    const minExitDateTime = new Date(arrivalDateTime.getTime() + 1 * 60 * 60 * 1000); // 1 hour from Arrival DateTime
    const maxExitDateTime = new Date(arrivalDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from Arrival DateTime
    const exitDateTime = new Date(exitDateValue + 'T' + exitTimeValue);
    if (exitDateTime < minExitDateTime) {
        formError.textContent = 'Exit Date and Time must be at least 1 hour after Arrival Date and Time';
        return false;
    }
    if (exitDateTime > maxExitDateTime) {
        formError.textContent = 'Exit Date and Time cannot be more than 7 days from Arrival Date and Time';
        return false;
    }

    return true;
};