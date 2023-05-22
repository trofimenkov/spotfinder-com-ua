import {
    togglePopupForm,
    handlePopupFormSubmit,
    updateFormPrice,
    handlePopupWrapperClick
} from './components/parking-popup.js';
import { fetchData } from './components/parking-api.js';
import { addElement } from './components/parking-util.js';

// Containers for sections and spots
const parkingSectionsContainer = document.querySelector('.parking-sections-container');
const parkingSpotsContainer = document.querySelector('.parking-spots-container');

// Containers for selected section and spot
let selectedSection = null;
let selectedSpot = null;

/* ################## PARKING ################## */

/* GET SECTIONS AND SPOTS FROM API */
fetchData()
    .then((data) => { initializeParkingSpots(data.parkingSections, data.parkingSpots); })
    .catch((error) => console.error('Catch error:', error));

/* INITIALIZE SPOTS FOR SECTIONS AND CREATE */
const initializeParkingSpots = (parkingSections, parkingSpots) => {
    parkingSectionsContainer.innerHTML = '';
    parkingSections.forEach((section) => {
        const sectionSpots = parkingSpots.filter((spot) => section.sectionSpots.includes(spot._id));
        createParkingSection(section, sectionSpots);
    });
};

/* CREATE PARKING SECTIONS */
const createParkingSection = (section, sectionSpots) => {
    const { sectionName, sectionAddress, hourlyRate } = section;

    const sectionElement = document.createElement('div');
    sectionElement.classList.add('parking-section');

    const sectionText = document.createElement('div');
    sectionText.classList.add('section-content');

    addElement('span', sectionName, 'section-name', sectionText);
    addElement('span', `Spots: ${sectionSpots.length}`, 'spots-count', sectionText);
    addElement('span', `Address: ${sectionAddress}`, 'section-address', sectionText);
    addElement('span', `Hourly rate: ${hourlyRate}$`, 'hourly-rate', sectionText);

    sectionElement.appendChild(sectionText);
    parkingSectionsContainer.appendChild(sectionElement);

    sectionElement.addEventListener('click', () => {
        selectedSection = { sectionName, hourlyRate };
        showParkingSpots(sectionSpots);
    });
};

/* CREATE AND SHOW PARKING SPOTS */

const createParkingSpot = (spot) => {
    const { spotNumber, isOccupied, _id } = spot;

    const spotElement = document.createElement('div');
    spotElement.classList.add('parking-spot');
    spotElement.classList.add(isOccupied ? 'occupied' : 'available');

    const spotText = document.createElement('div');
    spotText.classList.add('spot-content');

    addElement('span', `Spot ${spotNumber}`, 'spot-number', spotText);
    addElement('span', `Status: ${isOccupied ? 'Occupied' : 'Available'}`, 'spot-status', spotText);

    spotElement.appendChild(spotText);
    parkingSpotsContainer.appendChild(spotElement);

    spotElement.addEventListener('click', () => {
        selectedSpot = { spotNumber, isOccupied, spotId: _id };
        togglePopupForm(selectedSection, selectedSpot);
    });
};

const createParkingSpots = (spots) => {
    parkingSpotsContainer.innerHTML = '';
    spots.forEach((spot) => createParkingSpot(spot));
};

const toggleSectionsVisibility = (visible) => {
    parkingSectionsContainer.classList.toggle('hide', !visible);
};

const showParkingSpots = (spots) => {
    toggleSectionsVisibility(false);
    createParkingSpots(spots);
    addBackButton();
};

/* BACK BUTTON */
const addBackButton = () => {
    const backButtonContainer = document.createElement('div');
    backButtonContainer.classList.add('back-button-container');

    const backButton = document.createElement('button');
    backButton.innerText = 'BACK';
    backButton.classList.add('back-button');
    backButton.addEventListener('click', () => {
        parkingSpotsContainer.innerHTML = '';
        parkingSpotsContainer.classList.remove('active');
        backButtonContainer.remove();
        toggleSectionsVisibility(true);
    });

    backButtonContainer.appendChild(backButton);
    parkingSpotsContainer.insertAdjacentElement('afterend', backButtonContainer);
};

document.addEventListener('DOMContentLoaded', function () {
    const popupWrapper = document.querySelector('.popup-wrapper');
    popupWrapper.addEventListener('click', handlePopupWrapperClick);
});

/* #### POPUP FORM #### */

const arrivalDateInput = document.querySelector('#date-arrival');
const arrivalTimeInput = document.querySelector('#date-arrival-time');
const exitDateInput = document.querySelector('#date-exit');
const exitTimeInput = document.querySelector('#date-exit-time');

const form = document.querySelector('.form');
form.addEventListener('submit', function () {
    handlePopupFormSubmit(selectedSection, selectedSpot, form);
});

arrivalDateInput.addEventListener('input', function () { updateFormPrice(selectedSection); });
arrivalTimeInput.addEventListener('input', function () { updateFormPrice(selectedSection); });
exitDateInput.addEventListener('input', function () { updateFormPrice(selectedSection); });
exitTimeInput.addEventListener('input', function () { updateFormPrice(selectedSection); });