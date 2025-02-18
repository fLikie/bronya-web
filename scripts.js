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
                <td><img src="/uploads/${place.Image}" style="max-width: 100px;"></td>
                <td><a href="place.html?id=${place.ID}">${place.Name}</a></td>
                <td>${place.Location}</td>
                <td><button onclick="deletePlace('${place.ID}')">Delete</button></td>
            </tr>`;
        });
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
    const imageInput = document.getElementById('placeImage');
    
    if (!name || !location || !imageInput.files.length) {
        alert("Please fill all fields and select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("image", imageInput.files[0]);

    const token = localStorage.getItem('token');
    const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    if (response.ok) {
        alert("Place added successfully!");
        window.location.href = "places.html";
    } else {
        alert("Failed to add place");
    }
}

document.addEventListener("DOMContentLoaded", loadPlaces);
