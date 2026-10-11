let selectedRole = "student";


// =========================================================
// CURRENT USER
// =========================================================

function getCurrentUser() {

    try {
        return JSON.parse(
            localStorage.getItem("user")
        );
    }

    catch (error) {
        return null;
    }
}


function requireRole(role) {

    const user = getCurrentUser();

    if (!user || user.role !== role) {

        window.location.href = "login.html";

        return null;
    }

    return user;
}


// =========================================================
// LOGIN ROLE
// =========================================================

function setRole(role) {
    selectedRole = role;

    const title = document.getElementById("loginTitle");
    const sub = document.getElementById("loginSub");
    const adminAccessBox = document.getElementById("adminAccessBox");
    const studentAccessBox = document.getElementById("studentAccessBox");
    const registerBox = document.getElementById("registerLinkBox");
    const roleBadge = document.getElementById("loginRoleBadge");
    const socialBox = document.getElementById("socialAuthSectionLogin");

    if (!title) return;

    if (role === "admin") {
        title.textContent = "Administrator Portal";
        if (sub) sub.textContent = "Authorized administrator access only";
        if (adminAccessBox) adminAccessBox.style.display = "none";
        if (studentAccessBox) studentAccessBox.style.display = "block";
        if (registerBox) registerBox.style.display = "none";
        if (socialBox) socialBox.style.display = "none";
        if (roleBadge) {
            roleBadge.textContent = "ADMIN ONLY";
            roleBadge.className = "role-badge admin-badge";
            roleBadge.style.display = "inline-flex";
        }
    } else {
        title.textContent = "Student Sign In";
        if (sub) sub.textContent = "Enter your credentials to access your examinations and code practice";
        if (adminAccessBox) adminAccessBox.style.display = "block";
        if (studentAccessBox) studentAccessBox.style.display = "none";
        if (registerBox) registerBox.style.display = "block";
        if (socialBox) socialBox.style.display = "block";
        if (roleBadge) {
            roleBadge.textContent = "STUDENT PORTAL";
            roleBadge.className = "role-badge student-badge";
            roleBadge.style.display = "inline-flex";
        }
    }
}

// Check URL params on load (e.g. login.html?role=admin)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "admin") {
        setRole("admin");
    } else {
        setRole("student");
    }
});


// =========================================================
// LOGIN
// =========================================================

