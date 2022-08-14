const inquirer= require('inquirer')
const logo = require('asciiart-logo')
const db = require('./db')
const mysql = require('mysql2');
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

// Create logo of "EMployee Tracker when loading the app"
console.log(
    logo({
        name: 'Employee Tracker'
    }).render())

const queries = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'query',
            message: 'What would you like to do',
            choices: [viewAllDepartment]
        }
    ])
}


// const viewAllEmployee = () => {
//     connection.query(
//         'SELECT * FROM employee'
//     )
// }

const viewAllDepartment = () => {
    connection.query(
        'SELECT * FROM department;',
        function(err, results, fields) {
            return console.table(results)
        }
    )
}

// const viewAllRole = () =>{

// }

// `What would you like to do? 
// View All Employees
// View ALl Employees by Department -> Which department would you like to see employees for? Engineering, Finance, Legal, Sales
// View All Employees by Manager -> Which employee do you want to see direct reports for? 
// Add Employee 
// Remove Employee
// Update Employee
// Update Employee  -> Which employee's role do you want to update? -> Which role do you want to assign the selected employee?
// Update Employee Manager
// View All Roles
// Add Role
// Remove Role
// VIew All Department
// Add Department
// Remove Department
// View Total Utilized Budget by Department
// Quit`



// `add employee -> 
// What is the employee's first name?
// What is the employee's last name? 
// What is the employee's role? 
// Who is the employee's manager?`

queries();