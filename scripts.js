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
                <td>${user.ID}</td>
                <td>${user.Email}</td>
                <td>${user.Role}</td>
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
                <td>${place.ID}</td>
                <td><a href="place.html?id=${place.ID}">${place.Name}</a></td>
                <td>${place.Location}</td>
                <td>
                    <button onclick="deletePlace('${place.ID}')">Delete</button>
                </td>
            </tr>`;
        });
    }
}

async function updatePlace() {
    const placeId = document.getElementById('placeId').value; // Получаем ID
    if (!placeId) {
        alert("Invalid place ID");
        return;
    }

    const name = document.getElementById('placeName').value;
    const location = document.getElementById('placeLocation').value;

    const token = localStorage.getItem('token');
    const response = await fetch(`/api/places/${placeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, location }) // Убираем ID из тела запроса
    });

    if (response.ok) {
        alert("Place updated successfully!");
        window.location.href = "places.html";
    } else {
        alert("Failed to update place");
    }
}

async function loadPlace() {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id'); // Получаем ID из URL
    if (!placeId) {
        alert("Invalid place ID");
        window.location.href = "places.html";
        return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`/api/places/${placeId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const place = await response.json();
        document.getElementById('placeId').value = place.ID; // Присваиваем ID
        document.getElementById('placeName').value = place.Name;
        document.getElementById('placeLocation').value = place.Location;
    } else {
        alert("Failed to load place");
        window.location.href = "places.html";
    }
}

async function deletePlace(placeId) {
    if (!confirm("Are you sure you want to delete this place?")) return;
    
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/places/${placeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        alert("Place deleted successfully!");
        loadPlaces();
    } else {
        alert("Failed to delete place");
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

document.addEventListener("DOMContentLoaded", loadPlaces);
