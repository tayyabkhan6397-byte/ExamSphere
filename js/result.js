let fullReviewData = [];

document.addEventListener("DOMContentLoaded", () => {
    const user = requireRole("student");
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    let lastResult = null;
    let storedReview = null;

    try {
        lastResult = JSON.parse(sessionStorage.getItem("lastResult") || "null");
        storedReview = JSON.parse(sessionStorage.getItem("lastReview") || "null");
    } catch (e) {
        console.warn("Storage parse error:", e);
    }

    const examName = params.get("exam") || (lastResult && (lastResult.exam_name || lastResult.name)) || "Online Examination";
    const score = params.has("score") ? Number(params.get("score")) : (lastResult ? Number(lastResult.score) : 0);
    const total = params.has("total") ? Number(params.get("total")) : (lastResult ? Number(lastResult.total_marks) : 1);
    const correct = params.has("correct") ? Number(params.get("correct")) : (lastResult ? Number(lastResult.correct) : 0);
    const totalQuestions = params.has("totalQuestions") ? Number(params.get("totalQuestions")) : (lastResult ? Number(lastResult.total_questions || lastResult.attempted) : 0);
    const wrong = lastResult && lastResult.wrong !== undefined ? Number(lastResult.wrong) : Math.max(0, totalQuestions - correct);

    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= 40;

    // Determine Grade
    let gradeText = "GRADE F (FAILED)";
    let gradeClass = "grade-f";
    if (pct >= 90) {
        gradeText = "GRADE A+ (OUTSTANDING)";
        gradeClass = "grade-aplus";
    } else if (pct >= 75) {
        gradeText = "GRADE A (EXCELLENT)";
        gradeClass = "grade-a";
    } else if (pct >= 60) {
        gradeText = "GRADE B (VERY GOOD)";
        gradeClass = "grade-b";
    } else if (pct >= 40) {
        gradeText = "GRADE C (PASSED)";
        gradeClass = "grade-c";
    }

    // Set UI elements
    const elExamName = document.getElementById("resultExamName");
    const elIcon = document.getElementById("resultIcon");
    const elGrade = document.getElementById("gradeBadge");
    const elScore = document.getElementById("finalScore");
    const elScoreTotal = document.getElementById("finalScoreTotal");
    const elPct = document.getElementById("percentage");
    const elCorrect = document.getElementById("statCorrect");
    const elWrong = document.getElementById("statWrong");
    const elTotalQ = document.getElementById("statTotalQuestions");
    const elStatPct = document.getElementById("statPercentage");
    const elMsg = document.getElementById("resultMessage");
    const downloadBtn = document.getElementById("downloadCertBtn");

    if (elExamName) elExamName.textContent = examName;
    if (elIcon) {
        elIcon.innerHTML = passed
            ? `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`
            : `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    }
    if (elGrade) {
        elGrade.textContent = gradeText;
        elGrade.className = `grade-pill-badge ${gradeClass}`;
    }
    if (elScore) elScore.textContent = score;
    if (elScoreTotal) elScoreTotal.textContent = `/ ${total} Marks`;
    if (elPct) elPct.textContent = `${pct}%`;

    if (elCorrect) elCorrect.textContent = correct;
    if (elWrong) elWrong.textContent = wrong;
    if (elTotalQ) elTotalQ.textContent = totalQuestions;
    if (elStatPct) elStatPct.textContent = `${pct}%`;

    if (elMsg) {
        elMsg.textContent = passed
            ? "Congratulations! You have successfully passed this examination. Your verified report and certificate are available."
            : "Examination completed. Review your weak areas below and attempt again to achieve a passing grade.";
    }

    // Activate Certificate if passed
    const banner = document.getElementById("certAvailableBanner");
    const bannerPct = document.getElementById("bannerPct");

    if (passed) {
        if (downloadBtn) downloadBtn.style.display = "inline-flex";
        if (banner) banner.style.display = "flex";
        if (bannerPct) bannerPct.textContent = `${pct}%`;

        // Setup Certificate details
        const elStudentName = document.getElementById("certStudentName");
        const elExam = document.getElementById("certExamName");
        const elSc = document.getElementById("certScore");
        const elP = document.getElementById("certPercentage");
        const elDt = document.getElementById("certDate");
        const elId = document.getElementById("certId");

        if (elStudentName) elStudentName.textContent = user.name || "Candidate";
        if (elExam) elExam.textContent = examName;
        if (elSc) elSc.textContent = `${score} / ${total}`;
        if (elP) elP.textContent = `${pct}%`;

        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (elDt) elDt.textContent = today.toLocaleDateString("en-US", options);
        if (elId) elId.textContent = `ESP-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

        // Direct Certificate Trigger if requested via URL
        if (params.get("cert") === "1") {
            setTimeout(() => {
                openCertificateModal();
            }, 300);
        }
    }

    // Load detailed review
    if (storedReview && Array.isArray(storedReview)) {
        fullReviewData = storedReview;
        renderReviewList(fullReviewData);
    } else if (lastResult && lastResult.review && Array.isArray(lastResult.review)) {
        fullReviewData = lastResult.review;
        renderReviewList(fullReviewData);
    } else {
        const container = document.getElementById("reviewListContainer");
        if (container) {
            container.innerHTML = `<p class="text-muted">No individual question review data was recorded for this attempt.</p>`;
        }
    }
});


