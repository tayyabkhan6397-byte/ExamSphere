import sqlite3

DATABASE = "exam.db"


def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def init_db():

    db = get_db()
    cursor = db.cursor()

    # USERS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)

    # SUBJECTS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subjects(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    """)

    # QUESTIONS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS questions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            question TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            marks INTEGER DEFAULT 1
        )
    """)

    # EXAMS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exams(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            num_questions INTEGER NOT NULL,
            total_marks INTEGER NOT NULL,
            duration_minutes INTEGER NOT NULL
        )
    """)

    # RESULTS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS results(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            student_name TEXT,
            exam_name TEXT,
            score INTEGER,
            total_marks INTEGER
        )
    """)

    # DEFAULT ADMIN
    cursor.execute("""
        INSERT OR IGNORE INTO users
        (name, username, password, role)
        VALUES (?, ?, ?, ?)
    """, (
        "Administrator",
        "admin@examsphere.com",
        "admin123",
        "admin"
    ))

    # DEFAULT STUDENT
    cursor.execute("""
        INSERT OR IGNORE INTO users
        (name, username, password, role)
        VALUES (?, ?, ?, ?)
    """, (
        "Demo Student",
        "student@examsphere.com",
        "student123",
        "student"
    ))

    # DEFAULT SUBJECT + SAMPLE QUESTIONS so the app has data to show
    cursor.execute(
        "INSERT OR IGNORE INTO subjects(name) VALUES(?)",
        ("Data Structures",)
    )

    sample_count = cursor.execute(
        "SELECT COUNT(*) FROM questions WHERE subject = ?",
        ("Data Structures",)
    ).fetchone()[0]

    if sample_count == 0:
        sample_questions = [
            ("Data Structures",
             "Which data structure follows LIFO (Last In First Out)?",
             "Queue", "Stack", "Linked List", "Array", "B", 1),
            ("Data Structures",
             "Which data structure follows FIFO (First In First Out)?",
             "Stack", "Array", "Queue", "Tree", "C", 1),
            ("Data Structures",
             "What is the time complexity of binary search?",
             "O(n)", "O(log n)", "O(n^2)", "O(1)", "B", 1),
            ("Data Structures",
             "Which data structure is used to implement recursion?",
             "Queue", "Array", "Stack", "Graph", "C", 1),
            ("Data Structures",
             "In a max-heap, the largest element is always at the:",
             "Leaf node", "Root", "Middle", "Last index", "B", 1),
        ]
        cursor.executemany("""
            INSERT INTO questions
            (subject, question, option_a, option_b, option_c,
             option_d, correct_answer, marks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_questions)

    exam_count = cursor.execute(
        "SELECT COUNT(*) FROM exams"
    ).fetchone()[0]

    if exam_count == 0:
        cursor.execute("""
            INSERT INTO exams
            (name, subject, num_questions, total_marks, duration_minutes)
            VALUES (?, ?, ?, ?, ?)
        """, ("Data Structures Basics", "Data Structures", 5, 5, 10))

    db.commit()
    db.close()
