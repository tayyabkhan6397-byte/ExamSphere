/* =========================================
   EXAMSPHERE ADMIN DASHBOARD CONTROLLER
========================================= */

let cachedQuestions = [];

document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
    loadSubjects();
    loadQuestions();
    loadExams();
    loadResults();
});


// =========================================
// SUBJECTS
// =========================================

async function loadSubjects() {
    try {
        const data = await API.getSubjects();
        const subjects = data.subjects || [];

        const grid = document.getElementById("subjectGrid");
        if (grid) {
            grid.innerHTML = "";
            if (subjects.length === 0) {
                grid.innerHTML = `<p class="text-muted">No subjects configured yet.</p>`;
            } else {
                subjects.forEach(subject => {
                    const card = document.createElement("div");
                    card.className = "subject-card";
                    card.innerHTML = `
                        <div class="sub-icon">📚</div>
                        <b>${escapeHTML(subject.name)}</b>
                        <small>Academic Discipline</small>
                    `;
                    grid.appendChild(card);
                });
            }
        }

        updateSubjectDropdowns(subjects);

    } catch (error) {
        console.error("Failed to load subjects:", error);
        const grid = document.getElementById("subjectGrid");
        if (grid) {
            grid.innerHTML = `<p style="color:red;">❌ Failed to load subjects.</p>`;
        }
    }
}


function updateSubjectDropdowns(subjects) {
    const questionSelect = document.getElementById("questionSubjectSelect");
    const examSelect = document.getElementById("examSubjectSelect");
    const filterSelect = document.getElementById("adminQuestionSubjectFilter");
    const editSubjectSelect = document.getElementById("editQuestionSubject");

    [questionSelect, editSubjectSelect].forEach(sel => {
        if (sel) {
            sel.innerHTML = `<option value="">Select Subject</option>`;
            subjects.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s.name;
                opt.textContent = s.name;
                sel.appendChild(opt);
            });
        }
    });

    if (examSelect) {
        examSelect.innerHTML = `<option value="">Select Subject</option>`;
        subjects.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.name;
            opt.textContent = s.name;
            examSelect.appendChild(opt);
        });
    }

    if (filterSelect) {
        filterSelect.innerHTML = `<option value="all">All Subjects</option>`;
        subjects.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.name;
            opt.textContent = s.name;
            filterSelect.appendChild(opt);
        });
    }
}


async function handleAddSubject(event) {
    event.preventDefault();
    const input = document.getElementById("newSubjectName");
    const msg = document.getElementById("subjectMsg");
    if (!input) return;

    const name = input.value.trim();
    if (!name) {
        if (msg) msg.textContent = "❌ Please enter a subject name.";
        return;
    }

    if (msg) msg.textContent = "⏳ Adding subject...";

    try {
        const data = await API.addSubject({ name });
        if (data.success) {
            if (msg) msg.textContent = "✅ Subject added successfully!";
            input.value = "";
            await loadSubjects();
            setTimeout(() => {
                closeModal("subjectModal");
                if (msg) msg.textContent = "";
            }, 800);
        } else {
            if (msg) msg.textContent = "❌ " + (data.message || "Failed to add subject.");
        }
    } catch (error) {
        console.error("Add subject error:", error);
        if (msg) msg.textContent = "❌ " + (error.message || "Failed to add subject.");
    }
}


// =========================================
// QUESTIONS REPOSITORY
// =========================================

async function loadQuestions() {
    try {
        const data = await API.getQuestions();
        cachedQuestions = data.questions || [];

        const statQ = document.getElementById("statQuestions");
        if (statQ) statQ.textContent = cachedQuestions.length;

        updateQuestionMetrics(cachedQuestions);
        renderAdminQuestions(cachedQuestions);

    } catch (error) {
        console.error("Failed to load questions:", error);
        const grid = document.getElementById("questionGrid");
        if (grid) grid.innerHTML = `<p style="color:red;">❌ Failed to load questions.</p>`;
    }
}

