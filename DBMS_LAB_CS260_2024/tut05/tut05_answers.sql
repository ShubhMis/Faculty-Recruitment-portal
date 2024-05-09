-- Comment in MYSQL 
CREATE DATABASE IF NOT EXISTS tut5;
USE tut5;

-- Creating departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50),
    location VARCHAR(50),
    manager_id INT
);

-- Creating employees table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Creating projects table
CREATE TABLE projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    budget DECIMAL(10, 2),
    start_date DATE,
    end_date DATE
);

-- Adding foreign key constraint to departments referencing employees
ALTER TABLE departments
ADD CONSTRAINT fk_manager_id
FOREIGN KEY (manager_id) REFERENCES employees(emp_id);

-- Inserting data into departments table
INSERT INTO departments (department_id, department_name, location, manager_id)
VALUES 
(1, 'Engineering', 'New Delhi', 3),
(2, 'Sales', 'Mumbai', 5),
(3, 'Finance', 'Kolkata', 4);

-- Inserting data into employees table
INSERT INTO employees (emp_id, first_name, last_name, salary, department_id)
VALUES 
(1, 'Rahul', 'Kumar', 60000, 1),
(2, 'Neha', 'Sharma', 55000, 2),
(3, 'Krishna', 'Singh', 62000, 1),
(4, 'Pooja', 'Verma', 58000, 3),
(5, 'Rohan', 'Gupta', 59000, 2);

-- Inserting data into projects table
INSERT INTO projects (project_id, project_name, budget, start_date, end_date)
VALUES 
(101, 'ProjectA', 100000, '2023-01-01', '2023-06-30'),
(102, 'ProjectB', 80000, '2023-02-15', '2023-08-15'),
(103, 'ProjectC', 120000, '2023-03-20', '2023-09-30');

-- Queries
-- 2
SELECT first_name, salary FROM employees;

-- 4
SELECT * FROM employees
WHERE salary > 60000;

-- 6
SELECT * FROM employees, projects;

-- 8
SELECT * FROM departments
NATURAL JOIN projects;

-- 10
SELECT * FROM projects
WHERE budget > 100000;

-- 12
SELECT * FROM employees
WHERE department_id IN (SELECT department_id FROM departments WHERE department_name IN ('Engineering', 'Finance'));

-- 14
SELECT * FROM employees
LEFT JOIN employee_projects ON employees.emp_id = employee_projects.emp_id;
