async function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'users.html';
    } else {
        alert('Login failed');
    }
}

function logout() {
    localStorage.removeItem('token');
    alert('Logged out');
    window.location.href = 'index.html';
}

async function loadUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const users = await response.json();
        const table = document.getElementById('usersTable');
        table.innerHTML = '';
        users.forEach(user => {
            table.innerHTML += `<tr>
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><button onclick="deleteUser('${user.id}')">Delete</button></td>
            </tr>`;
        });
    }
}

async function loadPlaces() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/places', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        const places = await response.json();
        const table = document.getElementById('placesTable');
        table.innerHTML = '';
        places.forEach(place => {
            table.innerHTML += `<tr>
                <td>${place.id}</td>
                <td>${place.name}</td>
                <td>${place.location}</td>
                <td><button onclick="deletePlace('${place.id}')">Delete</button></td>
            </tr>`;
        });
    }
}

async function addPlace() {
    const name = document.getElementById('placeName').value;
    const location = document.getElementById('placeLocation').value;
    const token = localStorage.getItem('token');
    await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, location })
    });
    window.location.href = 'places.html';
}