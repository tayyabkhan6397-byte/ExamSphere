from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "examsphere.db")


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # ---------------- STUDENTS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            avatar TEXT DEFAULT ''
        )
    """)
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN avatar TEXT DEFAULT ''")
    except sqlite3.OperationalError:
        pass

    # ---------------- ADMINS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # ---------------- SUBJECTS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    """)

    # ---------------- QUESTIONS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT DEFAULT '',
            marks INTEGER NOT NULL DEFAULT 1
        )
    """)

    # ---------------- EXAMS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            difficulty TEXT DEFAULT 'Intermediate',
            num_questions INTEGER NOT NULL,
            total_marks INTEGER NOT NULL,
            duration INTEGER NOT NULL
        )
    """)

    # ---------------- EXAM QUESTIONS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exam_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            UNIQUE(exam_id, question_id)
        )
    """)

    # ---------------- RESULTS ----------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            exam_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total_marks INTEGER NOT NULL,
            attempted INTEGER NOT NULL DEFAULT 0,
            correct INTEGER NOT NULL DEFAULT 0,
            wrong INTEGER NOT NULL DEFAULT 0,
            total_questions INTEGER NOT NULL DEFAULT 0,
            review_data TEXT DEFAULT '',
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Default Admin
    cursor.execute("""
        INSERT OR IGNORE INTO admins (name, email, password)
        VALUES (?, ?, ?)
    """, ("System Administrator", "admin@examsphere.com", "admin123"))

    # Default Students
    cursor.execute("""
        INSERT OR IGNORE INTO students (name, email, password)
        VALUES (?, ?, ?)
    """, ("Alex Morgan", "student@examsphere.com", "student123"))
    cursor.execute("""
        INSERT OR IGNORE INTO students (name, email, password)
        VALUES (?, ?, ?)
    """, ("Sara Khan", "sara@examsphere.com", "sara123"))
    cursor.execute("""
        INSERT OR IGNORE INTO students (name, email, password)
        VALUES (?, ?, ?)
    """, ("David Chen", "david@examsphere.com", "david123"))

    # Default Subjects
    subjects = [
        "Web Development",
        "Data Structures & Algorithms",
        "Python Programming",
        "Database Systems (SQL)",
        "Computer Networks & Security",
        "General Aptitude & Logic"
    ]
    for s in subjects:
        cursor.execute("INSERT OR IGNORE INTO subjects (name) VALUES (?)", (s,))

    # Seed Comprehensive Question Bank if empty
    q_count = cursor.execute("SELECT COUNT(*) FROM questions").fetchone()[0]
    if q_count < 20:
        comprehensive_questions = [
            # --- 1. Web Development ---
            ("Web Development", "What does the 'typeof null' expression return in JavaScript?", "null", "undefined", "object", "number", "C", "In JavaScript, typeof null returns 'object' due to a historical legacy bug in the original language specification.", 1),
            ("Web Development", "Which HTML5 element is semantically intended for the primary navigation links of a page?", "<section>", "<nav>", "<aside>", "<header>", "B", "The <nav> tag specifies a section that contains primary navigation links.", 1),
            ("Web Development", "In CSS Flexbox, which property controls alignment along the main axis?", "align-items", "justify-content", "align-content", "flex-direction", "B", "justify-content aligns flex items along the main axis of the current flex line.", 1),
            ("Web Development", "Which HTTP status code signifies that a requested resource was successfully created?", "200 OK", "201 Created", "204 No Content", "301 Moved Permanently", "B", "201 Created indicates the request has been fulfilled and resulted in a new resource being created.", 1),
            ("Web Development", "What is the primary function of the JavaScript 'addEventListener' method?", "Modify CSS styles directly", "Register an event handler function on a DOM element", "Create a new HTTP GET request", "Bind a database query to a button", "B", "addEventListener registers a single event listener on an EventTarget.", 1),
            ("Web Development", "Which mechanism prevents Cross-Origin HTTP requests unless the server explicitly permits them?", "Content Security Policy (CSP)", "CORS (Cross-Origin Resource Sharing)", "XSS Protection", "SameSite Cookie Policy", "B", "CORS uses HTTP headers to tell browsers whether a specific origin can access resources.", 1),
            ("Web Development", "What is the purpose of the 'virtual DOM' in modern frontend frameworks like React?", "Store sensitive user passwords", "Minimize expensive real DOM re-renders by calculating diffs in memory", "Bypass CSS styling rules", "Serve static assets faster over CDN", "B", "Virtual DOM diffing updates only the real DOM elements that changed.", 1),
            ("Web Development", "Which CSS unit is relative to the font-size of the root (<html>) element?", "em", "rem", "vh", "px", "B", "rem stands for 'root em' and is relative to the font-size of the html element.", 1),

            # --- 2. Data Structures & Algorithms ---
            ("Data Structures & Algorithms", "What is the worst-case time complexity of QuickSort?", "O(n log n)", "O(n^2)", "O(n)", "O(log n)", "B", "QuickSort degrades to O(n^2) when an unbalanced pivot (such as always picking the smallest or largest) is repeatedly chosen.", 2),
            ("Data Structures & Algorithms", "Which data structure follows the LIFO (Last In First Out) principle?", "Queue", "Stack", "Binary Heap", "Circular Queue", "B", "A Stack removes the most recently added item first (LIFO).", 1),
            ("Data Structures & Algorithms", "What is the average time complexity to search an element in a Hash Table?", "O(1)", "O(log n)", "O(n)", "O(n log n)", "A", "Hash tables provide average constant O(1) lookup time when a good hash function is used.", 1),
            ("Data Structures & Algorithms", "Which traversal of a Binary Search Tree (BST) yields elements in non-decreasing sorted order?", "Pre-order", "In-order", "Post-order", "Level-order", "B", "In-order traversal (Left, Root, Right) of a BST always yields keys in ascending sorted order.", 2),
            ("Data Structures & Algorithms", "Which data structure is primarily used by Dijkstra's algorithm to retrieve the minimum distance vertex efficiently?", "Stack", "Priority Queue (Min-Heap)", "Deque", "Disjoint Set", "B", "A Min-Heap priority queue allows extraction of the minimum distance vertex in O(log V) time.", 2),
            ("Data Structures & Algorithms", "What is the minimum number of queues needed to implement a Stack?", "1", "2", "3", "4", "B", "A stack can be simulated using 2 queues by shifting elements during push or pop.", 1),
            ("Data Structures & Algorithms", "Which algorithmic paradigm does the Merge Sort algorithm employ?", "Greedy approach", "Dynamic Programming", "Divide and Conquer", "Backtracking", "C", "Merge Sort divides the input array into halves, sorts each half recursively, and merges them.", 1),
            ("Data Structures & Algorithms", "What is the space complexity of Depth First Search (DFS) on a tree of height h?", "O(1)", "O(h)", "O(2^h)", "O(n^2)", "B", "DFS uses memory proportional to the maximum height of the recursion call stack, which is O(h).", 2),

            # --- 3. Python Programming ---
            ("Python Programming", "Which of the following Python data structures is mutable?", "tuple", "frozenset", "list", "str", "C", "Lists are mutable in Python; items can be modified, appended, or removed in-place.", 1),
            ("Python Programming", "What is the output of bool([]) in Python?", "True", "False", "None", "Raises TypeError", "B", "Empty collections (empty list, dict, set, string, tuple) evaluate to False in boolean contexts.", 1),
            ("Python Programming", "What keyword is used to create an anonymous inline function in Python?", "def", "lambda", "func", "inline", "B", "The lambda keyword is used to define small anonymous functions.", 1),
            ("Python Programming", "Which statement correctly describes Python's Global Interpreter Lock (GIL)?", "Allows parallel multi-core execution of pure Python threads", "A mutex that prevents multiple native threads from executing Python bytecodes simultaneously", "A garbage collection tool for cyclical references", "A security sandbox for unverified scripts", "B", "The GIL prevents multiple native threads from executing Python bytecodes concurrently within a single process.", 2),
            ("Python Programming", "What is the purpose of the 'yield' keyword inside a Python function?", "Terminates the program immediately", "Turns the function into a generator that produces a sequence of values lazily", "Raises an uncaught exception", "Imports an external package", "B", "yield produces a generator that pauses function execution and resumes on next().", 1),
            ("Python Programming", "Which built-in module is used in Python for regular expressions?", "regex_lib", "re", "pyregex", "match", "B", "The standard library module 're' provides regular expression matching operations.", 1),
            ("Python Programming", "What will `print(type((1)))` and `print(type((1,)))` output in Python?", "tuple and tuple", "int and tuple", "int and int", "tuple and list", "B", "(1) is evaluated as the integer 1 in parentheses, while (1,) with a trailing comma creates a single-element tuple.", 1),
            ("Python Programming", "How is method inheritance called from a child class in Python 3?", "super().__init__()", "parent().__init__()", "base().__init__()", "self.super()", "A", "super() returns a proxy object that delegates method calls to a parent or sibling class.", 1),

            # --- 4. Database Systems (SQL) ---
            ("Database Systems (SQL)", "What does SQL stand for?", "Structured Query Language", "Sequential Question Logic", "Standard Quick Link", "System Query Link", "A", "SQL stands for Structured Query Language.", 1),
            ("Database Systems (SQL)", "Which SQL constraint uniquely identifies each record in a database table?", "UNIQUE", "FOREIGN KEY", "PRIMARY KEY", "CHECK", "C", "A PRIMARY KEY uniquely identifies each record and cannot contain NULL values.", 1),
            ("Database Systems (SQL)", "Which clause is used in SQL to filter the results of an aggregate function?", "WHERE", "HAVING", "GROUP BY", "ORDER BY", "B", "HAVING is used to filter groups created by GROUP BY based on aggregate conditions.", 1),
            ("Database Systems (SQL)", "What type of JOIN returns all rows from the left table, and matching rows from the right table?", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "B", "A LEFT JOIN returns all records from the left table and matched records from the right table.", 1),
            ("Database Systems (SQL)", "In ACID properties of database transactions, what does the 'I' represent?", "Integrity", "Isolation", "Inheritance", "Immutability", "B", "Isolation guarantees that concurrently running transactions execute independently without interfering with each other.", 1),
            ("Database Systems (SQL)", "Which normal form eliminates partial dependency on a composite primary key?", "1NF", "2NF", "3NF", "BCNF", "B", "Second Normal Form (2NF) requires 1NF and that all non-key attributes are fully dependent on the primary key.", 2),
            ("Database Systems (SQL)", "Which command is used to permanently remove a table along with its structure and data?", "DELETE TABLE", "TRUNCATE TABLE", "DROP TABLE", "REMOVE TABLE", "C", "DROP TABLE removes both table structure and data permanently from the database.", 1),
            ("Database Systems (SQL)", "What is the primary benefit of creating an index on a frequently queried column?", "Reduces storage space on disk", "Significantly speeds up data retrieval queries", "Automatically encrypts column data", "Enforces foreign key relationships", "B", "Indexes (like B-Trees) enable rapid record lookup without scanning the entire table.", 1),

            # --- 5. Computer Networks & Security ---
            ("Computer Networks & Security", "How many layers are defined in the OSI reference model?", "4", "5", "7", "8", "C", "The OSI model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.", 1),
            ("Computer Networks & Security", "Which transport layer protocol provides connection-oriented, reliable, and ordered delivery of data packets?", "UDP", "TCP", "ICMP", "IP", "B", "TCP (Transmission Control Protocol) provides reliable, ordered, and error-checked packet delivery.", 1),
            ("Computer Networks & Security", "On which default port number does an HTTPS web server listen?", "80", "443", "8080", "22", "B", "HTTPS uses port 443 by default for encrypted web communication (SSL/TLS).", 1),
            ("Computer Networks & Security", "What does DNS stand for in computer networking?", "Domain Name System", "Digital Network Server", "Direct Network Switch", "Data Node Standard", "A", "DNS translates human-readable domain names (e.g. google.com) into numeric IP addresses.", 1),
            ("Computer Networks & Security", "What type of attack floods a server with overwhelming illegitimate traffic to make it unavailable?", "Man-in-the-Middle (MitM)", "SQL Injection", "Distributed Denial of Service (DDoS)", "Cross-Site Scripting (XSS)", "C", "DDoS floods target servers with massive automated traffic from multiple compromised devices.", 1),
            ("Computer Networks & Security", "Which asymmetric encryption algorithm relies on the mathematical difficulty of factoring large prime numbers?", "AES", "DES", "RSA", "SHA-256", "C", "RSA cryptography is based on the computational difficulty of factoring the product of two large prime numbers.", 2),
            ("Computer Networks & Security", "What protocol is used to securely log in and execute commands on a remote server?", "Telnet", "FTP", "SSH", "HTTP", "C", "SSH (Secure Shell) operates on port 22 and provides encrypted communication for remote command execution.", 1),
            ("Computer Networks & Security", "What is the primary purpose of a Subnet Mask in IPv4 networking?", "Encrypt outgoing network packets", "Distinguish between the network portion and the host portion of an IP address", "Assign domain names dynamically", "Filter spam email traffic", "B", "A subnet mask separates the 32-bit IP address into network and host components.", 1),

            # --- 6. General Aptitude & Logic ---
            ("General Aptitude & Logic", "What is the next number in the sequence: 2, 6, 12, 20, 30, ...?", "40", "42", "44", "48", "B", "Differences between consecutive terms are 4, 6, 8, 10, 12. Thus 30 + 12 = 42 (or n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7=42).", 1),
            ("General Aptitude & Logic", "A train 150 meters long passes a telegraph post in 10 seconds. What is the speed of the train in km/h?", "45 km/h", "54 km/h", "60 km/h", "72 km/h", "B", "Speed = 150m / 10s = 15 m/s. In km/h: 15 * (18/5) = 54 km/h.", 1),
            ("General Aptitude & Logic", "If 5 workers can build a wall in 12 days, how many days will it take 3 workers at the same rate?", "15 days", "18 days", "20 days", "24 days", "C", "Total work = 5 * 12 = 60 man-days. For 3 workers: 60 / 3 = 20 days.", 1),
            ("General Aptitude & Logic", "A bag contains 4 red and 6 blue balls. What is the probability of drawing a red ball at random?", "2/5", "3/5", "1/2", "1/5", "A", "Total balls = 10. Probability = 4/10 = 2/5 (40%).", 1),
            ("General Aptitude & Logic", "If 'CODING' is encoded as 'DPEJOH', how is 'FLOWER' encoded in that pattern?", "GMPXFS", "GMNXFS", "ENNVDS", "GLPXFS", "A", "Each letter is shifted forward by 1 (+1): F->G, L->M, O->P, W->X, E->F, R->S.", 1),
            ("General Aptitude & Logic", "What is the average of first five multiples of 7?", "14", "21", "28", "35", "B", "The first five multiples are 7, 14, 21, 28, 35. Average = (7 + 14 + 21 + 28 + 35) / 5 = 105 / 5 = 21.", 1)
        ]

        cursor.executemany("""
            INSERT INTO questions (subject, question, option_a, option_b, option_c, option_d, correct_answer, explanation, marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, comprehensive_questions)

    # Seed 6 Comprehensive Live Exams if not present
    cursor.execute("SELECT COUNT(*) FROM exams")
    if cursor.fetchone()[0] < 6:
        exams_config = [
            ("Web Development Certification", "Web Development", "Intermediate", 8, 8, 15),
            ("Data Structures & Algorithms Mastery", "Data Structures & Algorithms", "Advanced", 8, 13, 20),
            ("Python Core Programming Test", "Python Programming", "Intermediate", 8, 9, 15),
            ("Database & SQL Specialist Exam", "Database Systems (SQL)", "Intermediate", 8, 9, 15),
            ("Computer Networks & Cyber Security", "Computer Networks & Security", "Advanced", 8, 9, 15),
            ("General Aptitude & Logic Assessment", "General Aptitude & Logic", "Beginner", 6, 6, 10)
        ]

        for exam in exams_config:
            cursor.execute("SELECT id FROM exams WHERE name = ?", (exam[0],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO exams (name, subject, difficulty, num_questions, total_marks, duration)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, exam)
                exam_id = cursor.lastrowid

                # Assign subject questions to this exam
                q_rows = cursor.execute("SELECT id FROM questions WHERE subject = ? LIMIT ?", (exam[1], exam[3])).fetchall()
                for q in q_rows:
                    cursor.execute("INSERT OR IGNORE INTO exam_questions (exam_id, question_id) VALUES (?, ?)", (exam_id, q["id"]))

    # Default Results for Demo
    cursor.execute("SELECT COUNT(*) FROM results")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO results (student_id, exam_id, score, total_marks, attempted, correct, wrong, total_questions)
            VALUES (1, 1, 7, 8, 8, 7, 1, 8)
        """)
        cursor.execute("""
            INSERT INTO results (student_id, exam_id, score, total_marks, attempted, correct, wrong, total_questions)
            VALUES (2, 2, 11, 13, 8, 7, 1, 8)
        """)
        cursor.execute("""
            INSERT INTO results (student_id, exam_id, score, total_marks, attempted, correct, wrong, total_questions)
            VALUES (3, 3, 8, 9, 8, 7, 1, 8)
        """)

    conn.commit()
    conn.close()


# =========================================================
# ROUTES
# =========================================================

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "name": "ExamSphere High-Performance API",
        "version": "2.0"
    })


@app.route("/api/test")
def test_api():
    return jsonify({
        "success": True,
        "message": "ExamSphere API is running smoothly!"
    })


# ---------------- AUTHENTICATION ----------------

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "")
    role = data.get("role", "student")

    conn = get_db()
    cursor = conn.cursor()

    if role == "admin":
        cursor.execute("SELECT id, name, email FROM admins WHERE email = ? AND password = ?", (email, password))
    else:
        cursor.execute("SELECT id, name, email, avatar FROM students WHERE email = ? AND password = ?", (email, password))

    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    user_data = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": role,
        "avatar": user["avatar"] if (role == "student" and "avatar" in user.keys() and user["avatar"]) else ""
    }

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": user_data
    })


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "All registration fields are required."}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO students (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"success": False, "message": "Email is already registered."}), 409

    conn.close()
    return jsonify({"success": True, "message": "Account created successfully!"})


# ---------------- STUDENTS ----------------

@app.route("/api/students", methods=["GET"])
def get_students():
    conn = get_db()
    students = conn.execute("SELECT id, name, email, avatar FROM students ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify({"success": True, "students": [dict(s) for s in students]})


@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    avatar = data.get("avatar", "")

    if not name or not email:
        return jsonify({"success": False, "message": "Name and email are required."}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE students
            SET name = ?, email = ?, avatar = ?
            WHERE id = ?
        """, (name, email, avatar, student_id))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"success": False, "message": "Email is already taken by another account."}), 409

    conn.close()
    return jsonify({
        "success": True,
        "message": "Profile updated successfully!",
        "user": {
            "id": student_id,
            "name": name,
            "email": email,
            "avatar": avatar,
            "role": "student"
        }
    })


