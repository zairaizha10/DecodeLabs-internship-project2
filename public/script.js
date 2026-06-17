const API = "/api";

const applicationsContainer =
document.getElementById("applications");

const statsContainer =
document.getElementById("stats");

/* -----------------------------
LOAD APPLICATIONS
----------------------------- */

async function loadApplications() {

    try {

        const response =
        await fetch(`${API}/applications`);

        const data =
        await response.json();

        renderApplications(data);

    } catch(error) {

        console.log(error);

        applicationsContainer.innerHTML =
        "<h3>Unable to load applications</h3>";
    }
}

/* -----------------------------
RENDER APPLICATIONS
----------------------------- */

function renderApplications(data){

    applicationsContainer.innerHTML = "";

    if(data.length === 0){

        applicationsContainer.innerHTML =
        "<h3>No Applications Found</h3>";

        return;
    }

    data.reverse().forEach(app=>{

        const badgeClass =
        app.status.toLowerCase();

        applicationsContainer.innerHTML += `

        <div class="application-card">

            <h3>${app.company}</h3>

            <p>
            <strong>Role:</strong>
            ${app.role}
            </p>

            <p>
            <strong>Date:</strong>
            ${app.date}
            </p>

            <span class="badge ${badgeClass}">
            ${app.status}
            </span>

            <div class="actions">

                <select id="status-${app.id}">

                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Selected</option>
                    <option>Rejected</option>

                </select>

                <button
                class="update-btn"
                onclick="updateStatus(${app.id})">

                Update

                </button>

                <button
                class="delete-btn"
                onclick="deleteApplication(${app.id})">

                Delete

                </button>

            </div>

        </div>

        `;
    });
}

/* -----------------------------
ADD APPLICATION
----------------------------- */

async function addApplication(){

    const company =
    document.getElementById("company").value;

    const role =
    document.getElementById("role").value;

    const status =
    document.getElementById("status").value;

    if(!company || !role){

        alert("Please fill all fields");

        return;
    }

    try{

        await fetch(`${API}/applications`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                company,
                role,
                status
            })

        });

        document.getElementById("company").value="";
        document.getElementById("role").value="";

        loadApplications();
        loadStats();

    }catch(error){

        console.log(error);
    }
}

/* -----------------------------
DELETE
----------------------------- */

async function deleteApplication(id){

    const confirmDelete =
    confirm("Delete this application?");

    if(!confirmDelete) return;

    await fetch(

        `${API}/applications/${id}`,

        {
            method:"DELETE"
        }

    );

    loadApplications();
    loadStats();
}

/* -----------------------------
UPDATE STATUS
----------------------------- */

async function updateStatus(id){

    const status =
    document.getElementById(
        `status-${id}`
    ).value;

    await fetch(

        `${API}/applications/${id}`,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                status
            })

        }

    );

    loadApplications();
    loadStats();
}

/* -----------------------------
SEARCH
----------------------------- */

async function searchCompany(){

    const search =
    document.getElementById("search").value;

    const response =
    await fetch(

        `${API}/applications?company=${search}`

    );

    const data =
    await response.json();

    renderApplications(data);
}

/* -----------------------------
LOAD STATS
----------------------------- */

async function loadStats(){

    const response =
    await fetch(`${API}/stats`);

    const stats =
    await response.json();

    statsContainer.innerHTML = `

        <div class="stat-card">

            <h3>${stats.total}</h3>

            <p>Total Applications</p>

        </div>

        <div class="stat-card">

            <h3>${stats.applied}</h3>

            <p>Applied</p>

        </div>

        <div class="stat-card">

            <h3>${stats.interview}</h3>

            <p>Interview</p>

        </div>

        <div class="stat-card">

            <h3>${stats.selected}</h3>

            <p>Selected</p>

        </div>

        <div class="stat-card">

            <h3>${stats.rejected}</h3>

            <p>Rejected</p>

        </div>

    `;
}

/* -----------------------------
DARK MODE
----------------------------- */

const themeBtn =
document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

});

/* -----------------------------
INITIAL LOAD
----------------------------- */

loadApplications();
loadStats();

function resetSearch(){

document.getElementById("search").value="";

loadApplications();

}

function hideAllSections(){

document.getElementById(
"statistics-section"
).style.display="none";

document.getElementById(
"applications-section"
).style.display="none";

document.getElementById(
"api-section"
).style.display="none";

}

function showDashboard(){

hideAllSections();

document.getElementById(
"statistics-section"
).style.display="block";

document.getElementById(
"applications-section"
).style.display="block";

}

function showApplications(){

hideAllSections();

document.getElementById(
"applications-section"
).style.display="block";

}

function showStatistics(){

hideAllSections();

document.getElementById(
"statistics-section"
).style.display="block";

}

function showApiDocs(){

hideAllSections();

document.getElementById(
"api-section"
).style.display="block";

}