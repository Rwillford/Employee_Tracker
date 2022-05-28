const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'business'
    },
    console.log('Connected to the business database!')
)

//Connecting to to database 
db.connect((err) => {
    if (err) throw err;
    //Our Main Menu
    startMenu();
})

//Main Menu
function startMenu() {
    
    // A list of options to choose from
    inquirer.prompt({
        type: "list",
        name: "select",
        message: "Main Menu -- Select an action",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "View Employees By Department",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Delete Department",
            "Delete Role",
            "Delete Employee",
            "Update An Employee Role",
            "Exit"
        ]
    })
        //Taking our selection and running to proper function
        .then((anwsers) => {
            switch (anwsers.select) {
                case "View All Departments":
                    viewDepartment();
                    break;

                case "View All Roles":
                    viewRoles();
                    break;

                case "View All Employees":
                    viewEmployees();
                    break;

                case "View Employees By Department":
                    viewEmployeeByDepartment();
                    break;

                case "Add A Department":
                    addDepartment();
                    break;

                case "Add A Role":
                    addRole();
                    break;

                case "Add An Employee":
                    addEmployee();
                    break;

                case "Delete Department":
                    deleteDepartment();
                    break;

                case "Delete Role":
                    deleteRole();
                    break;

                case "Delete Employee":
                    deleteEmployee();
                    break;

                case "Update An Employee Role":
                    updateEmployeeRole();
                    break;
                case "EXIT":
                    db.end();
                    break;
            }
        })
}

//View Department
function viewDepartment() {
    //Making our SQL statment
    const department = `SELECT * FROM department;`;

    db.query(department, (err, res) => {
        if (err) throw err;
        
        //Displaying the results in console
        console.log('View  of all departments')
        console.log('\n')
        console.table(res)

        //Return to main menu
        startMenu()
    })
};

//Viewing our roles
function viewRoles() {
    //Making our SQL statment
    const roles = `SELECT * FROM roles;`;

    db.query(roles, (err, res) => {
        if (err) throw err;

        //Displaying the results in console
        console.log('View of all Roles')
        console.log('\n')
        console.table(res)

        //Return to main menu
        startMenu();
    })
}

//Viewing all employees
function viewEmployees() {
    //Making our SQL statment
    const employees = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
    
    db.query(employees, (err, res) => {
        if (err) throw err;
        //Displaying our results in console
        console.log('View of all employees')
        console.table(res)
        
        //Return to main menu
        startMenu();
    })
}

function viewEmployeeByDepartment() {
    //Making our SQL statment but only to see employees by department
    const employees = `SELECT employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id;`

    db.query(employees, (err, res) => {
        if (err) throw err;
        
        //Displaying our results in console
        console.log('View Employees By Department')
        console.log('\n')
        console.table(res)

        //Return to main menu
        startMenu();
    })
}

//Updating our employees role
function updateEmployeeRole() {
    ////Making our SQL statment to get all employees
    const employees = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`

    const getEmps = db.promise().query(employees).then(([rows]) => {
        let employees = rows;
       
        //Pulling the data that we need to see
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        //Asking which employee we will change
        inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices
            }
        ]).then((answer) => {
            let employeeId = answer.employeeId;
            
            //Making our SQL statment to get all roles
            const roles = `SELECT * FROM roles;`;

            db.promise().query(roles).then(([rows]) => {
                let roles = rows;
                //Pulling the data that we need
                const rolesChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                //Asking which role they want to give
                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "Which role do you want to give this employee?",
                        choices: rolesChoices
                    }
                ]).then((answer) => {
                    let roleId = answer.roleId;

                    console.log("stuff to send to db", employeeId, roleId)
                    //Making our SQL statment to update employees role
                    let updateQuery = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`

                    db.promise().query(updateQuery).then(() => {
                       
                        //Console Logging that it happend
                        console.log('\n')
                        console.log("Employees role has successfully been updated!")
                        console.log('\n')
                       
                        //Return to main menu
                        startMenu()

                    })

                })

            })
        })
        console.log("getEmps", getEmps)
    }
    )
}

//Adding a Department
function addDepartment() {
    //Asking the new name of the department
    inquirer.prompt([
        {
            type: 'input',
            name: 'depart',
            message: 'What is the name of the department you wish to add?'
        }
    ]).then((answer) => {
        //Making our SQL statment to insert into department table
        const newDepartment = `INSERT INTO department (name) VALUES ("${answer.depart}");` 

        db.query(newDepartment, (err, res) =>{
            if (err) throw err;

            //Consoling the success!
            console.log('\n')
            console.log('Department Added!')
            console.log('\n')

            //Return to main menu
            startMenu();
        })
    })
}

