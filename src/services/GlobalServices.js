const registerMedicFetch = (name, email, password, role) => {
    return fetch('http://localhost:3000/api/medics', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    })
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const registerPatientFetch = (name, email, password, role) => {
    return fetch('http://localhost:3000/api/patients', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    })
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const accessMedicFetch = (email, password) => {
    return fetch('http://localhost:3000/api/login/medic', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                sessionStorage.setItem('token', JSON.stringify(data.token));
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const accessPatientFetch = (email, password) => {
    return fetch('http://localhost:3000/api/login/patient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                sessionStorage.setItem('token', JSON.stringify(data.token));
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const getMedicsFetch = (from, limit) => {
    return fetch(`http://localhost:3000/api/medics?from=${from}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-token': getToken()
        }})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const getPatientsFetch = (from, limit) => {
    return fetch(`http://localhost:3000/api/patients?from=${from}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-token': getToken()
        }})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const updateMedic = ({name, email, address, province, surname, gender, uid}) => {
    return fetch(`http://localhost:3000/api/medics/${uid}`, { 
        method: 'PUT',
        body: JSON.stringify({ name, email, address, province, surname, gender }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-token': getToken()
        }})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const updatePatient = ({name, email, address, province, surname, gender, uid, medicAssigned, appointment}) => {
    return fetch(`http://localhost:3000/api/patients/${uid}`, { 
        method: 'PUT',
        body: JSON.stringify({ name, email, address, province, surname, gender, medicAssigned, appointment }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-token': getToken()
        }})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const deleteMedic = (uid) => {
    return fetch(`http://localhost:3000/api/medics/${uid}`, { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-token': getToken()
        }})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

const deletePatient = (uid) => {
    return fetch(`http://localhost:3000/api/patients/${uid}`, { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-token': getToken()
        }})
    .then( response => {
        if (response.ok) {
            return response.json().then((data) => {
                return data;
            });
        } else {
            return response.json();
        }
    });
}

function getToken() {
    return sessionStorage.getItem('token');
}

export {   
    registerMedicFetch, 
    registerPatientFetch, 
    accessMedicFetch, 
    accessPatientFetch,
    getMedicsFetch,
    getPatientsFetch,
    updateMedic,
    updatePatient,
    deleteMedic,
    deletePatient
};