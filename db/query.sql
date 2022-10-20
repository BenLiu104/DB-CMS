-- WHEN I choose to view all departments [Sales, Engineering	, Finance, Legal]
-- showing department names and department ids;
SELECT *
FROM department;
WHEN I choose to view all roles THEN I am presented with the job title,
role id,
the department that role belongs to,
and the salary for that role;
SELECT role.id AS ID,
    title AS Title,
    department.name AS Department,
    salary AS Salary
FROM role
    JOIN department ON role.department_id = department.id;
-- view all empolyee;
SELECT a.id AS "ID",
    a.first_name AS "First Name",
    a.last_name AS "Last Name",
    title AS "Title",
    department.name as "Department Name",
    salary AS "Salary",
    concat(b.first_name, " ", b.last_name) AS "Manager"
FROM employee AS a
    LEFT JOIN employee as b ON a.manager_id = b.id
    JOIN role ON a.role_id = role.id
    JOIN department ON department_id = department.id
ORDER BY a.id;
-- view employee by department
SELECT a.id AS "ID",
    a.first_name AS "First Name",
    a.last_name AS "Last Name",
    title AS "Title",
    department.name as "Department Name",
    salary AS "Salary",
    concat(b.first_name, " ", b.last_name) AS "Manager"
FROM employee AS a
    LEFT JOIN employee as b ON a.manager_id = b.id
    JOIN role ON a.role_id = role.id
    JOIN department ON department_id = department.id
WHERE department_id = 3
ORDER BY a.id;
-- View the total utilized budget of a department
SELECT department.name AS Deparment,
    sum(salary) as "Total Budget"
FROM employee AS a
    LEFT JOIN employee as b ON a.manager_id = b.id
    JOIN role ON a.role_id = role.id
    JOIN department ON department_id = department.id
WHERE department_id = 1
GROUP BY department.id;