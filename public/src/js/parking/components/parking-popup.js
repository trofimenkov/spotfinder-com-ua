import { saveFormData } from './parking-api.js';
import { validateForm } from './parking-validator.js';

const popupWrapper = document.querySelector('.popup-wrapper');
const occupiedContent = popupWrapper.querySelector('.occupied-info');
const availableContent = popupWrapper.querySelector('.form');

const arrivalDateInput = document.querySelector('#date-arrival');
const arrivalTimeInput = document.querySelector('#date-arrival-time');
const exitDateInput = document.querySelector('#date-exit');
const exitTimeInput = document.querySelector('#date-exit-time');

export const showPopupForm = () => {
    occupiedContent.style.display = 'block';
    availableContent.style.display = 'none';
}

export const hidePopupForm = () => {
    occupiedContent.style.display = 'none';
    availableContent.style.display = 'block';
}

export const togglePopupForm = (selectedSection, selectedSpot) => {

    const sectionInput = popupWrapper.querySelector('#section');
    const spotInput = popupWrapper.querySelector('#spot');
    sectionInput.value = selectedSection.sectionName;
    spotInput.value = selectedSpot.spotNumber;

    selectedSpot.isOccupied ? showPopupForm() : hidePopupForm();
    popupWrapper.classList.remove('hide');
};

export const handlePopupFormSubmit = (selectedSection, selectedSpot, formName) => {
    const sectionInput = document.querySelector('#section');
    const spotInput = document.querySelector('#spot');
    const firstNameInput = document.querySelector('#firstname');
    const lastNameInput = document.querySelector('#lastname');
    const phoneNumberInput = document.querySelector('#phone');
    const carNumberInput = document.querySelector('#carnumber');
    const promoInput = document.querySelector('#promo');

    const sectionValue = sectionInput.value;
    const spotValue = spotInput.value;

    if (validateForm()) {
        const formError = document.querySelector('.form-error');
        const cost = updateFormPrice(selectedSection);
        const formData = {
            section: sectionInput.value,
            spot: spotInput.value,
            spot_id: selectedSpot.spotId,
            firstname: firstNameInput.value,
            lastname: lastNameInput.value,
            arrivalDate: arrivalDateInput.value,
            arrivalTime: arrivalTimeInput.value,
            exitDate: exitDateInput.value,
            exitTime: exitTimeInput.value,
            carNumber: carNumberInput.value,
            phone: phoneNumberInput.value,
            promo: promoInput.value,
            price: cost
        };
        formError.classList.add('success');
        formError.textContent = 'Success! Now you can close this form.';
        saveFormData(formData);
    } else {
        console.log("ERROR");
    }
    formName.reset();
    sectionInput.value = sectionValue;
    spotInput.value = spotValue;
};

export function updateFormPrice(selectedSection) {
    if (arrivalDateInput.value && arrivalTimeInput.value &&
        exitDateInput.value && exitTimeInput.value) {
        if (!validateForm()) {
            const costValueElement = document.getElementById('costValue');
            costValueElement.textContent = '0';
            return 0;
        }
        const arrivalDateTime = new Date(arrivalDateInput.value + 'T' + arrivalTimeInput.value);
        const exitDateTime = new Date(exitDateInput.value + 'T' + exitTimeInput.value);

        const timeDiff = Math.abs(exitDateTime.getTime() - arrivalDateTime.getTime());
        const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
        const cost = selectedSection.hourlyRate * hours;

        const costValueElement = document.getElementById('costValue');
        costValueElement.textContent = `${cost}`;
        return Number(cost);
    }
    return 0;
}

export function handlePopupWrapperClick(event) {
    if (event.target.classList.contains("close-icon") || event.target.classList.contains("btn_back")) {
        popupWrapper.classList.add("hide");
        const promoInput = popupWrapper.querySelector('.form-element.promo');
        const promoToggle = popupWrapper.querySelector('.promo-toggle');
        promoInput.classList.remove("active");
        promoToggle.classList.remove("hide");
    }
    if (event.target.classList.contains("promo-toggle")) {
        const promoElement = popupWrapper.querySelector('.form-element.promo');
        event.target.classList.toggle("hide");
        promoElement.classList.toggle("active");
    }
}