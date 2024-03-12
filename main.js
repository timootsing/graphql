const handleLogin = async (event) => {
    event.preventDefault();
    loginBtn.disabled = true;
    loginBtn.classList.add('cursor-not-allowed');
    const username = usernameInputElement?.value;
    const password = passwordInputElement?.value;
    const token = await authenticateUserAndGetToken(username, password);

    if (token) {
        loginFormElement.style.display = 'none';
        const data = await fetchUserData(token);

        if (data) {
            renderLogoutButton();
            displayUserData(data);
        } else {
            errorElement.innerText = "Something went wrong while fetching data.";
            loginBtn.disabled = false;
            loginBtn.classList.remove('cursor-not-allowed');
        }
    } else {
        errorElement.innerText = "Invalid credentials";
        loginBtn.disabled = false;
        loginBtn.classList.remove('cursor-not-allowed');
    }
}

loginFormElement.addEventListener('submit', handleLogin);

const displayUserData = (data) => {
    const totals = calculateTotals(data.data.user[0].transactions);

    // User info
    const userData = data.data.user[0];
    const userBasicData = getUserBasicInfoHTML(
        userData.firstName + " " + userData.lastName,
        calculateAge(userData.attrs["dateOfBirth"]),
        totals.projectAndPoints.length,
    );
    mainElement.insertAdjacentHTML('beforeend', userBasicData);

    // Pie charti jaoks .auditsDoneTotal, .auditsReceivedTotal (xp)
    const auditRatio = Math.round(userData.auditRatio * 100) / 100;
    renderAuditPieChart(totals, auditRatio)

    // barchart
    renderProjectsBarChart(totals);
}

const getUserBasicInfoHTML = (fullname, age, projectsCompleted) => {
    return `
        <div id="user-details">
            <h1>${fullname}</h1>
            <div class="user-info">
                <p>Age: ${age}<p/>
                <p>Projects completed: ${projectsCompleted}</p>
            </div>
        </div>`;
}

const renderLogoutButton = () => {
    const logoutButton = document.createElement('button');
    logoutButton.innerText = "Log out";
    logoutButton.classList = "logout"
    mainElement.innerHTML = "";
    mainElement.appendChild(logoutButton);
    logoutButton.addEventListener('click', (_) => {
        localStorage.clear();
        window.location.reload();
    });
}
