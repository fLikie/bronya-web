async function adminLogin() {
    const phone = document.getElementById('phoneNumber').value.replace(/\D/g, "").slice(-10); // Оставляем только 10 цифр номера
    const password = document.getElementById('password').value;
    
    if (!/^7\d{10}$/.test("7" + phone)) {
        alert("Invalid phone number format. Use +7 (xxx) xxx-xx-xx");
        return;
    }
    
    if (!password) {
        alert("Please enter a password");
        return;
    }

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: "7" + phone, password }) // Отправляем номер без лишних символов
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "users.html";
    } else {
        alert("Login failed. Check phone number and password.");
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
                <td>${user.Phone}</td>
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
        currentImage.src = `/uploads/${place.image}`;
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
                <td><img src="/uploads/${place.image}" style="max-width: 100px;"></td>
                <td><a href="place.html?id=${place.ID}">${place.Name}</a></td>
                <td>${place.Location}</td>
                <td><button onclick="deletePlace('${place.ID}')">Delete</button></td>
            </tr>`;
        });
    }
}

function showAddUserForm() {
    document.getElementById('addUserForm').style.display = 'block';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

async function addUser() {
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    
    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (!validateEmail(email)) {
        alert("Invalid email format");
        return;
    }

    if (!validatePassword(password)) {
        alert("Password must be at least 6 characters long");
        return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, password, role })
    });

    if (response.ok) {
        alert("User added successfully!");
        window.location.reload();
    } else {
        alert("Failed to add user");
    }
}

function formatPhoneNumber(event) {
    let input = event.target.value.replace(/\D/g, ""); // Удаляем все нецифровые символы

    if (input.startsWith("7")) {
        input = input.slice(1); // Убираем первую 7 (она добавится ниже)
    }

    // Ограничиваем количество цифр
    input = input.slice(0, 10);

    // Применяем маску +7 (XXX) XXX-XX-XX
    let formatted = "+7";
    if (input.length > 0) formatted += " (" + input.slice(0, 3);
    if (input.length >= 4) formatted += ") " + input.slice(3, 6);
    if (input.length >= 7) formatted += "-" + input.slice(6, 8);
    if (input.length >= 9) formatted += "-" + input.slice(8, 10);

    event.target.value = formatted;
}

document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("index.html")) {
        const phoneInput = document.getElementById("phoneNumber");
        if (phoneInput) {
            phoneInput.addEventListener("input", formatPhoneNumber);
        }

        const loginButton = document.querySelector("button");
        if (loginButton) {
            loginButton.addEventListener("click", login);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    const bookingsBtn = document.getElementById("viewBookingsBtn");
    if (bookingsBtn && placeId) {
        bookingsBtn.href = `bookings.html?id=${placeId}`;
    }

    if (document.getElementById("placesTable")) {
        loadPlaces(); // Запуск только на places.html
    }

    if (document.getElementById("usersTable")) {
        loadUsers(); // Загружаем пользователей только на users.html
    }

    if (document.getElementById("showAddUserFormBtn")) {
        document.getElementById("showAddUserFormBtn").addEventListener("click", showAddUserForm);
    }

    if (document.getElementById("addUserBtn")) {
        document.getElementById("addUserBtn").addEventListener("click", addUser);
    }
});