const inquirer = require('inquirer')
const logo = require('asciiart-logo')
const mysql = require('mysql2');
const { concat } = require('rxjs');
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
                'Update Employee Role',
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
            switch (answer.query) {
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
                case 'Update Employee Role':
                    updateEmployeeRole();
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
        'SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary as salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;',
        (err, results) => {
            console.table(results);
            init();
        }
    )
}

// SQL query: View all employees by department
const viewAllEmployeeByDepartment = () => {
    connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary as salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;',
        (err, results) => {
            let department = results.map(employee => ({ name: employee.department, value: employee.department }))
            inquirer.prompt([{
                type: 'list',
                name: 'department',
                message: 'What department would you like to choose?',
                choices: department,
            }])
                .then((res) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary as salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.name = '${res.department}';`,
                        (err, results) => {
                            console.table(results);
                            init();
                        }
                    )
                })
        }
    )
}


// SQL query: View all employees by manager
const viewAllEmployeeByManager = () => {
    connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary as salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE employee.manager_id IS NOT NULL;',
        (err, results) => {
            let manager = results.map(employee => ({ name: employee.manager, value: employee.id }))
            inquirer.prompt([{
                type: 'list',
                name: 'manager',
                message: 'What manager would you like to choose?',
                choices: manager,
            }])
                .then((res) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary as salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE employee.id = '${res.manager}';`,
                        (err, results) => {
                            console.table(results);
                            init();
                        }
                    )
                })
        }
    )
}


// SQL query: Add employee
const addEmployee = () => {
    connection.query(
        'SELECT * FROM role;',
        (err, results) => {
            let role = results.map(role => ({ name: role.title, value: role.id }));
            connection.query(
                'SELECT * FROM employee;',
                (err, results) => {
                    let manager = results.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))

            inquirer.prompt([{
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: role,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: manager,
                }
                ])
                    .then((res) => {
                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES  ('${res.firstName}', '${res.lastName}' , ${res.role}, ${res.manager});`,
                            (err, results) => {
                                console.log(`Added ${res.firstName} to the database.`)
                                init();
                            }
                        )
                    })})
        }
    )
}



// SQL query: Remove employee
const removeEmployee = () => {
    connection.query(
        'SELECT * FROM employee;',
        (err, results) => {
            let employee = results.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
            inquirer.prompt([{
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to delete?',
                choices: employee,
            }])
                .then((res) => {
                    connection.query(
                        `DELETE FROM employee WHERE employee.id = ${res.name};`,
                        (err, results) => {
                            console.log(`Deleted ${employee.name} to the database.`)
                            init();
                        }
                    )
                })
        })
}

// SQL query: Update Employee Role
const updateEmployeeRole = () => {
    connection.query(
        'SELECT * FROM role;',
        (err, results) => {
            let role = results.map(role => ({ name: role.title, value: role.id }));
            connection.query(
                'SELECT * FROM employee;',
                (err, results) => {
                    let employee = results.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you like to update?",
                    choices: employee,
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Which role do you want to assign the selected employee?",
                    choices: role,
                },
                ])
                    .then((res) => {
                        connection.query(
                            `UPDATE employee SET role_id = ${res.role} WHERE id = ${res.employee};`,
                            (err, results) => {
                                console.log(`Updated employee's role to the database.`)
                                init();
                            }
                        )
                    })})
        }
    )
}

// SQL query: View all roles
const viewAllRoles = () => {
    connection.query(
        'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;',
        (err, results) => {
            console.table(results);
            init();
        }
    )
}

// SQL query: Add role
const addRole = () => {
    connection.query(
        'SELECT * FROM department;',
        (err, results) => {
            let department = results.map(department => ({ name: department.name, value: department.id }))
            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does this role belong to?',
                choices: department,
            }
            ])
                .then((res) => {
                    connection.query(
                        `INSERT INTO role(title, salary, department_id) VALUES  ('${res.name}', ${res.salary} , '${res.department}');`,
                        (err, results) => {
                            console.log(`Added ${res.name} to the database.`)
                            init();
                        }
                    )
                })
        }
    )
}


// SQL query: Remove role
const removeRole = () => {
    connection.query(
        'SELECT * FROM role;',
        (err, results) => {
            let role = results.map(role => ({ name: role.title, value: role.title }))
            inquirer.prompt([{
                type: 'list',
                name: 'name',
                message: 'Which role would you like to delete?',
                choices: role,
            }])
                .then((res) => {
                    connection.query(
                        `DELETE FROM role WHERE role.title = '${res.name}';`,
                        (err, results) => {
                            console.log(`Deleted ${res.name} to the database.`)
                            init();
                        }
                    )
                })
        })
}


// SQL query: View all departments 
const viewAllDepartment = () => {
    connection.query(
        'SELECT * FROM department;',
        (err, results) => {
            console.table(results);
            init();
        }
    )
}

// SQL query: Add department
const addDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
    }])
        .then((res) => {
            connection.query(
                `INSERT INTO department(name) VALUES ('${res.name}');`,
                (err, results) => {
                    console.log(`Added ${res.name} to the database.`)
                    init();
                }
            )
        })

}


// SQL query: Remove department
const removeDepartment = () => {
    connection.query(
        'SELECT * FROM department;',
        (err, results) => {
            let department = results.map(department => ({ name: department.name, value: department.name }))
            inquirer.prompt([{
                type: 'list',
                name: 'name',
                message: 'Which department would you like to delete?',
                choices: department,
            }])
                .then((res) => {
                    connection.query(
                        `DELETE FROM department WHERE department.name = '${res.name}';`,
                        (err, results) => {
                            console.log(`Deleted ${res.name} to the database.`)
                            init();
                        }
                    )
                })
        })
}



// SQL query: View total utilized budget by department
const viewBudget = () => {
    connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary as salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;',
        (err, results) => {
            let department = results.map(employee => ({ name: employee.department, value: employee.department }))
            inquirer.prompt([{
                type: 'list',
                name: 'department',
                message: 'What department would you like to choose?',
                choices: department,
            }])
                .then((res) => {
                    connection.query(
                        `SELECT department.name AS department, SUM(role.salary) as budget FROM employee m RIGHT JOIN employee ON m.id = employee.manager_id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.name = '${res.department}';`,
                        (err, results) => {
                            console.table(results);
                            init();
                        }
                    )
                })
        }
    )
}

init()