let currentExam = null;
let questions = [];
let currentQuestionIndex = 0;
let answers = {};
let flaggedQuestions = new Set();
let visitedQuestions = new Set();
let timerInterval = null;
let remainingSeconds = 0;
let examSubmitted = false;

// Proctoring state
let tabSwitchCount = 0;
const MAX_STRIKES = 3;
let lastViolationTime = 0;

// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", async () => {
    const savedExam = sessionStorage.getItem("currentExam");

    if (!savedExam) {
        alert("No exam selected. Please select an exam from your dashboard.");
        window.location.href = "student.html";
        return;
    }

    try {
        currentExam = JSON.parse(savedExam);
        await loadExam();
    } catch (error) {
        console.error("Exam load error:", error);
        alert("Unable to load exam. Returning to student portal.");
        window.location.href = "student.html";
    }
});


// =========================================================
// LOAD EXAM DATA
// =========================================================

async function loadExam() {
    try {
        const data = await API.getExam(currentExam.id);

        if (!data.success) {
            throw new Error(data.message || "Exam data could not be retrieved.");
        }

        currentExam = data.exam;
        questions = data.questions || [];

        if (questions.length === 0) {
            alert("No questions are currently configured for this exam.");
            window.location.href = "student.html";
            return;
        }

        // Randomize questions order for anti-cheating
        shuffleArray(questions);

        // Reset state
        answers = {};
        flaggedQuestions.clear();
        visitedQuestions.clear();
        visitedQuestions.add(questions[0].id);

        sessionStorage.setItem("currentExam", JSON.stringify(currentExam));

        showExamInfo();
        renderQuestionNumbers();
        renderPalette();
        renderQuestion();
        updateProgress();
        startTimer();
        setupProctoring();

    } catch (error) {
        console.error("Load Exam Error:", error);
        alert(error.message || "An error occurred while loading the exam.");
        window.location.href = "student.html";
    }
}


// =========================================================
// DISPLAY EXAM INFO
// =========================================================

function showExamInfo() {
    const title = document.getElementById("examTitle");
    const subjectLabel = document.getElementById("examSubjectLabel");
    const heading = document.getElementById("examSubjectHeading");

    if (title) title.textContent = currentExam.name;
    if (subjectLabel) subjectLabel.textContent = (currentExam.subject || "EXAM").toUpperCase();
    if (heading) heading.textContent = currentExam.name;
}


// =========================================================
// RENDER ACTIVE QUESTION
// =========================================================

function renderQuestion() {
    if (!questions.length) return;

    const question = questions[currentQuestionIndex];
    visitedQuestions.add(question.id);

    const card = document.getElementById("questionCard");
    const position = document.getElementById("questionPosition");
    const marksBadge = document.getElementById("questionMarksBadge");
    const flagBtn = document.getElementById("flagBtn");

    if (position) {
        position.textContent = `QUESTION ${currentQuestionIndex + 1} OF ${questions.length}`;
    }

    if (marksBadge) {
        marksBadge.textContent = `+${question.marks || 1} Mark${(question.marks || 1) > 1 ? 's' : ''}`;
    }

    // Update flag button label and state
    if (flagBtn) {
        if (flaggedQuestions.has(question.id)) {
            flagBtn.classList.add("active");
            flagBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> <span>Unmark Review</span>`;
        } else {
            flagBtn.classList.remove("active");
            flagBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> <span>Mark for Review</span>`;
        }
    }

    if (!card) return;

    const selectedAnswer = answers[question.id] || "";

    card.innerHTML = `
        <div class="question-content">
            <div class="question-number">Question ${currentQuestionIndex + 1}</div>
            <h2>${escapeHTML(question.question)}</h2>
            <div class="options">
                ${createOption(question, "A", question.option_a, selectedAnswer)}
                ${createOption(question, "B", question.option_b, selectedAnswer)}
                ${createOption(question, "C", question.option_c, selectedAnswer)}
                ${createOption(question, "D", question.option_d, selectedAnswer)}
            </div>
        </div>
    `;

    updateNavigationButtons();
    renderPalette();
}


