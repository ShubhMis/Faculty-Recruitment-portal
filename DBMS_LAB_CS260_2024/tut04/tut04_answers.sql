-- General Instructions
-- 1.	The .sql files are run automatically, so please ensure that there are no syntax errors in the file. If we are unable to run your file, you get an automatic reduction to 0 marks.
-- Comment in MYSQL 
create database tut4;
use tut4
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50),
    location VARCHAR(50)
);

INSERT INTO departments (department_id, department_name, location)
VALUES
    (1, 'Engineering', 'New Delhi'),
    (2, 'Sales', 'Mumbai'),
    (3, 'Finance', 'Kolkata');

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO employees (emp_id, first_name, last_name, salary, department_id)
VALUES
    (1, 'Rahul', 'Kumar', 60000, 1),
    (2, 'Neha', 'Sharma', 55000, 2),
    (3, 'Krishna', 'Singh', 62000, 1),
    (4, 'Pooja', 'Verma', 58000, 3),
    (5, 'Rohan', 'Gupta', 59000, 2);

CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(50),
    budget DECIMAL(10, 2),
    start_date DATE,
    end_date DATE
);

INSERT INTO projects (project_id, project_name, budget, start_date, end_date)
VALUES
    (101, 'ProjectA', 100000, '2023-01-01', '2023-06-30'),
    (102, 'ProjectB', 80000, '2023-02-15', '2023-08-15'),
    (103, 'ProjectC', 120000, '2023-03-20', '2023-09-30');


-- 1. 
SELECT first_name, last_name
FROM employees;

--2. 
SELECT department_name, location
FROM departments;

--3. 
SELECT project_name, budget
FROM projects;

--4. 
SELECT first_name, last_name, salary
FROM employees
WHERE department_id = (SELECT department_id FROM departments WHERE department_name = 'Engineering');

--5. 
SELECT project_name, start_date
FROM projects;

--6.
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

--7. 
SELECT project_name
FROM projects
WHERE budget > 90000;

-- 8.
SELECT SUM(budget) AS total_budget
FROM projects;

--9.
SELECT first_name, last_name, salary
FROM employees
WHERE salary > 60000;

--10.
SELECT project_name, end_date
FROM projects;

--11.
SELECT department_name, location
FROM departments
WHERE location LIKE 'Delhi%' OR location LIKE 'Nearby%';

--12.
SELECT AVG(salary) AS average_salary
FROM employees;

--13.
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'Finance';

--14.
SELECT project_name
FROM projects
WHERE budget BETWEEN 70000 AND 100000;

--15.
SELECT d.department_name, COUNT(e.emp_id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name;
