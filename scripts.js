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

async function updatePlace() {
    const placeId = document.getElementById('placeId').value;
    const name = document.getElementById('placeName').value;
    const location = document.getElementById('placeLocation').value;
    const imageInput = document.getElementById('placeImage');
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    if (imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`/api/places/${placeId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
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
    const placeId = urlParams.get('id');
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
        document.getElementById('placeId').value = place.ID;
        document.getElementById('placeName').value = place.Name;
        document.getElementById('placeLocation').value = place.Location;
        const currentImage = document.getElementById('currentImage');
        currentImage.src = `/uploads/${place.Image}`;
        currentImage.style.display = 'block';
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

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const img = document.getElementById('imagePreview');
        img.src = reader.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

document.addEventListener("DOMContentLoaded", loadPlaces);
