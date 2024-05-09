-- General Instructions
-- 1.	The .sql files are run automatically, so please ensure that there are no syntax errors in the file. If we are unable to run your file, you get an automatic reduction to 0 marks.
-- Comment in MYSQL 
create database tut8;
use tut8
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(50),
    location VARCHAR(50),
    manager_id INT
);


INSERT INTO departments (department_id, department_name, location, manager_id)
VALUES
(1, 'Engineering', 'New Delhi', 3),
(2, 'Sales', 'Mumbai', 5),
(3, 'Finance', 'Kolkata', 4);


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


CREATE TABLE works_on (
    emp_id INT,
    project_id INT,
    hours_worked INT,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    PRIMARY KEY (emp_id, project_id)
);


INSERT INTO works_on (emp_id, project_id, hours_worked) VALUES
(1, 101, 120),
(2, 102, 80),
(3, 101, 100),
(4, 103, 140),
(5, 102, 90);

-- 1. Trigger to increase salary by 10% for employees with salary < 60000
DELIMITER //
CREATE TRIGGER increase_salary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.salary < 60000 THEN
        SET NEW.salary = NEW.salary * 1.10;
    END IF;
END;
//
DELIMITER ;

-- 2. Trigger to prevent deleting records from departments with assigned employees
DELIMITER //
CREATE TRIGGER prevent_delete_departments
BEFORE DELETE ON departments
FOR EACH ROW
BEGIN
    DECLARE employee_count INT;
    SELECT COUNT(*) INTO employee_count FROM employees WHERE department_id = OLD.department_id;
    IF employee_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete department with assigned employees';
    END IF;
END;
//
DELIMITER ;

-- 3. Trigger to log salary updates
DELIMITER //
CREATE TRIGGER log_salary_update
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (emp_id, old_salary, new_salary, updated_date)
    VALUES (OLD.emp_id, OLD.salary, NEW.salary, CURDATE());
END;
//
DELIMITER ;

-- 4. Trigger to assign department based on salary range
DELIMITER //
CREATE TRIGGER assign_department
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    IF NEW.salary <= 60000 THEN
        SET NEW.department_id = 3;
    END IF;
END;
//
DELIMITER ;

-- 5. Trigger to update manager's salary when a new employee is hired
DELIMITER //
CREATE TRIGGER update_manager_salary
AFTER INSERT ON employees
FOR EACH ROW
BEGIN
    UPDATE employees
    SET salary = salary * 1.05 -- 5% increase
    WHERE emp_id = (SELECT manager_id FROM departments WHERE department_id = NEW.department_id);
END;
//
DELIMITER ;

-- 6. Trigger to prevent updating department_id if employee worked on projects
DELIMITER //
CREATE TRIGGER prevent_update_department
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
    DECLARE project_count INT;
    SELECT COUNT(*) INTO project_count FROM works_on WHERE emp_id = OLD.emp_id;
    IF project_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot update department for employees who worked on projects';
    END IF;
END;
//
DELIMITER ;

-- 7. Trigger to update average salary for each department
DELIMITER //
CREATE TRIGGER update_avg_salary
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    DECLARE avg_salary DECIMAL(10, 2);
    SELECT AVG(salary) INTO avg_salary FROM employees WHERE department_id = NEW.department_id;
    UPDATE departments SET avg_salary = avg_salary WHERE department_id = NEW.department_id;
END;
//
DELIMITER ;

-- 8. Trigger to delete works_on records for deleted employees
DELIMITER //
CREATE TRIGGER delete_works_on_records
AFTER DELETE ON employees
FOR EACH ROW
BEGIN
    DELETE FROM works_on WHERE emp_id = OLD.emp_id;
END;
//
DELIMITER ;

-- 9. Trigger to prevent inserting employees with salary < min department salary
DELIMITER //
CREATE TRIGGER prevent_insert_low_salary
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    DECLARE min_salary DECIMAL(10, 2);
    SELECT MIN(salary) INTO min_salary FROM employees WHERE department_id = NEW.department_id;
    IF NEW.salary < min_salary THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary cannot be less than minimum department salary';
    END IF;
END;
//
DELIMITER ;

-- 10. Trigger to update total salary budget for department
DELIMITER //
CREATE TRIGGER update_salary_budget
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    DECLARE total_salary DECIMAL(10, 2);
    SELECT SUM(salary) INTO total_salary FROM employees WHERE department_id = NEW.department_id;
    UPDATE departments SET total_budget = total_salary WHERE department_id = NEW.department_id;
END;
//
DELIMITER ;

-- 11. Trigger to send email notification to HR for new hires (Dummy trigger, actual email sending needs to be implemented separately)
DELIMITER //
CREATE TRIGGER send_email_notification
AFTER INSERT ON employees
FOR EACH ROW
BEGIN
    -- Implementation to send email to HR
END;
//
DELIMITER ;

-- 12. Trigger to prevent inserting department without location
DELIMITER //
CREATE TRIGGER prevent_insert_no_location
BEFORE INSERT ON departments
FOR EACH ROW
BEGIN
    IF NEW.location IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Location cannot be NULL';
    END IF;
END;
//
DELIMITER ;

-- 13. Trigger to update department_name in employees table
DELIMITER //
CREATE TRIGGER update_department_name
AFTER UPDATE ON departments
FOR EACH ROW
BEGIN
    UPDATE employees SET department_name = NEW.department_name WHERE department_id = NEW.department_id;
END;
//
DELIMITER ;

-- 14. Trigger to log operations on employees table
DELIMITER //
CREATE TRIGGER log_employee_operations
AFTER INSERT OR UPDATE OR DELETE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (operation_type, emp_id, operation_date)
    VALUES (IF(NEW.emp_id IS NOT NULL, 'INSERT', IF(OLD.emp_id IS NOT NULL, 'DELETE', 'UPDATE')), COALESCE(NEW.emp_id, OLD.emp_id), CURDATE());
END;
//
DELIMITER ;

-- 15. Trigger to generate employee ID using sequence

DELIMITER //
CREATE TRIGGER generate_employee_id
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    SET NEW.emp_id = NEXT VALUE FOR employee_seq;
END;
//
DELIMITER ;
