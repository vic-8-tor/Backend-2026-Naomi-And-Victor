const form = document.getElementById("userForm");
const loginForm = document.getElementById("loginForm");
const logout = document.getElementById("logout");
const updateForm = document.getElementById("updateForm");
const usersContainer = document.getElementById("users");
const deleteButton = document.getElementById("delete");
const getUser = document.getElementById("getUser");
const getAllUsers = document.getElementById("getAllUsers");
const usersContainersTwo = document.getElementById("usersContainersTwo");

// Create User
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/https://backend-2026-naomi-and-victor-rumw.onrender.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
    form.reset();
    getUsers();
  });
}

// Login User
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("https://backend-2026-naomi-and-victor-rumw.onrender.com/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    // Saving token in the Local Storage
    localStorage.setItem("token", data.token);

    loginForm.reset();
  });
}

if (logout) {
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    console.log("Logged out");
  });
}

// Update User
if (updateForm) {
  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userName = document.getElementById("updateUserName").value;
    const email = document.getElementById("updateEmail").value;
    const password = document.getElementById("updatePassword").value;

    const response = await fetch(`https://backend-2026-naomi-and-victor-rumw.onrender.com/users/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userName,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);
    updateForm.reset();
    getUsers();
  });
}

// Delete User
if (deleteButton) {
  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const response = await fetch(`https://backend-2026-naomi-and-victor-rumw.onrender.com/users/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log(data);
  });
}

// Get Users
if (getAllUsers) {
  getAllUsers.addEventListener("click", async (event) => {
    event.preventDefault();

    const response = await fetch(`https://backend-2026-naomi-and-victor-rumw.onrender.com/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log(data);
  });
}

// Get User
if (getUser) {
  getUser.addEventListener("click", async (event) => {
    event.preventDefault();

    const response = await fetch(`https://backend-2026-naomi-and-victor-rumw.onrender.com/users/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log(data);
  });
}

// Display
async function getUsers() {
  if (!usersContainer) return;

  const response = await fetch("https://backend-2026-naomi-and-victor-rumw.onrender.com/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const users = await response.json();

  usersContainer.innerHTML = "";
  users.forEach((user) => {
    console.log(user)
    const div = document.createElement("div");
    console.log(user)
    div.className = "user";
    div.innerHTML = `
        <h3>${user.email}</h3>
        <p>${user.role}</p>
        <img id="userImg" src="/users/profile-picture/${user.profilePicture}" alt ="profile-picture">`;

    usersContainer.appendChild(div);
  });
}
getUsers();