@app.route("/api/students/<int:student_id>/change-password", methods=["POST"])
def change_student_password(student_id):
    data = request.get_json() or {}
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if not current_password or not new_password:
        return jsonify({"success": False, "message": "Current and new passwords are required."}), 400

    if len(new_password) < 6:
        return jsonify({"success": False, "message": "New password must be at least 6 characters."}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, password FROM students WHERE id = ?", (student_id,))
    student = cursor.fetchone()

    if not student:
        conn.close()
        return jsonify({"success": False, "message": "Student account not found."}), 404

    if student["password"] != current_password:
        conn.close()
        return jsonify({"success": False, "message": "Incorrect current password."}), 400

    cursor.execute("UPDATE students SET password = ? WHERE id = ?", (new_password, student_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Password changed successfully!"})


@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM results WHERE student_id = ?", (student_id,))
    cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Student account and records deleted successfully."})


@app.route("/api/results/student/<int:student_id>", methods=["DELETE"])
def reset_student_results(student_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM results WHERE student_id = ?", (student_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Student examination history reset successfully."})


# ---------------- SUBJECTS ----------------

@app.route("/api/subjects", methods=["GET", "POST"])
def handle_subjects():
    conn = get_db()
    if request.method == "POST":
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        if not name:
            conn.close()
            return jsonify({"success": False, "message": "Subject name is required."}), 400
        try:
            conn.execute("INSERT INTO subjects (name) VALUES (?)", (name,))
            conn.commit()
            conn.close()
            return jsonify({"success": True, "message": "Subject added successfully!"})
        except sqlite3.IntegrityError:
            conn.close()
            return jsonify({"success": False, "message": "Subject already exists."}), 409

    subjects = conn.execute("SELECT id, name FROM subjects ORDER BY name ASC").fetchall()
    conn.close()
    return jsonify({"success": True, "subjects": [dict(s) for s in subjects]})


# ---------------- QUESTIONS ----------------

@app.route("/api/questions", methods=["GET", "POST"])
def handle_questions():
    conn = get_db()

    if request.method == "POST":
        data = request.get_json() or {}
        subject = data.get("subject", "").strip()
        question = data.get("question", "").strip()
        op_a = data.get("option_a", "").strip()
        op_b = data.get("option_b", "").strip()
        op_c = data.get("option_c", "").strip()
        op_d = data.get("option_d", "").strip()
        ans = data.get("correct_answer", "").strip().upper()
        marks = int(data.get("marks", 1))
        explanation = data.get("explanation", "").strip()

        if not all([subject, question, op_a, op_b, op_c, op_d, ans]):
            conn.close()
            return jsonify({"success": False, "message": "All question fields are required."}), 400

        cursor = conn.execute("""
            INSERT INTO questions (subject, question, option_a, option_b, option_c, option_d, correct_answer, explanation, marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (subject, question, op_a, op_b, op_c, op_d, ans, explanation, marks))
        conn.commit()
        q_id = cursor.lastrowid
        conn.close()
        return jsonify({"success": True, "message": "Question added successfully!", "question_id": q_id})

    subject = request.args.get("subject")
    if subject:
        questions = conn.execute("SELECT * FROM questions WHERE subject = ? ORDER BY id DESC", (subject,)).fetchall()
    else:
        questions = conn.execute("SELECT * FROM questions ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify({"success": True, "questions": [dict(q) for q in questions]})


@app.route("/api/questions/<int:question_id>", methods=["PUT", "DELETE"])
def handle_single_question(question_id):
    conn = get_db()

    if request.method == "PUT":
        data = request.get_json() or {}
        subject = data.get("subject", "").strip()
        question = data.get("question", "").strip()
        op_a = data.get("option_a", "").strip()
        op_b = data.get("option_b", "").strip()
        op_c = data.get("option_c", "").strip()
        op_d = data.get("option_d", "").strip()
        ans = data.get("correct_answer", "").strip().upper()
        marks = int(data.get("marks", 1))
        explanation = data.get("explanation", "").strip()
        difficulty = data.get("difficulty", "Medium")

        if not all([subject, question, op_a, op_b, op_c, op_d, ans]):
            conn.close()
            return jsonify({"success": False, "message": "All question fields are required."}), 400

        cursor = conn.execute("""
            UPDATE questions
            SET subject = ?, question = ?, option_a = ?, option_b = ?, option_c = ?,
                option_d = ?, correct_answer = ?, marks = ?, explanation = ?
            WHERE id = ?
        """, (subject, question, op_a, op_b, op_c, op_d, ans, marks, explanation, question_id))
        conn.commit()
        updated = cursor.rowcount
        conn.close()

        if updated == 0:
            return jsonify({"success": False, "message": "Question not found."}), 404
        return jsonify({"success": True, "message": "Question updated successfully!"})

    # DELETE
    cursor = conn.execute("DELETE FROM questions WHERE id = ?", (question_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    if deleted == 0:
        return jsonify({"success": False, "message": "Question not found."}), 404
    return jsonify({"success": True, "message": "Question deleted successfully."})


# ---------------- EXAMS ----------------

@app.route("/api/exams", methods=["GET", "POST"])
def handle_exams():
    conn = get_db()

    if request.method == "POST":
        data = request.get_json() or {}
        name = data.get("name", "").strip()
        subject = data.get("subject", "").strip()
        difficulty = data.get("difficulty", "Intermediate")
        num_q = int(data.get("num_questions", 0))
        marks = int(data.get("total_marks", 0))
        duration = int(data.get("duration", 0))

        if not name or not subject or num_q <= 0 or marks <= 0 or duration <= 0:
            conn.close()
            return jsonify({"success": False, "message": "Valid exam details are required."}), 400

        q_count = conn.execute("SELECT COUNT(*) FROM questions WHERE subject = ?", (subject,)).fetchone()[0]
        if q_count < num_q:
            conn.close()
            return jsonify({"success": False, "message": f"Only {q_count} questions available for {subject}. Please add more."}), 400

        cursor = conn.execute("""
            INSERT INTO exams (name, subject, difficulty, num_questions, total_marks, duration)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, subject, difficulty, num_q, marks, duration))
        exam_id = cursor.lastrowid

        selected_q = conn.execute("SELECT id FROM questions WHERE subject = ? ORDER BY RANDOM() LIMIT ?", (subject, num_q)).fetchall()
        for q in selected_q:
            conn.execute("INSERT OR IGNORE INTO exam_questions (exam_id, question_id) VALUES (?, ?)", (exam_id, q["id"]))

        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Exam created successfully!", "exam_id": exam_id})

    exams = conn.execute("SELECT * FROM exams ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify({"success": True, "exams": [dict(e) for e in exams]})


@app.route("/api/exams/<int:exam_id>", methods=["GET"])
def get_single_exam(exam_id):
    conn = get_db()
    exam = conn.execute("SELECT * FROM exams WHERE id = ?", (exam_id,)).fetchone()
    if not exam:
        conn.close()
        return jsonify({"success": False, "message": "Exam not found."}), 404

    # Ensure questions are linked
    linked_count = conn.execute("SELECT COUNT(*) FROM exam_questions WHERE exam_id = ?", (exam_id,)).fetchone()[0]
    if linked_count == 0:
        questions = conn.execute("SELECT id FROM questions WHERE subject = ? LIMIT ?", (exam["subject"], exam["num_questions"])).fetchall()
        for q in questions:
            conn.execute("INSERT OR IGNORE INTO exam_questions (exam_id, question_id) VALUES (?, ?)", (exam_id, q["id"]))
        conn.commit()

    questions = conn.execute("""
        SELECT q.id, q.subject, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.marks
        FROM exam_questions eq
        JOIN questions q ON eq.question_id = q.id
        WHERE eq.exam_id = ?
        ORDER BY eq.id
    """, (exam_id,)).fetchall()
    conn.close()

    return jsonify({
        "success": True,
        "exam": dict(exam),
        "questions": [dict(q) for q in questions]
    })


# ---------------- SUBMIT EXAM & DETAILED REVIEW ----------------

@app.route("/api/exams/<int:exam_id>/submit", methods=["POST"])
def submit_exam_review(exam_id):
    data = request.get_json() or {}
    student_id = data.get("student_id")
    answers = data.get("answers", {})

    if not student_id:
        return jsonify({"success": False, "message": "Student ID is required."}), 400

    conn = get_db()
    student = conn.execute("SELECT id, name, email FROM students WHERE id = ?", (student_id,)).fetchone()
    exam = conn.execute("SELECT * FROM exams WHERE id = ?", (exam_id,)).fetchone()

    if not exam:
        conn.close()
        return jsonify({"success": False, "message": "Exam not found."}), 404

    student_name = student["name"] if student else "Student"

    questions = conn.execute("""
        SELECT q.id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation, q.marks
        FROM exam_questions eq
        JOIN questions q ON eq.question_id = q.id
        WHERE eq.exam_id = ?
        ORDER BY eq.id
    """, (exam_id,)).fetchall()

    score = 0
    attempted = 0
    correct = 0
    wrong = 0
    review_list = []

    for q in questions:
        qid = str(q["id"])
        user_choice = answers.get(qid)
        if user_choice is None:
            user_choice = answers.get(int(qid))

        is_answered = user_choice is not None and str(user_choice).strip() != ""
        is_correct = False

        if is_answered:
            attempted += 1
            if str(user_choice).strip().upper() == str(q["correct_answer"]).strip().upper():
                score += int(q["marks"])
                correct += 1
                is_correct = True
            else:
                wrong += 1

        review_list.append({
            "id": q["id"],
            "question": q["question"],
            "option_a": q["option_a"],
            "option_b": q["option_b"],
            "option_c": q["option_c"],
            "option_d": q["option_d"],
            "user_answer": user_choice if is_answered else None,
            "correct_answer": q["correct_answer"],
            "is_correct": is_correct,
            "explanation": q["explanation"] or "Correct answer is Option " + q["correct_answer"],
            "marks": q["marks"]
        })

    total_marks = sum(int(q["marks"]) for q in questions)
    if total_marks <= 0:
        total_marks = exam["total_marks"] or 1

    percentage = round((score / total_marks) * 100, 2)

    # Save to database
    cursor = conn.execute("""
        INSERT INTO results (student_id, exam_id, score, total_marks, attempted, correct, wrong, total_questions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (student_id, exam_id, score, total_marks, attempted, correct, wrong, len(questions)))

    result_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Exam submitted successfully!",
        "result": {
            "id": result_id,
            "student_id": student_id,
            "student_name": student_name,
            "exam_id": exam_id,
            "exam_name": exam["name"],
            "score": score,
            "total_marks": total_marks,
            "percentage": percentage,
            "attempted": attempted,
            "correct": correct,
            "wrong": wrong,
            "total_questions": len(questions),
            "review": review_list
        }
    })


# ---------------- RESULTS & LEADERBOARD ----------------

@app.route("/api/results", methods=["GET"])
def get_results():
    conn = get_db()
    results = conn.execute("""
        SELECT r.id, r.student_id, r.exam_id, r.score, r.total_marks, r.attempted, r.correct, r.wrong,
               r.total_questions, r.submitted_at, s.name AS student_name, s.email AS student_email,
               e.name AS exam_name, e.subject AS subject
        FROM results r
        JOIN students s ON r.student_id = s.id
        JOIN exams e ON r.exam_id = e.id
        ORDER BY r.id DESC
    """).fetchall()
    conn.close()

    output = []
    for r in results:
        item = dict(r)
        item["percentage"] = round((item["score"] / item["total_marks"]) * 100, 1) if item["total_marks"] > 0 else 0
        output.append(item)

    return jsonify({"success": True, "results": output})


@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    conn = get_db()
    rows = conn.execute("""
        SELECT s.id AS student_id, s.name AS student_name,
               COUNT(r.id) AS exams_attempted,
               COALESCE(SUM(r.score), 0) AS total_score,
               COALESCE(SUM(r.total_marks), 0) AS total_possible
        FROM students s
        LEFT JOIN results r ON s.id = r.student_id
        GROUP BY s.id
        ORDER BY total_score DESC
    """).fetchall()
    conn.close()

    leaderboard = []
    for row in rows:
        tot_score = int(row["total_score"] or 0)
        tot_possible = int(row["total_possible"] or 0)
        pct = round((tot_score / tot_possible) * 100, 1) if tot_possible > 0 else 0
        leaderboard.append({
            "student_id": row["student_id"],
            "student_name": row["student_name"],
            "exams_attempted": row["exams_attempted"],
            "total_score": tot_score,
            "total_possible": tot_possible,
            "percentage": pct
        })

    return jsonify({"success": True, "leaderboard": leaderboard})


# =========================================================
# RUN APPLICATION
# =========================================================

if __name__ == "__main__":
    init_db()
    print("==================================================")
    print(" 🚀 ExamSphere Pro Backend Initialized Successfully")
    print(" Running at: http://127.0.0.1:5000")
    print("==================================================")
    app.run(debug=True)
