import {
    fetchAdminHistory,
    clearAdminHistory,
    createAdmin,
    createPromoCode,
    fetchParkingSections,
    createParkingSection,
    createParkingSpot
} from './components/admin-api.js';

const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
});

function createTableRow(index, message, date, actionType) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index}</td>
      <td>${message}</td>
      <td>${date}</td>
      <td>${actionType}</td>
  `;
    return row;
}

const table = document.getElementById('action-history-table');
const tableBody = document.getElementById('action-history-table-body');
tableBody.innerHTML = '';

let currentPage = 1;
const itemsPerPage = 13;
let pagination;

function renderTableData(actionHistoryData) {
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    actionHistoryData.slice(startIndex, endIndex).forEach((data, index) => {
        const row = createTableRow(startIndex + index + 1, data.message, data.createdAt, data.actionType);
        tableBody.appendChild(row);
    });
}

function fetchAndRenderData() {
    fetchAdminHistory()
        .then(actionHistoryData => {
            renderTableData(actionHistoryData);

            const itemCount = document.querySelector('.item-count');
            itemCount.textContent = `Elements: ${actionHistoryData.length}`;

            pagination.updateTotalItems(actionHistoryData.length);
        })
        .catch(error => console.error('Error fetching action history:', error));
}

pagination = createPagination(0, currentPage, itemsPerPage, (page) => {
    currentPage = page;
    fetchAndRenderData();
});

fetchAndRenderData();

const menuItems = document.querySelectorAll('.nav-item');
const midContent = document.querySelector('.mid-content');

function changeContent(contentId) {
    const allContents = midContent.querySelectorAll('.content');
    allContents.forEach(content => {
        content.style.display = content.id === contentId ? 'flex' : 'none';
    });

    window.location.hash = `#${contentId}`;
}

const hash = window.location.hash;
if (hash) {
    changeContent(hash);
} else {
    const allContents = midContent.querySelectorAll('.content');
    allContents.forEach(content => {
        content.style.display = 'none';
    });
}

menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        const contentId = menuItem.dataset.content;
        changeContent(contentId);
    });
});

/* PAGINATOR */

function createPagination(totalItems, currentPage, itemsPerPage, onPageChange) {
    let totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');

    function handlePageClick(direction) {
        if (
            (direction === 'prev' && currentPage > 1) ||
            (direction === 'next' && currentPage < totalPages)
        ) {
            currentPage += direction === 'prev' ? -1 : 1;
            onPageChange(currentPage);
            updatePaginationButtons();
        }
    }

    prevPageButton.addEventListener('click', () => handlePageClick('prev'));
    nextPageButton.addEventListener('click', () => handlePageClick('next'));

    function updatePaginationButtons() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }
    return {
        updateTotalItems(newTotalItems) {
            totalItems = newTotalItems;
            totalPages = Math.ceil(totalItems / itemsPerPage);
        },
        updateCurrentPage(newCurrentPage) {
            currentPage = newCurrentPage;
        }
    };
}

/* SUBMIT CREATE ADMIN ACCOUNT */

document.getElementById('account-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    createAdmin(username, password)
        .then((data) => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

/* SUBMIT CREATE PROMO-CODE */

document.getElementById('promocode-form').addEventListener('submit', () => {
    const promocode = document.getElementById('promo-code-input').value;
    const discount = document.getElementById('discount-input').value;

    createPromoCode(promocode, discount)
        .then((data) => {
            location.reload();
            console.log(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

/* CLEAR DATA HISTORY */

document.getElementById('clear-history-button').addEventListener('click', () => {
    clearAdminHistory()
        .then((data) => {
            console.log(data.message);
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

/* CREATE SECTION */

document.getElementById('parking-form').addEventListener('submit', () => {
    const sectionName = document.getElementById('sectionName').value;
    const sectionAddress = document.getElementById('sectionAddress').value;
    const hourlyRate = document.getElementById('hourlyRate').value;

    createParkingSection(sectionName, sectionAddress, hourlyRate)
        .then((data) => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

/* CREATE PARKING SPOT */

fetchParkingSections()
    .then((data) => {
        const sectionSelect = document.getElementById('section');
        data.sections.forEach((section) => {
            const option = document.createElement('option');
            option.value = section._id;
            option.textContent = section.sectionName;
            sectionSelect.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

document.getElementById('spot-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const sectionId = document.getElementById('section').value;

    createParkingSpot(sectionId)
        .then((data) => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});