function createOption(question, letter, text, selectedAnswer) {
    const checked = selectedAnswer === letter ? "checked" : "";
    const isSelectedClass = selectedAnswer === letter ? "selected" : "";

    return `
        <label class="exam-option ${isSelectedClass}">
            <input
                type="radio"
                name="question_${question.id}"
                value="${letter}"
                ${checked}
                onchange="selectAnswer(${question.id}, '${letter}')"
            >
            <span class="option-letter">${letter}</span>
            <span class="option-text">${escapeHTML(text)}</span>
        </label>
    `;
}


// =========================================================
// USER ACTIONS: ANSWER, CLEAR, REVIEW
// =========================================================

function selectAnswer(questionId, letter) {
    answers[questionId] = letter;
    updateProgress();
    renderPalette();

    // Re-render option highlight
    document.querySelectorAll(".exam-option").forEach(opt => opt.classList.remove("selected"));
    const selectedInput = document.querySelector(`input[name="question_${questionId}"][value="${letter}"]`);
    if (selectedInput) {
        selectedInput.closest(".exam-option")?.classList.add("selected");
    }
}

function clearAnswer() {
    const question = questions[currentQuestionIndex];
    if (!question) return;

    if (answers[question.id]) {
        delete answers[question.id];
        renderQuestion();
        updateProgress();
        renderPalette();
    }
}

function toggleMarkForReview() {
    const question = questions[currentQuestionIndex];
    if (!question) return;

    if (flaggedQuestions.has(question.id)) {
        flaggedQuestions.delete(question.id);
    } else {
        flaggedQuestions.add(question.id);
    }

    renderQuestion();
    renderPalette();
}


// =========================================================
// NAVIGATION
// =========================================================

function goNext() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        updateProgress();
    }
}

function goPrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        updateProgress();
    }
}

function goToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        currentQuestionIndex = index;
        renderQuestion();
        updateProgress();
    }
}

function renderQuestionNumbers() {
    const container = document.getElementById("qNumbers");
    if (!container) return;

    container.innerHTML = "";
    questions.forEach((question, index) => {
        const button = document.createElement("button");
        button.className = "q-number";
        button.textContent = index + 1;
        button.onclick = () => goToQuestion(index);
        container.appendChild(button);
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }

    if (nextBtn) {
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.textContent = "Finish & Review";
            nextBtn.onclick = () => openSubmitModal();
        } else {
            nextBtn.textContent = "Save & Next →";
            nextBtn.onclick = () => goNext();
        }
    }
}


// =========================================================
// PALETTE RENDERING (5 Distinct States)
// =========================================================

function renderPalette() {
    const container = document.getElementById("paletteGrid");
    if (!container) return;

    container.innerHTML = "";

    questions.forEach((question, index) => {
        const button = document.createElement("button");
        button.textContent = index + 1;
        button.classList.add("palette-number");

        const isAnswered = Boolean(answers[question.id]);
        const isFlagged = flaggedQuestions.has(question.id);
        const isCurrent = index === currentQuestionIndex;

        if (isAnswered && isFlagged) {
            button.classList.add("answered-flagged");
        } else if (isFlagged) {
            button.classList.add("flagged");
        } else if (isAnswered) {
            button.classList.add("answered");
        } else if (visitedQuestions.has(question.id)) {
            button.classList.add("visited");
        }

        if (isCurrent) {
            button.classList.add("current");
        }

        button.onclick = () => goToQuestion(index);
        container.appendChild(button);
    });
}


// =========================================================
// PROGRESS TRACKER
// =========================================================

function updateProgress() {
    const total = questions.length;
    const answered = Object.keys(answers).length;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    const progressPct = document.getElementById("progressPct");
    const progressText = document.getElementById("progressText");

    if (progressPct) progressPct.textContent = `${percentage}%`;
    if (progressText) progressText.textContent = `${answered} of ${total} answered`;
}


// =========================================================
// TIMER LOGIC
// =========================================================

