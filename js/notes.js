// =========================================================
// EXAMSPHERE - SIMPLE & CLEAN STUDY NOTES & EXAM QUESTIONS
// Structure: Topic -> Simple Definition -> Quick Code -> Exam Question & Answer
// =========================================================

const STUDENT_NOTES_DB = {
    python: {
        title: "Python Programming (Core & Advanced)",
        badge: "PYTHON M3-R5",
        badgeClass: "badge-python",
        pages: 15,
        chapters: [
            {
                title: "Variables & Data Types",
                definition: "Python is dynamically typed. You don't need to declare types explicitly. Main types are int (numbers), float (decimals), str (text), and bool (True/False).",
                code: `x = 10          # Integer\ny = 3.14        # Float\nname = "Alex"   # String\nis_active = True # Boolean`,
                question: "What is the output of bool([]) and bool('Python') in Python?",
                answer: "False and True. Empty collections are always False, while non-empty strings/lists are True."
            },
            {
                title: "Lists, Tuples, Sets & Dictionaries",
                definition: "Lists are mutable (changeable). Tuples are immutable (read-only). Sets store unique items with no duplicates. Dictionaries store Key-Value pairs.",
                code: `# List & Tuple\nnums = [1, 2, 3]\ncoords = (10, 20)\n\n# Set & Dictionary\ncolors = {"red", "blue", "red"} # {'red', 'blue'}\nuser = {"name": "Alex", "role": "Student"}`,
                question: "What is the key difference between a List and a Tuple?",
                answer: "Lists can be modified (mutable), while Tuples cannot be modified after creation (immutable)."
            },
            {
                title: "Functions & Lambda",
                definition: "Functions are declared using 'def'. Lambda functions are small one-line anonymous functions using 'lambda arguments: expression'.",
                code: `# Regular Function\ndef add(a, b):\n    return a + b\n\n# One-line Lambda\nsquare = lambda x: x * x\nprint(square(5)) # Output: 25`,
                question: "When should you use a Lambda function in Python?",
                answer: "When you need a short, temporary function for a short period of time, commonly passed to map(), filter(), or sorted()."
            },
            {
                title: "Object-Oriented Programming (Classes & Objects)",
                definition: "Classes are blueprints for objects. `__init__` is the constructor method, and `self` refers to the current object instance.",
                code: `class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\n    def is_passed(self):\n        return self.score >= 50\n\ns1 = Student("Alex", 85)\nprint(s1.is_passed()) # True`,
                question: "What is the role of `__init__` in a Python class?",
                answer: "It is the class constructor that automatically initializes object attributes when a new instance is created."
            },
            {
                title: "File Handling & Exception Handling",
                definition: "Use `with open()` to safely read/write files (automatically closes file). Use `try-except` to prevent crashes when errors occur.",
                code: `try:\n    with open("scores.txt", "w") as f:\n        f.write("Score: 95\\n")\nexcept Exception as e:\n    print(f"Error: {e}")`,
                question: "Why is `with open()` preferred over `open()` and `close()`?",
                answer: "Because `with` guarantees the file is properly closed even if an unexpected exception occurs inside the code block."
            }
        ]
    },

    web: {
        title: "Web Design & Development (HTML, CSS, JS)",
        badge: "WEB DESIGN M2-R5",
        badgeClass: "badge-web",
        pages: 18,
        chapters: [
            {
                title: "Semantic HTML5",
                definition: "HTML5 semantic tags clearly describe their purpose to browsers and search engines. Examples: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>`.",
                code: `<header>\n  <nav>\n    <a href="#home">Home</a>\n    <a href="#exams">Exams</a>\n  </nav>\n</header>\n<main>\n  <section><h1>Dashboard</h1></section>\n</main>`,
                question: "Why should we use semantic tags instead of plain `<div>` tags?",
                answer: "Semantic tags improve website SEO, screen-reader accessibility, and code readability."
            },
            {
                title: "CSS Flexbox & Grid Layouts",
                definition: "Flexbox aligns items in 1 dimension (row or column). CSS Grid creates 2-dimensional layouts with rows AND columns.",
                code: `/* Center anything with Flexbox */\n.center-box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/* 3-Column Responsive Grid */\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 16px;\n}`,
                question: "What is the difference between `justify-content` and `align-items` in Flexbox?",
                answer: "`justify-content` aligns items along the Main Axis (horizontal by default), while `align-items` aligns along the Cross Axis (vertical by default)."
            },
            {
                title: "JavaScript DOM & Events",
                definition: "The DOM allows JavaScript to dynamically read and update HTML content, styles, and handle user clicks with `addEventListener`.",
                code: `const btn = document.getElementById("submitBtn");\nbtn.addEventListener("click", () => {\n  const name = document.getElementById("nameInput").value;\n  alert("Welcome, " + name);\n});`,
                question: "What does `event.preventDefault()` do in JavaScript?",
                answer: "It stops the default action of an HTML element (e.g. stops a form from reloading the page when submitted)."
            }
        ]
    },

    sql: {
        title: "Database Management & SQL",
        badge: "DATABASE & SQL",
        badgeClass: "badge-db",
        pages: 14,
        chapters: [
            {
                title: "Relational Concepts & Primary Keys",
                definition: "RDBMS organizes data into tables. A Primary Key uniquely identifies each row and cannot be NULL. A Foreign Key links to another table's Primary Key.",
                code: `CREATE TABLE students (\n  student_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(120) UNIQUE NOT NULL\n);`,
                question: "Can a table have multiple Primary Keys?",
                answer: "No, a table can have only ONE Primary Key (though it can be composed of multiple columns as a Composite Primary Key)."
            },
            {
                title: "Database Normalization (1NF, 2NF, 3NF)",
                definition: "Normalization organizes table structures to eliminate duplicate data (redundancy) and prevent insertion, update, and deletion anomalies.",
                code: `-- 1NF: Atomic single values in each cell\n-- 2NF: 1NF + No partial dependency\n-- 3NF: 2NF + No transitive dependency`,
                question: "What is 3NF (Third Normal Form)?",
                answer: "A table is in 3NF if it is in 2NF and has no transitive functional dependencies (non-key columns must depend only on the primary key)."
            },
            {
                title: "SQL Queries, JOINs & GROUP BY",
                definition: "INNER JOIN returns matching rows between tables. `GROUP BY` groups records so aggregate functions (COUNT, AVG, SUM, MAX, MIN) can calculate summaries.",
                code: `SELECT s.name, AVG(r.score) AS avg_score\nFROM students s\nINNER JOIN results r ON s.student_id = r.student_id\nGROUP BY s.student_id, s.name\nHAVING avg_score >= 75\nORDER BY avg_score DESC;`,
                question: "What is the difference between WHERE and HAVING in SQL?",
                answer: "WHERE filters individual rows BEFORE grouping; HAVING filters aggregated groups AFTER GROUP BY."
            }
        ]
    },

    dsa: {
        title: "Data Structures & Algorithms (DSA)",
        badge: "DSA & COMPLEXITY",
        badgeClass: "badge-dsa",
        pages: 16,
        chapters: [
            {
                title: "Big-O Time Complexity",
                definition: "Big-O notation measures how execution time increases as input size (n) grows. O(1) is constant, O(log n) is binary search, O(n) is linear scan, O(n log n) is fast sorting.",
                code: `// O(log n) Binary Search\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
                question: "What is the time complexity of QuickSort in the average vs worst case?",
                answer: "Average case is O(n log n); Worst case is O(n^2) when poor pivots are chosen."
            },
            {
                title: "Stacks & Queues",
                definition: "A Stack is LIFO (Last In, First Out) like a stack of plates. A Queue is FIFO (First In, First Out) like a ticket counter line.",
                code: `// Stack (LIFO)\nconst stack = [];\nstack.push(10); // add\nstack.pop();    // remove last\n\n// Queue (FIFO)\nconst queue = [];\nqueue.push("User 1"); // enqueue\nqueue.shift();        // dequeue first`,
                question: "Which data structure is used for Breadth First Search (BFS)?",
                answer: "A Queue (FIFO) is used for BFS graph/tree traversal."
            }
        ]
    },

    it: {
        title: "IT Tools, Networking & Cyber Security",
        badge: "IT TOOLS M1-R5",
        badgeClass: "badge-network",
        pages: 12,
        chapters: [
            {
                title: "OSI 7-Layer Architecture",
                definition: "The OSI model standardizes network communication: 7. Application (HTTP), 6. Presentation (SSL), 5. Session, 4. Transport (TCP/UDP), 3. Network (IP), 2. Data Link (MAC), 1. Physical (Cables).",
                code: `# TCP 3-Way Handshake\nClient  -- SYN  -->  Server\nClient <-- SYN-ACK - Server\nClient  -- ACK  -->  Server`,
                question: "What is the difference between TCP and UDP?",
                answer: "TCP is connection-oriented, reliable, and ordered. UDP is connectionless, faster, but does not guarantee delivery."
            },
            {
                title: "Cyber Security & Cryptography",
                definition: "Encryption converts readable data into ciphertext. Hashing (e.g. SHA-256) is a one-way function used for password verification and file integrity.",
                code: `# Symmetric: Same key to encrypt & decrypt (AES)\n# Asymmetric: Public key encrypts, Private key decrypts (RSA)\n# Hash: One-way irreversible string digest`,
                question: "Can cryptographic hashes (like SHA-256) be decrypted?",
                answer: "No, hashing is strictly one-way and cannot be decrypted."
            }
        ]
    },

    patterns: {
        title: "Coding Interview Patterns",
        badge: "INTERVIEW PATTERNS",
        badgeClass: "badge-interview",
        pages: 10,
        chapters: [
            {
                title: "Two Pointers Technique",
                definition: "Uses two pointers moving inward from both ends of a sorted array to find target pairs in O(n) linear time instead of O(n^2) nested loops.",
                code: `function twoSumSorted(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    let sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return null;\n}`,
                question: "What requirement must an array meet to use the Two Pointers pattern for pairs?",
                answer: "The array must be sorted in ascending (or descending) order."
            },
            {
                title: "Sliding Window Pattern",
                definition: "Maintains a running window over contiguous elements in an array or string to find maximums, minimums, or target sums in a single O(n) pass.",
                code: `function maxSubarraySum(arr, k) {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  let maxSum = windowSum;\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}`,
                question: "When is the Sliding Window pattern used?",
                answer: "When solving problems involving contiguous subarrays or substrings with a given condition."
            }
        ]
    }
};

