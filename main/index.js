const inquirer= require('inquirer')
const logo = require('asciiart-logo')
const mysql = require('mysql2')
require('console.table')

// Connect to database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '12345678',
      database: 'employees_db'
    }
  );

// Create logo of "Employee Tracker when loading the app"
console.log(
    logo({
        name: 'Employee Tracker'
    }).render())

// Create the list that show all options 
const queries = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'query',
            message: 'What would you like to do',
            choices: ['View All Employees',
                'View ALl Employees by Department',
                'View All Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Department',
                'Add Department',
                'Remove Department',
                'View Total Utilized Budget by Department',
                'Quit'
            ],
        }
    ])
}

// Handle answers and distribute into different functions
const init = () => {
    queries()
    .then((answer) => {
        switch(answer.query) {
            case 'View All Employees':
                viewAllEmployee();
                break;
            case 'View ALl Employees by Department':
                viewAllEmployeeByDepartment();
                break;
            case 'View All Employees by Manager':
                viewAllEmployeeByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'View All Department':
                viewAllDepartment();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'View Total Utilized Budget by Department':
                viewBudget();
                break;
            case 'Quit':
                console.log("Thank you for using Employee Tracker!")
                connection.end();
        }
    })
    .catch((err) => console.error(err))
}

// SQL query: View all employees
const viewAllEmployee = () => {
    connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, manager.first_name FROM employee JOIN role ON employee.role_id = role.id JOIN Employee manager ON employee.manager_id = manager.id;',
        function(err, results) {
            console.table(results);
            queries();
        }
    )
}

// SQL query: View all employees by department

// SQL query: View all employees by manager

// SQL query: Add employee
// What is the employee's first name?
// What is the employee's last name? 
// What is the employee's role? 
// Who is the employee's manager?`


// SQL query: Remove employee

// SQL query: Update Employee

// SQL query: View all roles
const viewAllRoles = () => {
    connection.query(
        'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;',
        function(err, results) {
            console.table(results);
            queries();
        }
    )
}

// SQL query: Add role

// SQL query: Remove role

// SQL query: View all departments 
const viewAllDepartment = () => {
    connection.query(
        'SELECT * FROM department;',
        function(err, results) {
            console.table(results);
            queries();
        }
    )
}

// SQL query: Add department

// SQL query: Remove department

// SQL query: View total utilized budget by department




init()