function updateQuestionMetrics(questions) {
    const easy = questions.filter(q => (q.difficulty || "Medium").toLowerCase() === "easy").length;
    const medium = questions.filter(q => (q.difficulty || "Medium").toLowerCase() === "medium").length;
    const hard = questions.filter(q => (q.difficulty || "Medium").toLowerCase() === "hard").length;

    const me = document.getElementById("metricEasy");
    const mm = document.getElementById("metricMedium");
    const mh = document.getElementById("metricHard");
    const mt = document.getElementById("metricTotal");

    if (me) me.textContent = easy;
    if (mm) mm.textContent = medium;
    if (mh) mh.textContent = hard;
    if (mt) mt.textContent = questions.length;
}

function renderAdminQuestions(questions) {
    const grid = document.getElementById("questionGrid");
    if (!grid) return;

    grid.innerHTML = "";

    if (questions.length === 0) {
        grid.innerHTML = "<p class='text-muted'>No questions match your criteria.</p>";
        return;
    }

    questions.forEach(q => {
        const diffClass = (q.difficulty || "medium").toLowerCase();
        const diffLabel = q.difficulty || "Medium";

        const card = document.createElement("div");
        card.className = "question-card";
        card.innerHTML = `
            <div class="q-card-top">
                <span class="subject-badge">${escapeHTML(q.subject)}</span>
                <span class="diff-badge ${diffClass}">${escapeHTML(diffLabel)}</span>
                <span class="marks-badge">${q.marks || 1} Marks</span>
            </div>

            <h3>${escapeHTML(q.question)}</h3>

            <div class="options-preview">
                <p><b>A:</b> ${escapeHTML(q.option_a)}</p>
                <p><b>B:</b> ${escapeHTML(q.option_b)}</p>
                <p><b>C:</b> ${escapeHTML(q.option_c)}</p>
                <p><b>D:</b> ${escapeHTML(q.option_d)}</p>
            </div>

            <div class="correct-answer-banner">
                ✓ Correct Option: <b>${escapeHTML(q.correct_answer)}</b>
            </div>

            ${q.explanation ? `<p class="q-expl-preview">💡 <i>${escapeHTML(q.explanation)}</i></p>` : ""}

            <div class="q-actions">
                <button onclick="openEditQuestionModal(${q.id})" class="btn-sm-edit">
                    ✏️ Edit
                </button>
                <button onclick="deleteQuestion(${q.id})" class="btn-sm-danger">
                    🗑 Delete
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterAdminQuestions() {
    const query = (document.getElementById("adminQuestionSearch")?.value || "").toLowerCase().trim();
    const selectedSub = document.getElementById("adminQuestionSubjectFilter")?.value || "all";
    const selectedDiff = document.getElementById("adminQuestionDiffFilter")?.value || "all";

    const filtered = cachedQuestions.filter(q => {
        const matchesSub = selectedSub === "all" || q.subject.toLowerCase() === selectedSub.toLowerCase();
        const matchesDiff = selectedDiff === "all" || (q.difficulty || "Medium").toLowerCase() === selectedDiff.toLowerCase();
        const matchesQuery = !query ||
            q.question.toLowerCase().includes(query) ||
            q.subject.toLowerCase().includes(query);
        return matchesSub && matchesDiff && matchesQuery;
    });

    renderAdminQuestions(filtered);
}


async function handleAddQuestion(event) {
    event.preventDefault();

    const subject = document.getElementById("questionSubjectSelect")?.value || "";
    const question = document.getElementById("questionText")?.value.trim() || "";
    const optionA = document.getElementById("optionA")?.value.trim() || "";
    const optionB = document.getElementById("optionB")?.value.trim() || "";
    const optionC = document.getElementById("optionC")?.value.trim() || "";
    const optionD = document.getElementById("optionD")?.value.trim() || "";
    const correctAnswer = document.getElementById("correctAnswer")?.value || "";
    const marks = Number(document.getElementById("questionMarks")?.value) || 1;
    const difficulty = document.getElementById("questionDifficulty")?.value || "Medium";
    const explanation = document.getElementById("questionExplanation")?.value.trim() || "";
    const msg = document.getElementById("questionMsg");

    if (!subject || !question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
        if (msg) msg.textContent = "❌ Please complete all required question fields.";
        return;
    }

    if (msg) msg.textContent = "⏳ Saving question...";

    try {
        const data = await API.addQuestion({
            subject,
            question,
            option_a: optionA,
            option_b: optionB,
            option_c: optionC,
            option_d: optionD,
            correct_answer: correctAnswer,
            explanation,
            marks,
            difficulty
        });

        if (data.success) {
            if (msg) msg.textContent = "✅ Question added successfully!";
            document.getElementById("questionForm")?.reset();
            await loadQuestions();
            setTimeout(() => {
                closeModal("questionModal");
                if (msg) msg.textContent = "";
            }, 800);
        } else {
            if (msg) msg.textContent = "❌ " + (data.message || "Failed to add question.");
        }
    } catch (error) {
        console.error("Add question error:", error);
        if (msg) msg.textContent = "❌ " + (error.message || "Failed to add question.");
    }
}


// =========================================
// EDIT QUESTION
// =========================================

function openEditQuestionModal(id) {
    const q = cachedQuestions.find(x => x.id === id);
    if (!q) return;

    document.getElementById("editQuestionId").value = q.id;
    document.getElementById("editQuestionText").value = q.question;
    document.getElementById("editOptionA").value = q.option_a;
    document.getElementById("editOptionB").value = q.option_b;
    document.getElementById("editOptionC").value = q.option_c;
    document.getElementById("editOptionD").value = q.option_d;
    document.getElementById("editCorrectAnswer").value = q.correct_answer;
    document.getElementById("editQuestionMarks").value = q.marks || 1;
    document.getElementById("editQuestionDifficulty").value = q.difficulty || "Medium";
    document.getElementById("editQuestionExplanation").value = q.explanation || "";

    // Set subject select
    const subjSel = document.getElementById("editQuestionSubject");
    if (subjSel) {
        // populate if empty
        if (subjSel.options.length <= 1) {
            API.getSubjects().then(d => {
                (d.subjects || []).forEach(s => {
                    const opt = document.createElement("option");
                    opt.value = s.name;
                    opt.textContent = s.name;
                    subjSel.appendChild(opt);
                });
                subjSel.value = q.subject;
            });
        } else {
            subjSel.value = q.subject;
        }
    }

    const msg = document.getElementById("editQuestionMsg");
    if (msg) msg.textContent = "";

    openModal("editQuestionModal");
}


async function handleEditQuestion(event) {
    event.preventDefault();

    const id = Number(document.getElementById("editQuestionId")?.value);
    const subject = document.getElementById("editQuestionSubject")?.value || "";
    const question = document.getElementById("editQuestionText")?.value.trim() || "";
    const optionA = document.getElementById("editOptionA")?.value.trim() || "";
    const optionB = document.getElementById("editOptionB")?.value.trim() || "";
    const optionC = document.getElementById("editOptionC")?.value.trim() || "";
    const optionD = document.getElementById("editOptionD")?.value.trim() || "";
    const correctAnswer = document.getElementById("editCorrectAnswer")?.value || "";
    const marks = Number(document.getElementById("editQuestionMarks")?.value) || 1;
    const difficulty = document.getElementById("editQuestionDifficulty")?.value || "Medium";
    const explanation = document.getElementById("editQuestionExplanation")?.value.trim() || "";
    const msg = document.getElementById("editQuestionMsg");

    if (!subject || !question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
        if (msg) msg.textContent = "❌ Please fill all required fields.";
        return;
    }

    if (msg) msg.textContent = "⏳ Saving changes...";

    try {
        const data = await API.updateQuestion(id, {
            subject, question,
            option_a: optionA, option_b: optionB,
            option_c: optionC, option_d: optionD,
            correct_answer: correctAnswer,
            explanation, marks, difficulty
        });

        if (data.success) {
            if (msg) msg.textContent = "✅ Question updated!";
            await loadQuestions();
            setTimeout(() => {
                closeModal("editQuestionModal");
                if (msg) msg.textContent = "";
            }, 800);
        } else {
            if (msg) msg.textContent = "❌ " + (data.message || "Failed to update.");
        }
    } catch (error) {
        console.error("Edit question error:", error);
        if (msg) msg.textContent = "❌ " + (error.message || "Failed to update.");
    }
}


// =========================================
// DELETE QUESTION
// =========================================

async function deleteQuestion(id) {
    if (!confirm("Are you sure you want to permanently delete this question?")) return;

    try {
        const data = await API.deleteQuestion(id);
        if (data.success) {
            alert("✅ Question deleted successfully!");
            await loadQuestions();
        } else {
            alert("❌ " + (data.message || "Failed to delete question."));
        }
    } catch (error) {
        console.error(error);
        alert("❌ Failed to delete question.");
    }
}


// =========================================
// IMPORT / EXPORT QUESTIONS
// =========================================

function exportQuestions() {
    if (cachedQuestions.length === 0) {
        alert("No questions to export.");
        return;
    }

    const exportData = cachedQuestions.map(q => ({
        subject: q.subject,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        marks: q.marks || 1,
        difficulty: q.difficulty || "Medium",
        explanation: q.explanation || ""
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `examsphere_questions_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function importQuestionsFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            const questions = Array.isArray(parsed) ? parsed : parsed.questions;

            if (!questions || !Array.isArray(questions)) {
                alert("❌ Invalid JSON format. Expected an array of questions.");
                return;
            }

            if (questions.length === 0) {
                alert("❌ JSON file is empty.");
                return;
            }

            if (!confirm(`Import ${questions.length} question(s) into the question bank?`)) return;

            const data = await API.importQuestions({ questions });
            if (data.success) {
                alert(`✅ Successfully imported ${data.imported || questions.length} question(s)!`);
                await loadQuestions();
            } else {
                alert("❌ Import failed: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            alert("❌ Failed to parse JSON file. Please check the file format.");
            console.error(err);
        }
    };
    reader.readAsText(file);

    // Reset so same file can be re-imported
    event.target.value = "";
}


// =========================================
// STUDENTS
// =========================================

async function loadStudents() {
    try {
        const data = await API.getStudents();
        const students = data.students || [];

        const body = document.getElementById("studentsBody");
        const stat = document.getElementById("statStudents");

        if (stat) stat.textContent = students.length;
        if (!body) return;

        body.innerHTML = "";

        if (students.length === 0) {
            body.innerHTML = `<tr><td colspan="3">No students found.</td></tr>`;
            return;
        }

        students.forEach(student => {
            body.innerHTML += `
                <tr>
                    <td><b>${escapeHTML(student.name)}</b></td>
                    <td>${escapeHTML(student.email || "")}</td>
                    <td><span class="status completed">Active Enrolled</span></td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Failed to load students:", error);
    }
}


// =========================================
// EXAMS
// =========================================

async function loadExams() {
    try {
        const data = await API.getExams();
        const exams = data.exams || [];

        const grid = document.getElementById("examAdminGrid");
        const stat = document.getElementById("statExams");
        const recentBody = document.getElementById("recentExamsBody");

        if (stat) stat.textContent = exams.length;

        if (recentBody) {
            recentBody.innerHTML = "";
            if (exams.length === 0) {
                recentBody.innerHTML = `<tr><td colspan="4">No exams created yet.</td></tr>`;
            } else {
                exams.slice(0, 6).forEach(exam => {
                    recentBody.innerHTML += `
                        <tr>
                            <td><b>${escapeHTML(exam.name)}</b></td>
                            <td><span class="subject-badge">${escapeHTML(exam.subject)}</span></td>
                            <td>${exam.num_questions}</td>
                            <td><b>${exam.total_marks} pts</b></td>
                        </tr>
                    `;
                });
            }
        }

        if (!grid) return;
        grid.innerHTML = "";

        if (exams.length === 0) {
            grid.innerHTML = "<p class='text-muted'>No exams available.</p>";
            return;
        }

        exams.forEach(exam => {
            const diffClass = (exam.difficulty || "Intermediate").toLowerCase();
            grid.innerHTML += `
                <div class="admin-exam-card">
                    <div class="exam-card-header">
                        <span class="subject-badge">${escapeHTML(exam.subject)}</span>
                        <span class="diff-badge ${diffClass}">${escapeHTML(exam.difficulty || "Intermediate")}</span>
                    </div>

                    <h3>${escapeHTML(exam.name)}</h3>

                    <div class="exam-details-list">
                        <div><span>⏱ Duration:</span> <b>${exam.duration} Min</b></div>
                        <div><span>📝 Qs:</span> <b>${exam.num_questions}</b></div>
                        <div><span>🎯 Marks:</span> <b>${exam.total_marks}</b></div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Failed to load exams:", error);
    }
}


async function handleCreateExam(event) {
    event.preventDefault();

    const name = document.getElementById("examName")?.value.trim() || "";
    const subject = document.getElementById("examSubjectSelect")?.value || "";
    const difficulty = document.getElementById("examDifficulty")?.value || "Intermediate";
    const numQuestions = Number(document.getElementById("examNumQuestions")?.value) || 0;
    const totalMarks = Number(document.getElementById("examTotalMarks")?.value) || 0;
    const duration = Number(document.getElementById("examDuration")?.value) || 0;
    const msg = document.getElementById("examMsg");

    if (!name || !subject || numQuestions <= 0 || totalMarks <= 0 || duration <= 0) {
        if (msg) msg.textContent = "❌ Please provide valid exam parameters.";
        return;
    }

    if (msg) msg.textContent = "⏳ Creating exam...";

    try {
        const data = await API.createExam({
            name,
            subject,
            difficulty,
            num_questions: numQuestions,
            total_marks: totalMarks,
            duration
        });

        if (data.success) {
            if (msg) msg.textContent = "✅ Exam created successfully!";
            document.getElementById("examForm")?.reset();
            await loadExams();
            setTimeout(() => {
                closeModal("examModal");
                if (msg) msg.textContent = "";
            }, 800);
        } else {
            if (msg) msg.textContent = "❌ " + (data.message || "Failed to create exam.");
        }
    } catch (error) {
        console.error("Create exam error:", error);
        if (msg) msg.textContent = "❌ " + (error.message || "Failed to create exam.");
    }
}


// =========================================
// RESULTS & ANALYTICS
// =========================================

async function loadResults() {
    try {
        const data = await API.getResults();
        const results = data.results || [];
        const body = document.getElementById("resultsBody");

        const statTotal = document.getElementById("statTotalAttempts");
        const statCompleted = document.getElementById("statCompleted");
        const statPassed = document.getElementById("statPassed");
        const statAvg = document.getElementById("statAvgScore");
        const statTop = document.getElementById("statTopScore");
        const circleAvg = document.getElementById("avgScoreCircle");
        const analyticsAvg = document.getElementById("analyticsAvg");
        const analyticsAvgBar = document.getElementById("analyticsAvgBar");
        const analyticsPass = document.getElementById("analyticsPassRate");
        const analyticsPassBar = document.getElementById("analyticsPassBar");

        let passedCount = 0;
        let totalPct = 0;
        let topPct = 0;

        if (results && results.length > 0) {
            results.forEach(r => {
                const p = Number(r.percentage || 0);
                if (p >= 40) passedCount++;
                totalPct += p;
                if (p > topPct) topPct = p;
            });

            const avg = Math.round(totalPct / results.length);
            const passRate = Math.round((passedCount / results.length) * 100);

            if (statTotal) statTotal.textContent = results.length;
            if (statCompleted) statCompleted.textContent = results.length;
            if (statPassed) statPassed.textContent = passedCount;
            if (statAvg) statAvg.textContent = `${avg}%`;
            if (statTop) statTop.textContent = `${topPct}%`;
            if (circleAvg) circleAvg.textContent = `${passRate}%`;
            if (analyticsAvg) analyticsAvg.textContent = `${avg}%`;
            if (analyticsAvgBar) analyticsAvgBar.style.width = `${avg}%`;
            if (analyticsPass) analyticsPass.textContent = `${passRate}%`;
            if (analyticsPassBar) analyticsPassBar.style.width = `${passRate}%`;
        }

        if (!body) return;
        body.innerHTML = "";

        if (results.length === 0) {
            body.innerHTML = `<tr><td colspan="5">No recorded submissions yet.</td></tr>`;
            return;
        }

        results.forEach(result => {
            const passed = Number(result.percentage) >= 40;
            body.innerHTML += `
                <tr>
                    <td><b>${escapeHTML(result.student_name)}</b></td>
                    <td>${escapeHTML(result.exam_name)}</td>
                    <td>${result.score} / ${result.total_marks}</td>
                    <td><b>${result.percentage}%</b></td>
                    <td><span class="status ${passed ? 'completed' : 'failed'}">${passed ? 'Passed' : 'Failed'}</span></td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Failed to load results:", error);
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