let activeNotesCategory = "all";

function setNotesFilterCategory(cat, el) {
    activeNotesCategory = cat;
    document.querySelectorAll("#notesCategoryFilterPills .cat-pill").forEach(p => p.classList.remove("active"));
    if (el) {
        el.classList.add("active");
    } else if (typeof event !== "undefined" && event && event.target) {
        const btn = event.target.closest(".cat-pill");
        if (btn) btn.classList.add("active");
    }
    filterStudentNotes();
}

function filterStudentNotes() {
    const query = (document.getElementById("studentNotesSearchInput")?.value || "").toLowerCase().trim();
    const cards = document.querySelectorAll("#studentNotesGrid .notes-card");

    cards.forEach(card => {
        const cardCat = card.getAttribute("data-category") || "";
        const cardText = card.textContent.toLowerCase();

        const matchesCat = activeNotesCategory === "all" || cardCat === activeNotesCategory;
        const matchesQuery = !query || cardText.includes(query);

        card.style.display = (matchesCat && matchesQuery) ? "flex" : "none";
    });
}

let currentOpenSubjectData = null;

function openStudentNotesModal(subjectId) {
    const data = STUDENT_NOTES_DB[subjectId] || STUDENT_NOTES_DB.python;
    currentOpenSubjectData = data;

    const badge = document.getElementById("studentNotesModalBadge");
    const title = document.getElementById("studentNotesModalTitle");
    const content = document.getElementById("studentNotesModalContent");

    if (badge) {
        badge.textContent = data.badge;
        badge.className = `notes-subject-badge ${data.badgeClass}`;
    }
    if (title) title.textContent = data.title;

    if (content) {
        content.innerHTML = data.chapters.map((ch, idx) => `
            <div class="notes-chapter-box" style="background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: 12px; padding: 20px 24px; margin-bottom: 22px;">
                
                <!-- TOPIC TITLE -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <h3 style="margin: 0; font-size: 1.12rem; font-weight: 800; color: var(--text-main);">
                        <span style="color: var(--primary); font-weight: 900; margin-right: 6px;">#${idx + 1}</span> ${ch.title}
                    </h3>
                    <button type="button" class="btn-editor btn-editor-secondary copy-snippet-btn" onclick="copySnippetCode(this, '${encodeURIComponent(ch.code)}')" style="padding: 4px 10px; font-size: 0.75rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy Code</span>
                    </button>
                </div>

                <!-- 1. DEFINITION -->
                <div style="margin-bottom: 14px;">
                    <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">📌 Definition:</span>
                    <p style="margin: 0; font-size: 0.94rem; line-height: 1.5; color: var(--text-main);">${ch.definition}</p>
                </div>

                <!-- 2. CODE SNIPPET -->
                <div style="margin-bottom: 14px;">
                    <span style="font-size: 0.8rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">💻 Example Code:</span>
                    <pre class="notes-code-snippet" style="margin: 0;"><code>${escapeHTML(ch.code)}</code></pre>
                </div>

                <!-- 3. EXAM QUESTION & ANSWER -->
                <div style="background: var(--bg-card); border-left: 4px solid var(--green); padding: 12px 16px; border-radius: 6px; border: 1px solid var(--border-color); border-left-width: 4px; border-left-color: var(--green);">
                    <span style="font-size: 0.8rem; font-weight: 800; color: var(--green); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">❓ Exam Practice Question:</span>
                    <p style="margin: 0 0 6px 0; font-weight: 700; font-size: 0.92rem; color: var(--text-main);">${ch.question}</p>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);"><b style="color: var(--text-main);">Answer:</b> ${ch.answer}</p>
                </div>

            </div>
        `).join('');
    }

    const modal = document.getElementById("studentNotesModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function copySnippetCode(btn, encodedCode) {
    try {
        const code = decodeURIComponent(encodedCode);
        navigator.clipboard.writeText(code).then(() => {
            const origText = btn.innerHTML;
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color:var(--green)">Copied!</span>`;
            setTimeout(() => {
                btn.innerHTML = origText;
            }, 2000);
        });
    } catch (err) {
        console.error("Clipboard copy failed:", err);
    }
}

function closeStudentNotesModal() {
    const modal = document.getElementById("studentNotesModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function handleStudentNotesBackdropClick(e) {
    if (e.target.id === "studentNotesModal") {
        closeStudentNotesModal();
    }
}

function downloadStudentNotesPdf(subjectId) {
    openStudentNotesModal(subjectId);
    const prevTitle = document.title;
    const data = STUDENT_NOTES_DB[subjectId] || STUDENT_NOTES_DB.python;
    document.title = `${data.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Revision_Notes`;
    setTimeout(() => {
        window.print();
        setTimeout(() => {
            document.title = prevTitle;
        }, 1000);
    }, 350);
}

function downloadStudentCurrentModalPdf() {
    const prevTitle = document.title;
    if (currentOpenSubjectData) {
        document.title = `${currentOpenSubjectData.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Revision_Notes`;
    }
    window.print();
    setTimeout(() => {
        document.title = prevTitle;
    }, 1000);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeStudentNotesModal();
    }
});
