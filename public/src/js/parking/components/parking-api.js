export function fetchData() {
    return fetch('/api/data')
        .then((response) => response.json())
        .catch((error) => console.error('Catch error:', error));
}

export function saveFormData(formData) {
    return fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => { console.log(data); })
        .catch((error) => { console.error('Error:', error); });
}