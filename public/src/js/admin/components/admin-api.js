/* ########### TABLE ########### */
export function fetchAdminHistory() {
    return fetch('/admin/api/admin-history')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching action history:', error);
            return [];
        });
}

export function clearAdminHistory() {
    return fetch('/admin/clear-history', {
        method: 'POST'
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}
/* ########### TOOLS ########### */
export function createAdmin(username, password) {
    return fetch('/admin/create-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

export function createPromoCode(promocode, discount) {
    return fetch('/admin/create-promo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ promocode, discount })
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

/* FIND AND CREATE SECTION OR SPOT */

export function fetchParkingSections() {
    return fetch('/admin/sections')
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return { sections: [] };
        });
}

export function createParkingSection(sectionName, sectionAddress, hourlyRate) {
    return fetch('/admin/create-section', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sectionName, sectionAddress, hourlyRate })
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

export function createParkingSpot(sectionId) {
    return fetch('/admin/add-spot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sectionId })
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}