function startTimer() {
    clearInterval(timerInterval);
    const duration = Number(currentExam.duration) || 15;
    remainingSeconds = duration * 60;

    updateTimerDisplay();

    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();

        // 2-minute and 30-second warnings
        const timerBadge = document.getElementById("timerBadge");
        if (remainingSeconds <= 30 && remainingSeconds > 0) {
            timerBadge?.classList.add("timer-danger");
        } else if (remainingSeconds <= 120 && remainingSeconds > 0) {
            timerBadge?.classList.add("timer-warning");
        }

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            remainingSeconds = 0;
            updateTimerDisplay();
            autoSubmitOnTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timer = document.getElementById("timer");
    if (!timer) return;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// =========================================================
// FULLSCREEN TOGGLE
// =========================================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn("Fullscreen request error:", err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


// =========================================================
// SUBMIT EXAM & CONFIRMATION MODAL
// =========================================================

function openSubmitModal() {
    const total = questions.length;
    const answered = Object.keys(answers).length;
    const unanswered = total - answered;
    const flagged = flaggedQuestions.size;

    document.getElementById("modalTotalQ").textContent = total;
    document.getElementById("modalAnsweredQ").textContent = answered;
    document.getElementById("modalUnansweredQ").textContent = unanswered;
    document.getElementById("modalFlaggedQ").textContent = flagged;

    document.getElementById("submitConfirmModal")?.classList.add("show");
}

function closeSubmitModal() {
    document.getElementById("submitConfirmModal")?.classList.remove("show");
}

function autoSubmitOnTimeUp() {
    alert("⏰ Time is up! Your examination will now be automatically submitted.");
    confirmFinalSubmit();
}

async function confirmFinalSubmit() {
    if (examSubmitted) return;
    examSubmitted = true;
    clearInterval(timerInterval);
    closeSubmitModal();

    const user = getCurrentUser();
    if (!user) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return;
    }

    try {
        const data = await API.submitExam(currentExam.id, {
            student_id: user.id,
            answers: answers
        });

        if (!data.success) {
            throw new Error(data.message || "Failed to submit exam.");
        }

        const result = data.result;

        // Persist result and review in storage
        sessionStorage.setItem("lastResult", JSON.stringify(result));
        if (result.review) {
            sessionStorage.setItem("lastReview", JSON.stringify(result.review));
        }
        sessionStorage.removeItem("currentExam");

        // Redirect to detailed result review page
        const redirectUrl = `result.html?exam=${encodeURIComponent(result.exam_name || currentExam.name)}&score=${result.score}&total=${result.total_marks}&correct=${result.correct}&totalQuestions=${result.total_questions || questions.length}`;
        window.location.href = redirectUrl;

    } catch (error) {
        console.error("Submission Error:", error);
        examSubmitted = false;
        alert("Submission failed: " + (error.message || "Please check your network and try again."));
    }
}


// =========================================================
// HELPERS
// =========================================================

function escapeHTML(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ---------------- PROCTORING & ANTI-CHEATING ----------------

function setupProctoring() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && !examSubmitted) {
            triggerProctorViolation();
        }
    });

    window.addEventListener("blur", () => {
        if (!examSubmitted) {
            triggerProctorViolation();
        }
    });
}

function triggerProctorViolation() {
    if (examSubmitted) return;
    const now = Date.now();
    if (now - lastViolationTime < 1800) return; // Debounce 1.8s
    lastViolationTime = now;

    tabSwitchCount++;
    const strikeEl = document.getElementById("strikeCounter");
    if (strikeEl) strikeEl.textContent = `Warning ${tabSwitchCount} of ${MAX_STRIKES}`;

    const modal = document.getElementById("proctorWarningModal");
    if (modal) modal.style.display = "flex";

    if (tabSwitchCount >= MAX_STRIKES) {
        setTimeout(() => {
            alert("Security Protocol: Maximum allowed 3 proctoring violations recorded. Your exam is being automatically submitted now.");
            confirmFinalSubmit();
        }, 1200);
    }
}

function dismissProctorWarning() {
    const modal = document.getElementById("proctorWarningModal");
    if (modal) modal.style.display = "none";
}

window.addEventListener("beforeunload", (event) => {
    if (questions.length > 0 && !examSubmitted) {
        event.preventDefault();
        event.returnValue = "";
    }
});
