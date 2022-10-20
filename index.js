const inquirer = require("./node_modules/inquirer");
const mysql2 = require("mysql2");
const table = require("console.table");
const questions = require("./questions");
const sql = require("./query");
require("dotenv").config();

const db = mysql2.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'Company_db'
    },
    console.log(`Connected to the Company_db database.`)
);

async function getMenu() {

    let action = await inquirer.prompt(questions.menu);
    //"View all roles", "View all employees", "View all departments"
    if (action.action == "View all roles") {
        db.query(sql.role, (err, result) => {
            if (err) { console.error(err) }
            else {
                console.table(result);
                console.log("\n");
                getMenu();
            }
        })
    }

    if (action.action == "View all departments") {

        db.query(sql.department, (err, result) => {
            if (err) { console.error(err) }
            else {
                console.table(result);
                console.log("\n");
                getMenu();
            }
        })
    }

    if (action.action == "View all employees") {

        db.query(sql.employee, (err, result) => {
            if (err) { console.error(err) }
            else {
                console.table(result);
                console.log("\n");
                getMenu();
            }
        })
    }

    if (action.action == "Add a department") {
        let answer = await inquirer.prompt(questions.addDepart);
        let para = [answer.department];
        db.query(sql.addDepart, para, (err, result) => {
            if (err) { console.error(err) }
            else {
                console.log("Department added successfully!");
                console.log("\n");
                getMenu();
            }
        })
    }

    if (action.action == "Add a role") {
        let answer = await inquirer.prompt(questions.addRole);
        db.query(sql.department, (err, result) => {
            if (err) { console.error(err) }
            else {

                let List = result.map(elm => elm.name);

                inquirer.prompt(
                    {
                        message: "Which department does the role belong to?",
                        name: "department",
                        type: "list",
                        choices: List
                    }
                ).then((ans) => {
                    console.log(ans.department);
                    let depart = result.filter(dep => dep.name == ans.department)
                    let para = [answer.role, answer.salary, depart[0].id];

                    db.query(sql.addRole, para, (err, result) => {
                        if (err) { console.error(err) }
                        else {
                            console.log("Role added successfully!");
                            console.log("\n");
                            getMenu();
                        }
                    })
                })
            }
        })
    }


    if (action.action == "Add an employee") {
        let answer = await inquirer.prompt(questions.addEmployee);
        db.query(`select id, title from role;`, async (err, roleInfo) => {
            // console.log(roleInfo);
            let roleList = roleInfo.map(elm => elm.title);
            // console.log(roleList);
            let data = await inquirer.prompt(
                {
                    message: "What is the role of the employee?",
                    name: "role",
                    type: "list",
                    choices: roleList
                }
            );
            let role = roleInfo.filter(elm => elm.title == data.role)

            db.query(`select employee.id, concat(first_name,' ',last_name,' - ',title) as manager from employee join role on role_id=role.id where manager_id is null;`, async (err, managerInfo) => {

                let managerList = managerInfo.map(elm => elm.manager);
                managerList.push("NULL");
                let data = await inquirer.prompt(
                    {
                        message: "Who is the manager of the employee?",
                        name: "manager",
                        type: "list",
                        choices: managerList
                    }
                )
                let manager = managerInfo.filter(elm => elm.manager == data.manager);
                if (manager.length == 0) {
                    let param = [answer.firstName, answer.lastName, role[0].id];

                    db.query(sql.addManager, param, (err, result) => {
                        if (err) { console.error(err) }
                        else {
                            console.log("Employee added successfully!");
                            console.log("\n");
                            getMenu();
                        }
                    })
                } else {
                    let param = [answer.firstName, answer.lastName, role[0].id, manager[0].id];

                    db.query(sql.addEmployee, param, (err, result) => {
                        if (err) { console.error(err) }
                        else {
                            console.log("Employee added successfully!");
                            console.log("\n");
                            getMenu();
                        }
                    })
                }
            })
        })
    }


    if (action.action == "View employees by manager") {
        db.query(`select employee.id, concat(first_name,' ',last_name,' - ',title) as manager from employee join role on role_id=role.id where manager_id is null;`, async (err, managerInfo) => {

            let managerList = managerInfo.map(elm => elm.manager);
            let data = await inquirer.prompt(
                {
                    message: "Please select a manager :",
                    name: "manager",
                    type: "list",
                    choices: managerList
                }
            )
            let manager = managerInfo.filter(elm => elm.manager == data.manager);

            db.query(sql.viewByMgr, manager[0].id, (err, result) => {
                if (err) { console.error(err) }
                else {
                    console.table(result);
                    console.log("\n");
                    getMenu();
                }
            })
        })


    }
    if (action.action == "View employees by department") {
        db.query(sql.department, async (err, result) => {
            if (err) { console.error(err) }
            else {
                let List = result.map(elm => elm.name);
                let data = await inquirer.prompt(
                    {
                        message: "Please select a department:",
                        name: "department",
                        type: "list",
                        choices: List
                    }
                )
                let depart = result.filter(dep => dep.name == data.department)
                db.query(sql.viewByDepart, depart[0].id, (err, result) => {
                    if (err) { console.error(err) }
                    else {
                        console.table(result);
                        console.log("\n");
                        getMenu();
                    }
                })
            }
        })
    }

    if (action.action == "Update employee managers") {

        db.query(`select id, concat(first_name,' ',last_name) as Employee from employee;`, async (err, employeeInfo) => {

            if (err) { console.error(err) }
            else {
                let emList = employeeInfo.map(elm => elm.Employee);
                let selected = await inquirer.prompt(
                    {
                        message: "Please select a employee:",
                        name: "employee",
                        type: "list",
                        choices: emList
                    }
                )
                let emIDList = employeeInfo.filter(elm => elm.Employee == selected.employee);


                db.query(`select employee.id, concat(first_name,' ',last_name,' - ',title) as manager from employee join role on role_id=role.id where manager_id is null;`, async (err, managerInfo) => {

                    let managerList = managerInfo.map(elm => elm.manager);
                    let data = await inquirer.prompt(
                        {
                            message: "Please select a new manager :",
                            name: "manager",
                            type: "list",
                            choices: managerList
                        }
                    )
                    let manager = managerInfo.filter(elm => elm.manager == data.manager);
                    let param = [manager[0].id, emIDList[0].id]
                    db.query(`update employee set manager_id = ? where id = ?`, param, (err, result) => {
                        if (err) { console.error(err) }
                        else {
                            console.log("Manager updated")
                            console.log("\n");
                            getMenu()
                        }
                    })

                })

            }
        })

    }

    if (action.action == "Delete an employee") {

        db.query(`select id, concat(first_name,' ',last_name) as Employee from employee;`, async (err, employeeInfo) => {

            if (err) { console.error(err) }
            else {
                let emList = employeeInfo.map(elm => elm.Employee);
                let selected = await inquirer.prompt(
                    {
                        message: "Please select a employee:",
                        name: "employee",
                        type: "list",
                        choices: emList
                    }
                )
                let employee = employeeInfo.filter(elm => elm.Employee == selected.employee);
                db.query(`delete from employee where id = ?;`, employee[0].id, (err, result) => {
                    if (err) { console.error(err) }
                    else {
                        console.log(`Employee ${employee[0].Employee} has been deleted`);
                        console.log("\n");
                        getMenu();
                    }
                })
            }
        })

    }

    if (action.action == "Delete a role") {
        db.query(`select id, title from role;`, async (err, roleInfo) => {
            // console.log(roleInfo);
            let roleList = roleInfo.map(elm => elm.title);
            // console.log(roleList);
            let data = await inquirer.prompt(
                {
                    message: "Please select the role which will be deleted.",
                    name: "role",
                    type: "list",
                    choices: roleList
                }
            );
            let role = roleInfo.filter(elm => elm.title == data.role)
            db.query(`delete from role where id = ?;`, role[0].id, (err, result) => {
                if (err) { console.error(err) }
                else {
                    console.log(`${role[0].title} Role has been deleted`);
                    console.log("\n");
                    getMenu();
                }
            })
        })
    }



    if (action.action == "Delete a department") {
        db.query(sql.department, async (err, result) => {
            if (err) { console.error(err) }
            else {
                let List = result.map(elm => elm.name);
                let data = await inquirer.prompt(
                    {
                        message: "Please select the department which will be deleted.",
                        name: "department",
                        type: "list",
                        choices: List
                    }
                )
                let depart = result.filter(dep => dep.name == data.department)
                db.query(`delete from department where id = ?`, depart[0].id, (err, result) => {
                    if (err) { console.error(err) }
                    else {
                        console.log(`${depart[0].name} Department has been deleted`);
                        console.log("\n");
                        getMenu();
                    }
                })
            }
        })

    }



    if (action.action == "View department budget") {
        db.query(sql.department, async (err, result) => {
            if (err) { console.error(err) }
            else {
                let List = result.map(elm => elm.name);
                let data = await inquirer.prompt(
                    {
                        message: "Please select the department which will be deleted.",
                        name: "department",
                        type: "list",
                        choices: List
                    }
                )
                let depart = result.filter(dep => dep.name == data.department)
                db.query(sql.viewBudget, depart[0].id, (err, result) => {
                    if (err) { console.error(err) }
                    else {
                        console.log("\n");
                        console.table(result);
                        console.log("\n");
                        getMenu();
                    }
                })
            }
        })
    }


    if (action.action == "Exit") {
        process.exit();
    }

}

console.log("Welcome");

getMenu();





