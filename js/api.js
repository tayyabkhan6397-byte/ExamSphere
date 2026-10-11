const API_BASE_URL = "http://127.0.0.1:5000/api";

// Initialize LocalStorage Mock Database with Rich Comprehensive Pre-Seeded Data
function initMockDB() {
    // Clear legacy minimal keys if question count is low
    const existingQ = JSON.parse(localStorage.getItem("es_questions") || "[]");
    if (existingQ.length < 20) {
        localStorage.removeItem("es_subjects");
        localStorage.removeItem("es_questions");
        localStorage.removeItem("es_exams");
    }

    if (!localStorage.getItem("es_users")) {
        const defaultUsers = [
            { id: 1, name: "System Administrator", email: "admin@examsphere.com", password: "admin123", role: "admin" },
            { id: 2, name: "Alex Morgan", email: "student@examsphere.com", password: "student123", role: "student" },
            { id: 3, name: "Sara Khan", email: "sara@examsphere.com", password: "sara123", role: "student" },
            { id: 4, name: "David Chen", email: "david@examsphere.com", password: "david123", role: "student" }
        ];
        localStorage.setItem("es_users", JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem("es_subjects")) {
        const defaultSubjects = [
            { id: 1, name: "Web Development" },
            { id: 2, name: "Data Structures & Algorithms" },
            { id: 3, name: "Python Programming" },
            { id: 4, name: "Database Systems (SQL)" },
            { id: 5, name: "Computer Networks & Security" },
            { id: 6, name: "General Aptitude & Logic" }
        ];
        localStorage.setItem("es_subjects", JSON.stringify(defaultSubjects));
    }

    if (!localStorage.getItem("es_questions")) {
        const defaultQuestions = [
            // 1. Web Development
            { id: 101, subject: "Web Development", question: "What does the 'typeof null' expression return in JavaScript?", option_a: "null", option_b: "undefined", option_c: "object", option_d: "number", correct_answer: "C", explanation: "In JavaScript, typeof null returns 'object' due to a legacy bug in the original language specification.", marks: 1 },
            { id: 102, subject: "Web Development", question: "Which HTML5 element is semantically intended for the primary navigation links of a page?", option_a: "<section>", option_b: "<nav>", option_c: "<aside>", option_d: "<header>", correct_answer: "B", explanation: "The <nav> tag specifies a section that contains primary navigation links.", marks: 1 },
            { id: 103, subject: "Web Development", question: "In CSS Flexbox, which property controls alignment along the main axis?", option_a: "align-items", option_b: "justify-content", option_c: "align-content", option_d: "flex-direction", correct_answer: "B", explanation: "justify-content aligns flex items along the main axis of the current flex container.", marks: 1 },
            { id: 104, subject: "Web Development", question: "Which HTTP status code signifies that a requested resource was successfully created?", option_a: "200 OK", option_b: "201 Created", option_c: "204 No Content", option_d: "301 Moved Permanently", correct_answer: "B", explanation: "201 Created indicates the request has been fulfilled and resulted in a new resource.", marks: 1 },
            { id: 105, subject: "Web Development", question: "What is the primary function of the JavaScript 'addEventListener' method?", option_a: "Modify CSS styles directly", option_b: "Register an event handler function on a DOM element", option_c: "Create a new HTTP GET request", option_d: "Bind a database query to a button", correct_answer: "B", explanation: "addEventListener attaches an event listener to a target DOM node.", marks: 1 },
            { id: 106, subject: "Web Development", question: "Which mechanism prevents Cross-Origin HTTP requests unless the server explicitly permits them?", option_a: "Content Security Policy (CSP)", option_b: "CORS (Cross-Origin Resource Sharing)", option_c: "XSS Protection", option_d: "SameSite Cookie Policy", correct_answer: "B", explanation: "CORS uses HTTP headers to tell browsers whether a web application can access resources from another origin.", marks: 1 },
            { id: 107, subject: "Web Development", question: "What is the purpose of the 'virtual DOM' in modern frontend frameworks like React?", option_a: "Store sensitive user passwords", option_b: "Minimize expensive real DOM re-renders by calculating diffs in memory", option_c: "Bypass CSS styling rules", option_d: "Serve static assets faster over CDN", correct_answer: "B", explanation: "Virtual DOM minimizes performance overhead by batching real DOM mutations.", marks: 1 },
            { id: 108, subject: "Web Development", question: "Which CSS unit is relative to the font-size of the root (<html>) element?", option_a: "em", option_b: "rem", option_c: "vh", option_d: "px", correct_answer: "B", explanation: "rem stands for 'root em' and scales cleanly across viewport dimensions.", marks: 1 },

            // 2. Data Structures & Algorithms
            { id: 201, subject: "Data Structures & Algorithms", question: "What is the worst-case time complexity of QuickSort?", option_a: "O(n log n)", option_b: "O(n^2)", option_c: "O(n)", option_d: "O(log n)", correct_answer: "B", explanation: "QuickSort degrades to O(n^2) when an unbalanced pivot is chosen repeatedly.", marks: 2 },
            { id: 202, subject: "Data Structures & Algorithms", question: "Which data structure follows the LIFO (Last In First Out) principle?", option_a: "Queue", option_b: "Stack", option_c: "Binary Heap", option_d: "Circular Queue", correct_answer: "B", explanation: "A Stack removes the most recently pushed element first (LIFO).", marks: 1 },
            { id: 203, subject: "Data Structures & Algorithms", question: "What is the average time complexity to search an element in a Hash Table?", option_a: "O(1)", option_b: "O(log n)", option_c: "O(n)", option_d: "O(n log n)", correct_answer: "A", explanation: "Hash tables offer average O(1) constant time lookups using hash keys.", marks: 1 },
            { id: 204, subject: "Data Structures & Algorithms", question: "Which traversal of a Binary Search Tree (BST) yields elements in non-decreasing sorted order?", option_a: "Pre-order", option_b: "In-order", option_c: "Post-order", option_d: "Level-order", correct_answer: "B", explanation: "In-order traversal (Left, Root, Right) of a BST always yields sorted ascending values.", marks: 2 },
            { id: 205, subject: "Data Structures & Algorithms", question: "Which data structure is primarily used by Dijkstra's algorithm to retrieve the minimum distance vertex efficiently?", option_a: "Stack", option_b: "Priority Queue (Min-Heap)", option_c: "Deque", option_d: "Disjoint Set", correct_answer: "B", explanation: "A Min-Heap allows extracting the closest unvisited vertex in O(log V) time.", marks: 2 },
            { id: 206, subject: "Data Structures & Algorithms", question: "What is the minimum number of queues needed to implement a Stack?", option_a: "1", option_b: "2", option_c: "3", option_d: "4", correct_answer: "B", explanation: "A stack can be simulated with 2 FIFO queues.", marks: 1 },
            { id: 207, subject: "Data Structures & Algorithms", question: "Which algorithmic paradigm does the Merge Sort algorithm employ?", option_a: "Greedy approach", option_b: "Dynamic Programming", option_c: "Divide and Conquer", option_d: "Backtracking", correct_answer: "C", explanation: "Merge sort recursively divides the problem into subproblems and merges solutions.", marks: 1 },
            { id: 208, subject: "Data Structures & Algorithms", question: "What is the space complexity of Depth First Search (DFS) on a tree of height h?", option_a: "O(1)", option_b: "O(h)", option_c: "O(2^h)", option_d: "O(n^2)", correct_answer: "B", explanation: "DFS requires memory proportional to the maximum height of the recursion stack.", marks: 2 },

            // 3. Python Programming
            { id: 301, subject: "Python Programming", question: "Which of the following Python data structures is mutable?", option_a: "tuple", option_b: "frozenset", option_c: "list", option_d: "str", correct_answer: "C", explanation: "Lists in Python can be modified in-place, unlike immutable tuples, frozensets, and strings.", marks: 1 },
            { id: 302, subject: "Python Programming", question: "What is the output of bool([]) in Python?", option_a: "True", option_b: "False", option_c: "None", option_d: "Raises TypeError", correct_answer: "B", explanation: "Empty sequences and collections evaluate to False in Python truth testing.", marks: 1 },
            { id: 303, subject: "Python Programming", question: "What keyword is used to create an anonymous inline function in Python?", option_a: "def", option_b: "lambda", option_c: "func", option_d: "inline", correct_answer: "B", explanation: "The lambda keyword defines anonymous one-line functions.", marks: 1 },
            { id: 304, subject: "Python Programming", question: "Which statement correctly describes Python's Global Interpreter Lock (GIL)?", option_a: "Allows parallel multi-core execution of pure Python threads", option_b: "A mutex that prevents multiple native threads from executing Python bytecodes simultaneously", option_c: "A garbage collection tool for cyclical references", option_d: "A security sandbox for unverified scripts", correct_answer: "B", explanation: "The GIL ensures thread safety by executing only one Python bytecode thread at a time.", marks: 2 },
            { id: 305, subject: "Python Programming", question: "What is the purpose of the 'yield' keyword inside a Python function?", option_a: "Terminates the program immediately", option_b: "Turns the function into a generator that produces a sequence of values lazily", option_c: "Raises an uncaught exception", option_d: "Imports an external package", correct_answer: "B", explanation: "yield pauses the function and yields values sequentially on next() calls.", marks: 1 },
            { id: 306, subject: "Python Programming", question: "Which built-in module is used in Python for regular expressions?", option_a: "regex_lib", option_b: "re", option_c: "pyregex", option_d: "match", correct_answer: "B", explanation: "The standard module 're' provides regex pattern compilation and matching.", marks: 1 },
            { id: 307, subject: "Python Programming", question: "What will `print(type((1)))` and `print(type((1,)))` output in Python?", option_a: "tuple and tuple", option_b: "int and tuple", option_c: "int and int", option_d: "tuple and list", correct_answer: "B", explanation: "(1) is parenthesized integer, while (1,) creates a tuple due to the trailing comma.", marks: 1 },
            { id: 308, subject: "Python Programming", question: "How is method inheritance called from a child class in Python 3?", option_a: "super().__init__()", option_b: "parent().__init__()", option_c: "base().__init__()", option_d: "self.super()", correct_answer: "A", explanation: "super().__init__() delegates method calls to the parent class dynamically.", marks: 1 },

            // 4. Database Systems (SQL)
            { id: 401, subject: "Database Systems (SQL)", question: "What does SQL stand for?", option_a: "Structured Query Language", option_b: "Sequential Question Logic", option_c: "Standard Quick Link", option_d: "System Query Link", correct_answer: "A", explanation: "SQL stands for Structured Query Language.", marks: 1 },
            { id: 402, subject: "Database Systems (SQL)", question: "Which SQL constraint uniquely identifies each record in a database table?", option_a: "UNIQUE", option_b: "FOREIGN KEY", option_c: "PRIMARY KEY", option_d: "CHECK", correct_answer: "C", explanation: "A PRIMARY KEY uniquely identifies rows and cannot contain null values.", marks: 1 },
            { id: 403, subject: "Database Systems (SQL)", question: "Which clause is used in SQL to filter the results of an aggregate function?", option_a: "WHERE", option_b: "HAVING", option_c: "GROUP BY", option_d: "ORDER BY", correct_answer: "B", explanation: "HAVING filters groups created by GROUP BY according to aggregate conditions.", marks: 1 },
            { id: 404, subject: "Database Systems (SQL)", question: "What type of JOIN returns all rows from the left table, and matching rows from the right table?", option_a: "INNER JOIN", option_b: "LEFT JOIN", option_c: "RIGHT JOIN", option_d: "FULL OUTER JOIN", correct_answer: "B", explanation: "LEFT JOIN retains all records from the left side regardless of matches.", marks: 1 },
            { id: 405, subject: "Database Systems (SQL)", question: "In ACID properties of database transactions, what does the 'I' represent?", option_a: "Integrity", option_b: "Isolation", option_c: "Inheritance", option_d: "Immutability", correct_answer: "B", explanation: "Isolation ensures concurrent transactions execute without data bleeding.", marks: 1 },
            { id: 406, subject: "Database Systems (SQL)", question: "Which normal form eliminates partial dependency on a composite primary key?", option_a: "1NF", option_b: "2NF", option_c: "3NF", option_d: "BCNF", correct_answer: "B", explanation: "2NF requires full functional dependency on the entire candidate key.", marks: 2 },
            { id: 407, subject: "Database Systems (SQL)", question: "Which command is used to permanently remove a table along with its structure and data?", option_a: "DELETE TABLE", option_b: "TRUNCATE TABLE", option_c: "DROP TABLE", option_d: "REMOVE TABLE", correct_answer: "C", explanation: "DROP TABLE completely deletes table schema and data.", marks: 1 },
            { id: 408, subject: "Database Systems (SQL)", question: "What is the primary benefit of creating an index on a frequently queried column?", option_a: "Reduces storage space on disk", option_b: "Significantly speeds up data retrieval queries", option_c: "Automatically encrypts column data", option_d: "Enforces foreign key relationships", correct_answer: "B", explanation: "B-Tree indexes speed up lookups from O(n) table scans to O(log n).", marks: 1 },

            // 5. Computer Networks & Security
            { id: 501, subject: "Computer Networks & Security", question: "How many layers are defined in the OSI reference model?", option_a: "4", option_b: "5", option_c: "7", option_d: "8", correct_answer: "C", explanation: "The OSI model consists of 7 layers from Physical up to Application.", marks: 1 },
            { id: 502, subject: "Computer Networks & Security", question: "Which transport layer protocol provides connection-oriented, reliable, and ordered delivery of data packets?", option_a: "UDP", option_b: "TCP", option_c: "ICMP", option_d: "IP", correct_answer: "B", explanation: "TCP establishes a three-way handshake and handles acknowledgments and retransmissions.", marks: 1 },
            { id: 503, subject: "Computer Networks & Security", question: "On which default port number does an HTTPS web server listen?", option_a: "80", option_b: "443", option_c: "8080", option_d: "22", correct_answer: "B", explanation: "Standard HTTPS listens on port 443; HTTP uses port 80.", marks: 1 },
            { id: 504, subject: "Computer Networks & Security", question: "What does DNS stand for in computer networking?", option_a: "Domain Name System", option_b: "Digital Network Server", option_c: "Direct Network Switch", option_d: "Data Node Standard", correct_answer: "A", explanation: "Domain Name System translates domain names to numerical IP addresses.", marks: 1 },
            { id: 505, subject: "Computer Networks & Security", question: "What type of attack floods a server with overwhelming illegitimate traffic to make it unavailable?", option_a: "Man-in-the-Middle (MitM)", option_b: "SQL Injection", option_c: "Distributed Denial of Service (DDoS)", option_d: "Cross-Site Scripting (XSS)", correct_answer: "C", explanation: "DDoS overwhelms target bandwidth and resources using botnets.", marks: 1 },
            { id: 506, subject: "Computer Networks & Security", question: "Which asymmetric encryption algorithm relies on the mathematical difficulty of factoring large prime numbers?", option_a: "AES", option_b: "DES", option_c: "RSA", option_d: "SHA-256", correct_answer: "C", explanation: "RSA asymmetric encryption is grounded in prime factorization complexity.", marks: 2 },
            { id: 507, subject: "Computer Networks & Security", question: "What protocol is used to securely log in and execute commands on a remote server?", option_a: "Telnet", option_b: "FTP", option_c: "SSH", option_d: "HTTP", correct_answer: "C", explanation: "SSH (Secure Shell) encrypts terminal sessions over insecure networks.", marks: 1 },
            { id: 508, subject: "Computer Networks & Security", question: "What is the primary purpose of a Subnet Mask in IPv4 networking?", option_a: "Encrypt outgoing network packets", option_b: "Distinguish between the network portion and the host portion of an IP address", option_c: "Assign domain names dynamically", option_d: "Filter spam email traffic", correct_answer: "B", explanation: "A subnet mask determines which bits correspond to the network vs individual host.", marks: 1 },

            // 6. General Aptitude & Logic
            { id: 601, subject: "General Aptitude & Logic", question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ...?", option_a: "40", option_b: "42", option_c: "44", option_d: "48", correct_answer: "B", explanation: "Differences are +4, +6, +8, +10, +12. 30 + 12 = 42 (n*(n+1)).", marks: 1 },
            { id: 602, subject: "General Aptitude & Logic", question: "A train 150 meters long passes a telegraph post in 10 seconds. What is the speed of the train in km/h?", option_a: "45 km/h", option_b: "54 km/h", option_c: "60 km/h", option_d: "72 km/h", correct_answer: "B", explanation: "Speed = 150/10 = 15 m/s. In km/h: 15 * 18/5 = 54 km/h.", marks: 1 },
            { id: 603, subject: "General Aptitude & Logic", question: "If 5 workers can build a wall in 12 days, how many days will it take 3 workers at the same rate?", option_a: "15 days", option_b: "18 days", option_c: "20 days", option_d: "24 days", correct_answer: "C", explanation: "Total work = 5 * 12 = 60 man-days. Days for 3 workers = 60 / 3 = 20 days.", marks: 1 },
            { id: 604, subject: "General Aptitude & Logic", question: "A bag contains 4 red and 6 blue balls. What is the probability of drawing a red ball at random?", option_a: "2/5", option_b: "3/5", option_c: "1/2", option_d: "1/5", correct_answer: "A", explanation: "Total = 10 balls. P(Red) = 4/10 = 2/5 (40%).", marks: 1 },
            { id: 605, subject: "General Aptitude & Logic", question: "If 'CODING' is encoded as 'DPEJOH', how is 'FLOWER' encoded in that pattern?", option_a: "GMPXFS", option_b: "GMNXFS", option_c: "ENNVDS", option_d: "GLPXFS", correct_answer: "A", explanation: "Every letter shifts forward by +1: F->G, L->M, O->P, W->X, E->F, R->S.", marks: 1 },
            { id: 606, subject: "General Aptitude & Logic", question: "What is the average of first five multiples of 7?", option_a: "14", option_b: "21", option_c: "28", option_d: "35", correct_answer: "B", explanation: "Multiples: 7, 14, 21, 28, 35. Average = 105 / 5 = 21.", marks: 1 }
        ];
        localStorage.setItem("es_questions", JSON.stringify(defaultQuestions));
    }

    if (!localStorage.getItem("es_exams")) {
        const defaultExams = [
            { id: 1, name: "Web Development Certification", subject: "Web Development", difficulty: "Intermediate", num_questions: 8, total_marks: 8, duration: 15 },
            { id: 2, name: "Data Structures & Algorithms Mastery", subject: "Data Structures & Algorithms", difficulty: "Advanced", num_questions: 8, total_marks: 13, duration: 20 },
            { id: 3, name: "Python Core Programming Test", subject: "Python Programming", difficulty: "Intermediate", num_questions: 8, total_marks: 9, duration: 15 },
            { id: 4, name: "Database & SQL Specialist Exam", subject: "Database Systems (SQL)", difficulty: "Intermediate", num_questions: 8, total_marks: 9, duration: 15 },
            { id: 5, name: "Computer Networks & Cyber Security", subject: "Computer Networks & Security", difficulty: "Advanced", num_questions: 8, total_marks: 9, duration: 15 },
            { id: 6, name: "General Aptitude & Logic Assessment", subject: "General Aptitude & Logic", difficulty: "Beginner", num_questions: 6, total_marks: 6, duration: 10 }
        ];
        localStorage.setItem("es_exams", JSON.stringify(defaultExams));
    }

    if (!localStorage.getItem("es_results")) {
        const defaultResults = [
            { id: 1, student_id: 2, student_name: "Alex Morgan", exam_id: 1, exam_name: "Web Development Certification", score: 7, total_marks: 8, percentage: 87.5, correct: 7, wrong: 1, attempted: 8, date: "2026-09-15" },
            { id: 2, student_id: 3, student_name: "Sara Khan", exam_id: 2, exam_name: "Data Structures & Algorithms Mastery", score: 11, total_marks: 13, percentage: 84.6, correct: 7, wrong: 1, attempted: 8, date: "2026-09-14" },
            { id: 3, student_id: 4, student_name: "David Chen", exam_id: 3, exam_name: "Python Core Programming Test", score: 8, total_marks: 9, percentage: 88.9, correct: 7, wrong: 1, attempted: 8, date: "2026-09-13" }
        ];
        localStorage.setItem("es_results", JSON.stringify(defaultResults));
    }
}

initMockDB();

// Mock API Handler for Offline / Browser-only execution
function mockApiHandler(endpoint, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};

    // 1. /login
    if (endpoint === "/login" && method === "POST") {
        const users = JSON.parse(localStorage.getItem("es_users") || "[]");
        const user = users.find(u => u.email.toLowerCase() === body.email.toLowerCase() && u.password === body.password);
        if (!user) {
            throw new Error("Invalid email or password.");
        }
        if (body.role && user.role !== body.role) {
            throw new Error(`Account exists, but not with role '${body.role}'.`);
        }
        return {
            success: true,
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        };
    }

    // 2. /register
    if (endpoint === "/register" && method === "POST") {
        const users = JSON.parse(localStorage.getItem("es_users") || "[]");
        if (users.some(u => u.email.toLowerCase() === body.email.toLowerCase())) {
            throw new Error("Email is already registered.");
        }
        const newUser = {
            id: Date.now(),
            name: body.name,
            email: body.email,
            password: body.password,
            role: "student"
        };
        users.push(newUser);
        localStorage.setItem("es_users", JSON.stringify(users));
        return { success: true, message: "Account created successfully!" };
    }

    // 3. /subjects
    if (endpoint === "/subjects") {
        const subjects = JSON.parse(localStorage.getItem("es_subjects") || "[]");
        if (method === "POST") {
            if (subjects.some(s => s.name.toLowerCase() === body.name.toLowerCase())) {
                throw new Error("Subject already exists.");
            }
            const newSub = { id: Date.now(), name: body.name };
            subjects.push(newSub);
            localStorage.setItem("es_subjects", JSON.stringify(subjects));
            return { success: true, message: "Subject added successfully!", subject: newSub };
        }
        return { success: true, subjects: subjects };
    }

    // 4. /questions
    if (endpoint.startsWith("/questions")) {
        let questions = JSON.parse(localStorage.getItem("es_questions") || "[]");
        if (method === "DELETE") {
            const id = Number(endpoint.split("/")[2]);
            questions = questions.filter(q => q.id !== id);
            localStorage.setItem("es_questions", JSON.stringify(questions));
            return { success: true, message: "Question deleted successfully." };
        }
        if (method === "PUT") {
            const id = Number(endpoint.split("/")[2]);
            const index = questions.findIndex(q => q.id === id);
            if (index === -1) throw new Error("Question not found");
            questions[index] = {
                ...questions[index],
                subject: body.subject || questions[index].subject,
                question: body.question || questions[index].question,
                option_a: body.option_a || questions[index].option_a,
                option_b: body.option_b || questions[index].option_b,
                option_c: body.option_c || questions[index].option_c,
                option_d: body.option_d || questions[index].option_d,
                correct_answer: (body.correct_answer || questions[index].correct_answer).toUpperCase(),
                explanation: body.explanation !== undefined ? body.explanation : questions[index].explanation,
                marks: Number(body.marks) || questions[index].marks || 1,
                difficulty: body.difficulty || questions[index].difficulty || "Medium"
            };
            localStorage.setItem("es_questions", JSON.stringify(questions));
            return { success: true, message: "Question updated successfully!" };
        }
        if (method === "POST") {
            // Check if bulk import
            if (Array.isArray(body.questions)) {
                let count = 0;
                body.questions.forEach(item => {
                    if (item.question && item.option_a && item.option_b && item.correct_answer) {
                        questions.unshift({
                            id: Date.now() + Math.floor(Math.random() * 1000),
                            subject: item.subject || "General",
                            question: item.question,
                            option_a: item.option_a,
                            option_b: item.option_b,
                            option_c: item.option_c || "",
                            option_d: item.option_d || "",
                            correct_answer: (item.correct_answer || "A").toUpperCase(),
                            explanation: item.explanation || "",
                            marks: Number(item.marks) || 1,
                            difficulty: item.difficulty || "Medium"
                        });
                        count++;
                    }
                });
                localStorage.setItem("es_questions", JSON.stringify(questions));
                return { success: true, message: `Successfully imported ${count} questions!` };
            }

            const newQ = {
                id: Date.now(),
                subject: body.subject,
                question: body.question,
                option_a: body.option_a,
                option_b: body.option_b,
                option_c: body.option_c,
                option_d: body.option_d,
                correct_answer: body.correct_answer,
                explanation: body.explanation || "",
                marks: Number(body.marks) || 1,
                difficulty: body.difficulty || "Medium"
            };
            questions.unshift(newQ);
            localStorage.setItem("es_questions", JSON.stringify(questions));
            return { success: true, message: "Question added successfully!", id: newQ.id };
        }
        const urlParams = new URLSearchParams(endpoint.split("?")[1] || "");
        const subject = urlParams.get("subject");
        if (subject) {
            questions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
        }
        return { success: true, questions: questions };
    }

    // 5. /students
    if (endpoint === "/students") {
        const users = JSON.parse(localStorage.getItem("es_users") || "[]");
        const students = users.filter(u => u.role === "student");
        return { success: true, students: students };
    }

    // 6. /exams
    if (endpoint === "/exams") {
        const exams = JSON.parse(localStorage.getItem("es_exams") || "[]");
        if (method === "POST") {
            const newExam = {
                id: Date.now(),
                name: body.name,
                subject: body.subject,
                difficulty: body.difficulty || "Intermediate",
                num_questions: Number(body.num_questions),
                total_marks: Number(body.total_marks),
                duration: Number(body.duration)
            };
            exams.unshift(newExam);
            localStorage.setItem("es_exams", JSON.stringify(exams));
            return { success: true, message: "Exam created successfully!", id: newExam.id };
        }
        return { success: true, exams: exams };
    }

    // 7. /exams/:id (single exam with question list)
    if (endpoint.startsWith("/exams/") && !endpoint.includes("/submit")) {
        const examId = Number(endpoint.split("/")[2]);
        const exams = JSON.parse(localStorage.getItem("es_exams") || "[]");
        const exam = exams.find(e => e.id === examId);
        if (!exam) throw new Error("Exam not found");

        const allQuestions = JSON.parse(localStorage.getItem("es_questions") || "[]");
        let examQuestions = allQuestions.filter(q => q.subject.toLowerCase() === exam.subject.toLowerCase());
        if (examQuestions.length < exam.num_questions) {
            const others = allQuestions.filter(q => q.subject.toLowerCase() !== exam.subject.toLowerCase());
            examQuestions = examQuestions.concat(others);
        }
        examQuestions = examQuestions.slice(0, exam.num_questions);

        return { success: true, exam: exam, questions: examQuestions };
    }

    // 8. /exams/:id/submit
    if (endpoint.includes("/submit") && method === "POST") {
        const examId = Number(endpoint.split("/")[2]);
        const exams = JSON.parse(localStorage.getItem("es_exams") || "[]");
        const exam = exams.find(e => e.id === examId);
        if (!exam) throw new Error("Exam not found");

        const users = JSON.parse(localStorage.getItem("es_users") || "[]");
        const student = users.find(u => u.id === body.student_id);
        const studentName = student ? student.name : "Student";

        const allQuestions = JSON.parse(localStorage.getItem("es_questions") || "[]");
        let examQuestions = allQuestions.filter(q => q.subject.toLowerCase() === exam.subject.toLowerCase());
        if (examQuestions.length < exam.num_questions) {
            const others = allQuestions.filter(q => q.subject.toLowerCase() !== exam.subject.toLowerCase());
            examQuestions = examQuestions.concat(others);
        }
        examQuestions = examQuestions.slice(0, exam.num_questions);

        const userAnswers = body.answers || {};

        let correct = 0;
        let wrong = 0;
        let score = 0;
        const reviewList = [];

        examQuestions.forEach(q => {
            const qid = String(q.id);
            const userChoice = userAnswers[qid] !== undefined ? userAnswers[qid] : userAnswers[Number(qid)];
            const isAnswered = userChoice !== undefined && userChoice !== null && String(userChoice).trim() !== "";
            let isCorrect = false;

            if (isAnswered) {
                if (String(userChoice).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase()) {
                    correct++;
                    score += (q.marks || 1);
                    isCorrect = true;
                } else {
                    wrong++;
                }
            }

            reviewList.push({
                id: q.id,
                question: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                user_answer: isAnswered ? userChoice : null,
                correct_answer: q.correct_answer,
                is_correct: isCorrect,
                explanation: q.explanation || "Correct answer is Option " + q.correct_answer,
                marks: q.marks || 1
            });
        });

        const calculatedTotal = examQuestions.reduce((acc, curr) => acc + (curr.marks || 1), 0);
        const totalMarks = calculatedTotal > 0 ? calculatedTotal : (exam.total_marks || 1);
        const percentage = Math.round((score / totalMarks) * 100);
        const attempted = Object.keys(userAnswers).length;

        const results = JSON.parse(localStorage.getItem("es_results") || "[]");
        const resultRecord = {
            id: Date.now(),
            student_id: body.student_id,
            student_name: studentName,
            exam_id: exam.id,
            exam_name: exam.name,
            score: score,
            total_marks: totalMarks,
            percentage: percentage,
            correct: correct,
            wrong: wrong,
            attempted: attempted,
            total_questions: examQuestions.length,
            review: reviewList,
            date: new Date().toLocaleDateString()
        };
        results.unshift(resultRecord);
        localStorage.setItem("es_results", JSON.stringify(results));

        return {
            success: true,
            message: "Exam submitted successfully!",
            result: resultRecord
        };
    }

    // 9. /results
    if (endpoint === "/results") {
        const results = JSON.parse(localStorage.getItem("es_results") || "[]");
        return { success: true, results: results };
    }

    // 10. /leaderboard
    if (endpoint === "/leaderboard") {
        const results = JSON.parse(localStorage.getItem("es_results") || "[]");
        const studentMap = {};

        results.forEach(r => {
            const name = r.student_name || "Student";
            if (!studentMap[name]) {
                studentMap[name] = { student_name: name, exams_attempted: 0, total_score: 0, total_possible: 0 };
            }
            studentMap[name].exams_attempted += 1;
            studentMap[name].total_score += Number(r.score || 0);
            studentMap[name].total_possible += Number(r.total_marks || 0);
        });

        const leaderboard = Object.values(studentMap).map(s => ({
            student_name: s.student_name,
            exams_attempted: s.exams_attempted,
            total_score: s.total_score,
            total_possible: s.total_possible,
            percentage: s.total_possible > 0 ? Math.round((s.total_score / s.total_possible) * 100) : 0
        })).sort((a, b) => b.total_score - a.total_score);

        return { success: true, leaderboard: leaderboard.slice(0, 10) };
    }

    // 11. /students/:id (PUT)
    if (endpoint.startsWith("/students/") && options.method === "PUT") {
        const id = parseInt(endpoint.split("/")[2]);
        const body = JSON.parse(options.body || "{}");
        const users = JSON.parse(localStorage.getItem("es_users") || "[]");
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
            users[idx].name = body.name || users[idx].name;
            users[idx].email = body.email || users[idx].email;
            if (body.avatar !== undefined) users[idx].avatar = body.avatar;
            localStorage.setItem("es_users", JSON.stringify(users));

            // Also update current session user if same
            const cur = JSON.parse(localStorage.getItem("user") || "{}");
            if (cur.id === id) {
                cur.name = users[idx].name;
                cur.email = users[idx].email;
                cur.avatar = users[idx].avatar;
                localStorage.setItem("user", JSON.stringify(cur));
            }
            return { success: true, message: "Profile updated successfully!", user: users[idx] };
        }
        return { success: false, message: "User not found." };
    }

    // 12. /students/:id/change-password (POST)
    if (endpoint.includes("/change-password") && options.method === "POST") {
        const parts = endpoint.split("/");
        const id = parseInt(parts[2]);
        const body = JSON.parse(options.body || "{}");
        const users = JSON.parse(localStorage.getItem("es_users") || "[]");
        const user = users.find(u => u.id === id);
        if (!user) return { success: false, message: "User not found." };
        if (user.password !== body.current_password) {
            return { success: false, message: "Current password is incorrect." };
        }
        user.password = body.new_password;
        localStorage.setItem("es_users", JSON.stringify(users));
        return { success: true, message: "Password updated successfully!" };
    }

    // 13. /students/:id (DELETE)
    if (endpoint.startsWith("/students/") && options.method === "DELETE") {
        const id = parseInt(endpoint.split("/")[2]);
        let users = JSON.parse(localStorage.getItem("es_users") || "[]");
        users = users.filter(u => u.id !== id);
        localStorage.setItem("es_users", JSON.stringify(users));
        let results = JSON.parse(localStorage.getItem("es_results") || "[]");
        results = results.filter(r => r.student_id !== id);
        localStorage.setItem("es_results", JSON.stringify(results));
        return { success: true, message: "Student account deleted." };
    }

    // 14. /results/student/:id (DELETE)
    if (endpoint.startsWith("/results/student/") && options.method === "DELETE") {
        const id = parseInt(endpoint.split("/")[3]);
        let results = JSON.parse(localStorage.getItem("es_results") || "[]");
        results = results.filter(r => r.student_id !== id);
        localStorage.setItem("es_results", JSON.stringify(results));
        return { success: true, message: "Examination history reset successfully." };
    }

    throw new Error(`Endpoint ${endpoint} not handled in mock database.`);
}

