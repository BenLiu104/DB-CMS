const role = `SELECT role.id AS ID,title AS Title,department.name AS Department,salary AS Salary FROM role 
JOIN department ON role.department_id = department.id order by role.id;`

const department = `SELECT * FROM department order by id;`

const employee = `SELECT a.id AS "ID",
a.first_name AS "First Name",
a.last_name AS "Last Name",
title AS "Title",
department.name as "Department Name",
salary AS "Salary",
concat(b.first_name, " ", b.last_name) AS "Manager"
FROM employee AS a
LEFT JOIN employee as b ON a.manager_id = b.id
JOIN role ON a.role_id = role.id
JOIN department ON department_id = department.id order by a.id;`


const addDepart = `INSERT INTO department (name) VALUES (?);`

const addRole = `INSERT INTO role (title, salary, department_id)
VALUES (?, ?, ?);`

const addEmployee = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`
const addManager = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,NULL)`
const viewByMgr = `SELECT a.id AS "ID",
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
WHERE a.manager_id = ?
ORDER BY a.id;`

const viewByDepart = `SELECT a.id AS "ID",
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
WHERE department_id = ?
ORDER BY a.id;`

const viewBudget = `SELECT department.name AS Department,
sum(salary) as "Total Budget"
FROM employee AS a
LEFT JOIN employee as b ON a.manager_id = b.id
JOIN role ON a.role_id = role.id
JOIN department ON department_id = department.id
WHERE department_id = ?
GROUP BY department.id;`
module.exports = { role, department, employee, addDepart, addRole, addEmployee, addManager, viewByMgr, viewByDepart, viewBudget }