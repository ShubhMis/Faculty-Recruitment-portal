-- General Instructions
-- 1.	The .sql files are run automatically, so please ensure that there are no syntax errors in the file. If we are unable to run your file, you get an automatic reduction to 0 marks.
-- Comment in MYSQL 
-- General Instructions
-- 1.	The .sql files are run automatically, so please ensure that there are no syntax errors in the file. If we are unable to run your file, you get an automatic reduction to 0 marks.
-- Comment in MYSQL 
create database tut3;
use tut3
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(255),
    credit_hours INT,
    instructor_id INT,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);

INSERT INTO courses (course_id, course_name, credit_hours, instructor_id) VALUES
(101, 'Mathematics', 3, 1),
(102, 'Physics', 4, 2),
(103, 'History', 3, 3),
(104, 'Chemistry', 4, 1),
(105, 'Computer Science', 3, 2);

CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    grade VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

INSERT INTO enrollments (enrollment_id, student_id, course_id, enrollment_date, grade) VALUES
(1, 1, 101, '2022-09-01', 'A'),
(2, 2, 102, '2022-09-03', 'B+'),
(3, 3, 104, '2022-09-05', 'A-'),
(4, 4, 103, '2022-09-07', 'B'),
(5, 5, 105, '2022-09-10', 'A');

CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100)
);

INSERT INTO instructors (instructor_id, first_name, last_name, email) VALUES
(1, 'Dr. Akhil', 'Singh', 'drsingh@example.com'),
(2, 'Dr. Neha', 'Agarwal', 'dragarwal@example.com'),
(3, 'Dr. Nitin', 'Warrier', 'drwarrier@example.com');

CREATE TABLE students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INT,
    city VARCHAR(50),
    state VARCHAR(50)
);


INSERT INTO students (student_id, first_name, last_name, age, city, state) VALUES
(1, 'Rahul', 'Sharma', 21, 'Delhi', 'Delhi'),
(2, 'Pooja', 'Patel', 20, 'Mumbai', 'Maharashtra'),
(3, 'Krishna', 'Singh', 22, 'Lucknow', 'Uttar Pradesh'),
(4, 'Anjali', 'Reddy', 23, 'Hyderabad', 'Telangana'),
(5, 'Suresh', 'Kumar', 21, 'Bangalore', 'Karnataka'),
(6, 'Riya', 'Gupta', 22, 'Kolkata', 'West Bengal'),
(7, 'Rajesh', 'Mehta', 20, 'Ahmedabad', 'Gujarat'),
(8, 'Kavita', 'Desai', 21, 'Pune', 'Maharashtra'),
(9, 'Arjun', 'Mishra', 22, 'Jaipur', 'Rajasthan'),
(10, 'Divya', 'Choudhary', 20, 'Chandigarh', 'Punjab'),
(11, 'Akash', 'Bansal', 21, 'Indore', 'Madhya Pradesh'),
(12, 'Mohit', 'Verma', 22, 'Ludhiana', 'Punjab'),
(13, 'Jyoti', 'Chauhan', 20, 'Nagpur', 'Maharashtra'),
(14, 'Varun', 'Rao', 23, 'Visakhapatnam', 'Andhra Pradesh'),
(15, 'Nisha', 'Tiwari', 21, 'Patna', 'Bihar');

-- 1.
SELECT first_name, last_name FROM students;

-- 2.
SELECT course_name, credit_hours FROM courses;

-- 3.
SELECT first_name, last_name, email FROM instructors;


-- 4.
SELECT c.course_name, e.grade
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id;


-- 5.
SELECT first_name, last_name, city FROM students;


-- 6.
SELECT c.course_name, CONCAT(i.first_name, ' ', i.last_name) AS instructor_name
FROM courses c
JOIN instructors i ON c.instructor_id = i.instructor_id;


-- 7.
SELECT first_name, last_name, age FROM students;


-- 8.
SELECT c.course_name, e.enrollment_date
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id;


-- 9.
SELECT first_name, last_name, email FROM instructors;


-- 10.
SELECT course_name, credit_hours FROM courses;


-- 11.
SELECT i.first_name, i.last_name, i.email
FROM courses c
JOIN instructors i ON c.instructor_id = i.instructor_id
WHERE c.course_name = 'Mathematics';


-- 12.
SELECT c.course_name, e.grade
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id
WHERE e.grade = 'A';


-- 13.
SELECT s.first_name, s.last_name, s.state
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE c.course_name = 'Computer Science';


-- 14.
SELECT c.course_name, e.enrollment_date
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id
WHERE e.grade = 'B+';


-- 15.
SELECT i.first_name, i.last_name, i.email
FROM instructors i
JOIN courses c ON i.instructor_id = c.instructor_id
WHERE c.credit_hours > 3;