async function login(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("loginMsg");

    if (!email || !password) {
        if (msg) {
            msg.textContent = "Please enter both email and password.";
            msg.className = "login-msg error-msg";
        }
        return;
    }

    if (msg) {
        msg.textContent = "Authenticating credentials...";
        msg.className = "login-msg info-msg";
    }

    try {
        const data = await API.login({
            email: email,
            password: password,
            role: selectedRole
        });

        if (data.success) {
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (msg) {
                msg.textContent = "Login verified. Redirecting...";
                msg.className = "login-msg success-msg";
            }

            setTimeout(() => {
                if (data.user.role === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "student.html";
                }
            }, 400);
        } else {
            if (msg) {
                msg.textContent = data.message || "Invalid credentials.";
                msg.className = "login-msg error-msg";
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        if (msg) {
            msg.textContent = "Unable to connect to server. Please try again.";
            msg.className = "login-msg error-msg";
        }
    }
}


// =========================================================
// PASSWORD
// =========================================================

function togglePassword(inputId = "password") {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
}


// =========================================================
// REGISTER
// =========================================================

async function registerUser(e) {

    e.preventDefault();


    const name =
        document
            .getElementById("regName")
            .value
            .trim();


    const email =
        document
            .getElementById("regEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("regPassword")
            .value
            .trim();


    const confirm =
        document
            .getElementById("regConfirm")
            .value
            .trim();


    const msg =
        document.getElementById("registerMsg");


    if (!name || !email || !password) {

        msg.textContent =
            "❌ All fields are required.";

        return;
    }


    if (password !== confirm) {

        msg.textContent =
            "❌ Passwords do not match.";

        return;
    }


    msg.textContent =
        "⏳ Creating account...";


    try {

        const data =
            await API.register({

                name: name,

                email: email,

                password: password

            });


        if (data.success) {

            msg.textContent =
                "✅ Account created successfully!";


            setTimeout(() => {

                window.location.href =
                    "login.html?role=student";

            }, 1000);

        }

        else {

            msg.textContent =
                "❌ " + data.message;
        }

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        msg.textContent =
            "❌ " +
            (
                error.message ||
                "Backend server is not connected."
            );
    }
}


// =========================================================
// ADMIN SECTION
// =========================================================

function showSection(id) {

    document
        .querySelectorAll(".dashboard-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    const section =
        document.getElementById(id);


    if (section) {

        section.classList.add("active");
    }


    document
        .querySelectorAll(".sidebar nav button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const buttons =
        document.querySelectorAll(
            ".sidebar nav button"
        );


    buttons.forEach(button => {

        if (
            button
                .getAttribute("onclick")
                ?.includes(`'${id}'`)
        ) {

            button.classList.add("active");
        }

    });


    const title =
        document.getElementById("pageTitle");


    if (title) {

        title.textContent =
            id.charAt(0).toUpperCase() +
            id.slice(1);
    }
}


// =========================================================
// STUDENT SECTION
// =========================================================

function showStudentSection(id) {

    document
        .querySelectorAll(".dashboard-section")
        .forEach(section => {

            section.classList.remove("active");

        });


    document
        .getElementById(id)
        ?.classList.add("active");


    document
        .querySelectorAll(".sidebar nav button")
        .forEach(button => {

            button.classList.remove("active");

        });


    document
        .querySelectorAll(".sidebar nav button")
        .forEach(button => {

        if (
            button
                .getAttribute("onclick")
                ?.includes(`'${id}'`)
        ) {

            button.classList.add("active");
        }

    });
}


// =========================================================
// MODALS
// =========================================================

function openModal(id) {

    document
        .getElementById(id)
        ?.classList.add("show");
}


function closeModal(id) {

    document
        .getElementById(id)
        ?.classList.remove("show");
}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    sessionStorage.removeItem("currentExam");

    sessionStorage.removeItem("lastResult");

    window.location.href =
        "login.html";
}


// =========================================================
// LOAD SUBJECTS
// =========================================================

async function loadSubjects() {

    try {

        const data =
            await API.getSubjects();

        const subjects =
            data.subjects || data;


        console.log(
            "Subjects:",
            subjects
        );


        const dropdowns = [

            document.getElementById("subject"),

            document.getElementById(
                "questionSubject"
            ),

            document.getElementById(
                "examSubject"
            ),

            document.getElementById(
                "subjectSelect"
            ),

            document.getElementById(
                "questionSubjectSelect"
            ),

            document.getElementById(
                "examSubjectSelect"
            )

        ].filter(Boolean);


        dropdowns.forEach(select => {

            const currentValue =
                select.value;


            select.innerHTML =
                '<option value="">Select Subject</option>';


            subjects.forEach(subject => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    subject.name;


                option.textContent =
                    subject.name;


                select.appendChild(option);

            });


            if (currentValue) {

                select.value =
                    currentValue;
            }

        });

    }

    catch (error) {

        console.error(
            "Failed to load subjects:",
            error
        );
    }
}


// =========================================================
// ADD SUBJECT
// =========================================================

async function addSubject() {

    const input =
        document.getElementById("subjectName") ||

        document.getElementById("newSubject") ||

        document.getElementById("subjectInput") ||

        document.getElementById(
            "newSubjectName"
        );


    if (!input) {

        console.error(
            "Subject input not found."
        );

        return;
    }


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Please enter subject name."
        );

        return;
    }


    try {

        const data =
            await API.addSubject({

                name: name

            });


        if (data.success) {

            alert(
                "✅ Subject added successfully!"
            );


            input.value = "";


            await loadSubjects();

        }

        else {

            alert(
                "❌ " + data.message
            );
        }

    }

    catch (error) {

        console.error(error);


        alert(
            "❌ " +
            (
                error.message ||
                "Failed to add subject"
            )
        );
    }
}


// =========================================================
// THEME MANAGEMENT (WHITE / LIGHT THEME DEFAULT)
// =========================================================

function initTheme() {
    const savedTheme = localStorage.getItem("es_theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
    updateThemeButtons(savedTheme);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme");
    const current = isDark ? "dark" : "light";
    localStorage.setItem("es_theme", current);
    updateThemeButtons(current);
}

function updateThemeButtons(theme) {
    const isDark = theme === "dark";
    const icon = isDark
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> <span>Light</span>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> <span>Dark</span>`;

    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
        btn.innerHTML = icon;
        btn.setAttribute("title", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
    });
}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initTheme();

        loadSubjects();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const role =
            params.get("role");


        if (
            role === "admin" ||
            role === "student"
        ) {

            setRole(role);
        }

    }
);