//Adding a role
function addRole() {
    //Making our SQL statment to get all departments
    const depart = `SELECT * FROM department;`

    db.promise().query(depart).then(([rows]) => {
        let depart = rows;
        
        //Pulling the data we need
        const departChoices = depart.map(({ id, name }) => ({
            name: name,
            value: id
        }))
        
        //Asking questions for new role 
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the new role?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary of this role?'
            },
            {
                type: 'list',
                name: 'departId',
                message: 'Which depart will you be addding this role to?',
                choices: departChoices
            }
        ]).then((answers) => {
            //Making our SQL statment to insert the new data in the role table
            const newRole = `INSERT INTO roles (title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${answers.departId});`;

            db.query(newRole, (err, res) => {
                if (err) throw err;

                //consoling the success
                console.log('\n')
                console.log(`${answers.title} has been added to roles!`)
                console.log('\n')

                //Return to main menu
                startMenu();
            })
        })
    })
    
}

//Adding employee
function addEmployee() {
    //Making our SQL statment for all roles
    const roles = `SELECT * FROM roles;`;

    db.promise().query(roles).then(([rows]) => {
        let roles = rows;
        
        //Pulling the data needed
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        //Prompting the questions for employee
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('Please enter a first name!');
                        return false;
                       }
                   }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('Please enter a last name!');
                        return false;
                       }
                   }
            },
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you wan to give this employee?',
                choices: roleChoices
            }
        ]).then((answers) => {
            let eFirstName = answers.firstName
            let eLastName = answers.lastName
            let eRoleId = answers.role

            //Making our SQL statment for getting the managers
            const manager = `SELECT * FROM employee WHERE manager_id IS NULL`
            
            db.promise().query(manager).then(([rows]) => {
                let manager = rows;

                //Pulling the data that is needed
                const managerChocices = manager.map (({ id, first_name, last_name}) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }))

                //Asking for there manager
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who will be there manager?',
                        choices: managerChocices
                    }
                ]).then((answer) => {
                    let eManager = answer.manager;

                    //Making my SQL statment for Inserting the employee into the emplyee table
                    const newEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${eFirstName}', '${eLastName}', ${eRoleId}, ${eManager});`

                    db.query(newEmployee, (err, res) => {
                        if (err) throw err;
                        
                        //consoling the success
                        console.log('\n')
                        console.log(`${eFirstName} ${eLastName} was added!`)
                        console.log('\n')

                        //Return to main menu
                        startMenu();
                    })
                })
            })

            
        })
    })
}


//Deleting Employee
function deleteEmployee() {
    //Making our SQL statment for getting all the employees
    const employees = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`

    const getEmployees = db.promise().query(employees).then(([rows]) => {
        let employees = rows;

        //Pulling the data we need from the employee table
        const employeeChoices = employees.map (({ id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))

        //Prompting which employee to delete
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee would you like to delete?',
                choices: employeeChoices
            }
        ]).then ((answer) => {
            let employeeId = answer.employeeId
            //Making our SQL statment to delete employee
            const deleteEmployee = `DELETE FROM employee WHERE employee.id = ?;`

            db.query(deleteEmployee, employeeId, (err) => {
                if(err) throw err;

                //Consoling our results
                console.log('\n')
                console.log('You have successfully deleted an Employee')
                console.log('\n')

                //Return to main menu
                startMenu();
            })
        })
    })
}

function deleteDepartment(){
    //Making our SQL statment to pull all departments
    const depart = `SELECT * FROM department;`

    db.promise().query(depart).then(([rows]) => {
        let depart = rows;

        //Pulling the data needed
        const departChoices = depart.map (({ id, name }) => ({
            name: name,
            value: id
        }))

        //Prompting which department to delete
        inquirer.prompt([
            {
                type: 'list',
                name: 'departId',
                message: 'Which department would you like to delete?',
                choices: departChoices
            }
        ]).then((answer) => {
            let departId = answer.departId

            ////Making our SQL statment to delete the slected department
            const deleteDepartment = `DELETE FROM department WHERE department.id = ?;`

            db.query(deleteDepartment, departId, (err) => {
                if(err) throw err;

                //Consoling the success of deletion
                console.log('\n')
                console.log('You have successfully deleted a department!')
                console.log('\n')

                startMenu();
            })
        })
    })
}

//Delete a role
function deleteRole(){
    //Making our SQL statment for all roles
    const role = `SELECT * FROM roles;`

    db.promise().query(role).then(([rows]) => {
        let role = rows;

        //pulling the data needed to prompt question
        const roleChoices = role.map(({ id, title }) => ({
            name: title,
            value: id
        }))

        //Prompting which role to delete
        inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role would you like to delete?',
                choices: roleChoices
            }
        ]).then((answer) => {
            let roleId = answer.roleId

            //Making our SQL statment to delete selected role
            const deleteRole = `DELETE FROM roles WHERE roles.id = ?;`

            db.query(deleteRole, roleId, (err) => {
                if(err) throw err;

                //consoling the success of the deletion
                console.log('\n')
                console.log('You have successfully deleted a role!')
                console.log('\n')

                //Reutrn to main menu
                startMenu();
            })
        })
    })
}