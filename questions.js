const menu = {
    message: "What would you like to do?",
    name: "action",
    type: "list",
    choices: ["View all roles", "View all employees", "View all departments", "View employees by manager", "View employees by department", "View department budget", "Add a department", "Add a role", "Add an employee", "Update employee managers", "Delete an employee", "Delete a role", "Delete a department", "Exit"]
}

const addDepart = {
    message: "What is the name of the department?",
    name: "department",
    type: "input"
}

const addRole = [
    {
        message: "What is the name of the role?",
        name: "role",
        type: "input"
    },
    {
        message: "What is the salary of the role?",
        name: "salary",
        type: "number"
    }

]

const addEmployee = [
    {
        message: "What is the first name of the employee?",
        name: "firstName",
        type: "input"
    },
    {
        message: "What is the last name of the employee?",
        name: "lastName",
        type: "input"
    },

]

module.exports = { menu, addDepart, addRole, addEmployee };