// =========================================================
// CERTIFICATE MODAL
// =========================================================

function openCertificateModal() {
    const modal = document.getElementById("certificateModal");
    if (modal) modal.style.display = "flex";
}

function closeCertificateModal() {
    const modal = document.getElementById("certificateModal");
    if (modal) modal.style.display = "none";
}


// =========================================================
// RENDER DETAILED QUESTION-BY-QUESTION REVIEW
// =========================================================

function renderReviewList(items) {
    const container = document.getElementById("reviewListContainer");
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `<p class="text-muted">No questions found for the selected filter.</p>`;
        return;
    }

    container.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("div");
        const isAnswered = item.user_answer !== null && item.user_answer !== undefined;
        const isCorrect = item.is_correct;

        let statusBadge = "";
        let cardBorderClass = "";

        if (!isAnswered) {
            statusBadge = `<span class="review-status-badge skipped">Skipped</span>`;
            cardBorderClass = "border-skipped";
        } else if (isCorrect) {
            statusBadge = `<span class="review-status-badge correct">Correct (+${item.marks || 1})</span>`;
            cardBorderClass = "border-correct";
        } else {
            statusBadge = `<span class="review-status-badge wrong">Incorrect</span>`;
            cardBorderClass = "border-wrong";
        }

        card.className = `review-q-card ${cardBorderClass}`;

        card.innerHTML = `
            <div class="review-q-header">
                <span class="q-index-pill">Question ${index + 1}</span>
                ${statusBadge}
            </div>

            <h3 class="review-q-text">${escapeHTML(item.question)}</h3>

            <div class="review-options-grid">
                ${renderReviewOption("A", item.option_a, item.user_answer, item.correct_answer)}
                ${renderReviewOption("B", item.option_b, item.user_answer, item.correct_answer)}
                ${renderReviewOption("C", item.option_c, item.user_answer, item.correct_answer)}
                ${renderReviewOption("D", item.option_d, item.user_answer, item.correct_answer)}
            </div>

            ${item.explanation ? `
                <div class="explanation-box">
                    <b>Explanation & Solution:</b>
                    <p>${escapeHTML(item.explanation)}</p>
                </div>
            ` : ""}
        `;

        container.appendChild(card);
    });
}

function renderReviewOption(letter, text, userChoice, correctChoice) {
    const isChosen = userChoice === letter;
    const isCorrect = correctChoice === letter;

    let optionClass = "review-opt";
    let badge = "";

    if (isCorrect && isChosen) {
        optionClass += " opt-correct-chosen";
        badge = `<span class="opt-tag tag-correct">Your Choice (Correct)</span>`;
    } else if (isCorrect) {
        optionClass += " opt-correct";
        badge = `<span class="opt-tag tag-correct">Correct Option</span>`;
    } else if (isChosen) {
        optionClass += " opt-wrong";
        badge = `<span class="opt-tag tag-wrong">Your Choice (Incorrect)</span>`;
    }

    return `
        <div class="${optionClass}">
            <span class="opt-letter">${letter}</span>
            <span class="opt-label">${escapeHTML(text)}</span>
            ${badge}
        </div>
    `;
}


// =========================================================
// FILTER REVIEW BY STATUS
// =========================================================

function filterReview(type) {
    document.querySelectorAll(".filter-pill").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    if (type === "all") {
        renderReviewList(fullReviewData);
    } else if (type === "correct") {
        renderReviewList(fullReviewData.filter(q => q.is_correct));
    } else if (type === "wrong") {
        renderReviewList(fullReviewData.filter(q => q.user_answer && !q.is_correct));
    } else if (type === "unanswered") {
        renderReviewList(fullReviewData.filter(q => !q.user_answer));
    }
}

function escapeHTML(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
