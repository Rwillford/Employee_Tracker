const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'business'
    },
    console.log('Connected to the business database!')
)

db.connect((err) => {
    if(err) throw err;
    startMenu();
})

function startMenu(){
    inquirer.prompt({
        type: "list",
        name: "select",
        message: "Main Menu -- Select an action",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Update An Employee Role"
        ]
    })
    .then((anwsers) => {
        switch(anwsers.select) {
            case "View All Departments":
                viewDepartment();
            break;
              
            case "View All Roles":
                viewRoles();
            break;

            case "View All Employees":
                viewEmployees();
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

            case "Update An Employee Role":
                updateEmployeeRole();
            break;
        }
    })
}

function viewDepartment()