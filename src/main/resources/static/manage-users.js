document.addEventListener("DOMContentLoaded", () => {


const role =
localStorage.getItem("role");

if (!role) {

    window.location.href =
    "login.html";

    return;
}

loadUsers();


});

let allUsers = [];

async function loadUsers() {


try {

    const response =
    await fetch(
        "http://localhost:8080/api/users"
    );

    allUsers =
    await response.json();

    renderUsers(allUsers);

} catch(error) {

    console.error(error);

    alert(
        "Failed to load users"
    );
}


}

function renderUsers(users){


const table =
document.getElementById(
    "usersTable"
);

table.innerHTML = "";

users.forEach(user => {

    const row =
    document.createElement("tr");

    row.innerHTML = `

    <td>${user.id}</td>

    <td>${user.name}</td>

    <td>${user.email}</td>

    <td>

        <span class="${
            user.role === 'ADMIN'
            ? 'role-admin'
            : 'role-user'
        }">

            ${user.role}

        </span>

    </td>

    <td>

        <button
            class="action-btn"
            onclick="viewUser(${user.id})">

            View

        </button>

    </td>

    `;

    table.appendChild(row);

});


}

document
.getElementById("searchInput")
.addEventListener(
"keyup",
function(){

const keyword =
this.value.toLowerCase();

const filtered =
allUsers.filter(user =>

    user.name
    ?.toLowerCase()
    .includes(keyword)

    ||

    user.email
    ?.toLowerCase()
    .includes(keyword)

);

renderUsers(filtered);


});

function viewUser(id){


const user =
allUsers.find(
    u => u.id === id
);

if(!user){
    return;
}

alert(

    "User ID: " + user.id +

    "\n\nName: " +
    user.name +

    "\n\nEmail: " +
    user.email +

    "\n\nRole: " +
    user.role

);


}

function logout(){


localStorage.clear();

window.location.href =
"login.html";


}
