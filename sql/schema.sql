-- Create database
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empl VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    hireDate DATE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed data (7 employees across 3 departments)
INSERT INTO employees (empl, name, email, department, position, hireDate, salary, active) VALUES
('EMP001', 'Ahmad Bin Abdullah', 'ahmad@company.com', 'IT', 'Software Engineer', '2022-01-15', 5500.00, 1),
('EMP002', 'Siti Nurhaliza', 'siti@company.com', 'HR', 'HR Manager', '2021-06-01', 6200.00, 1),
('EMP003', 'Tan Wei Ming', 'tan@company.com', 'Finance', 'Accountant', '2020-03-10', 4800.00, 1),
('EMP004', 'Ravi Chandran', 'ravi@company.com', 'IT', 'System Analyst', '2023-02-20', 5800.00, 1),
('EMP005', 'Nurul Izzah', 'nurul@company.com', 'Marketing', 'Marketing Executive', '2022-08-01', 4200.00, 1),
('EMP006', 'Lim Kok Seng', 'lim@company.com', 'Operations', 'Operations Manager', '2019-11-15', 6500.00, 0),
('EMP007', 'Nadia Mohamad', 'nadia@company.com', 'HR', 'HR Executive', '2021-09-01', 3800.00, 1),
('EMP008', 'Khairul Anwar', 'khairul@company.com', 'IT', 'Intern', '2024-01-01', 1500.00, 1);