async function apiRequest(endpoint, options = {}) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1600);

        const response = await fetch(
            API_BASE_URL + endpoint,
            {
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                },
                ...options
            }
        );

        clearTimeout(timeoutId);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;

    } catch (error) {
        console.warn("Flask server at http://127.0.0.1:5000 is not running. Using LocalStorage Mock Database fallback seamlessly.", error);
        return mockApiHandler(endpoint, options);
    }
}

const API = {
    login: (data) => apiRequest("/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data) => apiRequest("/register", { method: "POST", body: JSON.stringify(data) }),
    getQuestions: (subject) => apiRequest(subject ? `/questions?subject=${encodeURIComponent(subject)}` : "/questions"),
    addQuestion: (data) => apiRequest("/questions", { method: "POST", body: JSON.stringify(data) }),
    updateQuestion: (id, data) => apiRequest(`/questions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    importQuestions: (questionsList) => apiRequest("/questions", { method: "POST", body: JSON.stringify({ questions: questionsList }) }),
    deleteQuestion: (id) => apiRequest(`/questions/${id}`, { method: "DELETE" }),
    getStudents: () => apiRequest("/students"),
    updateStudent: (id, data) => apiRequest(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    changePassword: (id, data) => apiRequest(`/students/${id}/change-password`, { method: "POST", body: JSON.stringify(data) }),
    deleteStudent: (id) => apiRequest(`/students/${id}`, { method: "DELETE" }),
    resetResults: (id) => apiRequest(`/results/student/${id}`, { method: "DELETE" }),
    getSubjects: () => apiRequest("/subjects"),
    addSubject: (data) => apiRequest("/subjects", { method: "POST", body: JSON.stringify(data) }),
    getExams: () => apiRequest("/exams"),
    getExam: (id) => apiRequest(`/exams/${id}`),
    createExam: (data) => apiRequest("/exams", { method: "POST", body: JSON.stringify(data) }),
    submitExam: (examId, data) => apiRequest(`/exams/${examId}/submit`, { method: "POST", body: JSON.stringify(data) }),
    getResults: () => apiRequest("/results"),
    getLeaderboard: () => apiRequest("/leaderboard")
};
