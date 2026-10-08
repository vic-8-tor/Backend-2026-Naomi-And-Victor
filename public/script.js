const form = document.getElementById("userForm");
const loginForm = document.getElementById("loginForm");
const logout = document.getElementById("logout");
const usersContainer = document.getElementById("users");

// User container
const userInfo = document.getElementById("userInfo");

const API = "https://backend-2026-naomi-and-victor-rumw.onrender.com";

// Create User
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const file = document.getElementById("dp").files[0];

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("file", file);

    const response = await fetch(`/users`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    alert(data.message);
    form.reset();
  });
}

// Login User
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`/users/login`, {
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
    localStorage.setItem("userId", data.userId);
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

async function deleteUser() {
  const id = await localStorage.getItem("userId");
  const token = await localStorage.getItem("token");

  await fetch(`/users/user/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Autorization: `bearer ${token}`,
    },
  });
  getUsers();
}

// Users Container
async function getUsers() {
  if (!usersContainer) return;

  const response = await fetch(`/users`);

  const users = await response.json();

  usersContainer.innerHTML = "";
  users.forEach((user) => {
    const usersDiv = document.createElement("div");
    console.log(user);
    usersDiv.className = "user";
    usersDiv.innerHTML = `
        <h3>${user.email}</h3>
        <p>${user.username}</p>
        <img src="/users/profile-picture/${user.profilePicture}" alt="profile-picture">`;

    usersContainer.appendChild(usersDiv);

    usersDiv.addEventListener("click", () => {
      document.location.href = "userInfo.html";
    });
  });
}
getUsers();

// User Information
if (userInfo) {
  async function getUser() {
    const id = await localStorage.getItem("userId");
    const token = await localStorage.getItem("token");

    const response = await fetch(`/users/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const user = await response.json();
    console.log(user);

    userInfo.innerHTML = "";

    const userData = document.createElement("div");
    userData.className = "data";
    userData.innerHTML = `
    <div class="data-text">
      <h3> ${user.email}</h3>
      <h3> ${user.username}</h3>
      <div class="update-and-delete-btn">
        <button class="deleteButton">Delete</button>
        <button class="updateButton">Update</button>
      </div>
    </div>
    <img src="/users/profile-picture/${user.profilePicture}" alt="profile-picture">`;

    userInfo.appendChild(userData);

    // const deleteData = document.getElementById("deleteButton");
    // deleteData.addEventListener("click", deleteUser);

    // Update
    const updateBtn = userData.querySelector(".updateButton");
    updateBtn.addEventListener("click", () => {
      userData.innerHTML = `
      <div class="updateContainer">
        <form id="updateForm">
          <input type="file" name="file" class="dp">
          <input text="text" class="updatedName" placeholder="Enter Your Username"/>
          <input type="email" class="updatedEmail" placeholder="Enter your email" required />
          <input type="password" class="updatedPassword" placeholder="Enter your password" required />
          <div class=cancelAndSave>
            <button class="cancel">Cancel</button>
            <button class="save">Save</button>
        </form>
      </div>`;

      userData.querySelector(".cancel").addEventListener("click", getUser);

      userData.querySelector(".save").addEventListener("click", async () => {
        const id = await localStorage.getItem("userId");

        const formData = new FormData();

        const file = userData.querySelector(".dp").files[0];

        formData.append(
          "username",
          userData.querySelector(".updatedName").value,
        );

        formData.append("email", userData.querySelector(".updatedEmail").value);
        formData.append(
          "password",
          userData.querySelector(".updatedPassword").value,
        );

        if (file) {
          formData.append("file", file);
        }

        const response = await fetch(`/users/user/${id}`, {
          method: "PUT",
          body: formData,
        });
        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Server response:", data);
        if (response.ok) getUser();
      });
    });

    // Delete User
    const deleteBtn = userData.querySelector(".deleteButton");
    deleteBtn.addEventListener("click", async () => {
      const id = await localStorage.getItem("userId");

      const response = await fetch(`/users/user/${id}`, {
        method: "DELETE",
      });
      if (response.ok) userData.remove();
    });
  }

  getUser();
}
