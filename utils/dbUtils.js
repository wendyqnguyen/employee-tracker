const mysql = require('mysql2/promise');
const cTable = require('console.table');
const inquirer = require('inquirer');


// Connect to database
const db = mysql.createPool(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'root',
    database: 'company',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  console.log('Connected to the company database.')
);

//Print the data in a table with the given title
function printDataTable(title, data) {
  console.log(`
---------------------------------------------------
${title.toUpperCase()}
---------------------------------------------------`);
  console.table(data);
  console.log(`----------------------------------------------------------`);
}

// function that returns a department ID based on name
function getDepartmentID (departmentName) {
    const params = [];
    params[0] = departmentName;
    const sql = `SELECT id FROM department WHERE name = ?`;
      console.log(`params = ${params}`);
        db.query(sql, params, (err, id) => {
          if (err) {
            console.log({ error: err.message });
            return;
          }
          return(id[0].id)
        });
        
  }

//function that returns all the department names in the db
  async function getDepartmentNames(){
    let departmentArr = [];
    const sql = `SELECT * FROM department`;
    db.query(sql, (err,rows) => {
        if (err) {
            console.log({ error: err.message});
            return;
        }
        for(i = 0; i < rows.length; i++){
          departmentArr[i] = {ID: rows[i].id,
            Name: rows[i].name};
        }
        console.table(departmentArr);
      });
    }

async function getDeparments() {
    const result = await db.query("SELECT * FROM department ORDER BY name ASC");
    return result[0];
  }
  
async function getEmployees(){

  const result = await db.query(`SELECT e.id, e.first_name, e.last_name, roles.title, department.name AS department, roles.salary, (select CONCAT(m.first_name, ' ', m.last_name) from employee m where m.id = e.manager_id) AS manager
  FROM employee e JOIN roles on e.role_id = roles.id 
  JOIN department ON department.id = roles.department_id`);
  return result[0];
  }

async function getRoles(){
  const result = await db.query("SELECT roles.id, roles.title, roles.salary, department.name AS department  FROM roles, department WHERE roles.department_id = department.id;");
  return result[0];
  }

async function addRole () {
    console.log(`
=====================
Add Role
=====================
`);

  //compose the list of choices for roles's department
  let department_id;
  let result = await db.execute("SELECT name FROM department;");
  let departments = result[0];
  departments = JSON.stringify(departments);
  departments = departments.replace(/"name":/g, '');
  departments = departments.replace(/}/g, '');
  departments = departments.replace(/{/g, '');
  departments = JSON.parse(departments);

  //promt user for new role information
  inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: "Please enter the role title >> "
    },
    {
        type: 'input',
        name: 'salary',
        message: "Please enter the role salary >> "
    },
    {
        type: 'list',
        name: 'department_name',
        message: "Please select the department >> ",
        choices: departments
    }
  ])
  .then ((answer) => {
    //call insertRole to insert new role row db
    return insertRole(answer);
  })

     
}

async function insertRole(values) {
  try {
    //construct SQl statement for adding new role row based on user entered info
    const sql = `INSERT INTO roles 
    SET title = "${values.title}",
    salary = ${values.salary},
    department_id = (
        SELECT id
          FROM department
          WHERE name = "${values.department_name}")`;
    //execute SQl insert statement
    const result = await db.query(sql);
    //tell user about success
    console.log(values.title + " role was added.")
    //circle back to main prompt
    return mainPrompt();
  } catch (error) {
    return error;
  }
}

async function addDepartment (){
  
  console.log(`
=====================
Add Department
=====================
`);

  //prompt for new department name and call function to insert new department into db
  inquirer.prompt([
      {
          type: 'input',
          name: 'name',
          message: "Please enter the department name >> "
      }])
  .then ((answer) => {
    return insertDepartment(answer.name);
      
  })
}

async function insertDepartment(name) {
  try {
    //construct insert SQL statement to add new row to department table
    const sql = "INSERT INTO department (name) VALUES (?)";
    params = [name];
    //execute SQL statement
    const result = await db.query(sql, params);
    //alert user of success
    console.log(name + " department was added.")
    //circle back to main prompt
    return mainPrompt();
  } catch (error) {
    return error;
  }
}

async function addEmployee () {
  console.log(`
=====================
Add Employee
=====================
`);

let result = await db.execute("SELECT * FROM roles;");
let roles = result[0];
let roleChoices = [];

for( i = 0; i< roles.length; i++){
    const choice = {
      name: roles[i].title,
      value: roles[i].id,
    };
    roleChoices.push(choice);
}

result = await db.execute("SELECT * FROM employee;");
let managers = result[0];

let managerChoices = [];
for( i = 0; i< managers.length; i++){

    full_name = managers[i].first_name + " " + managers[i].last_name;
    let idValue = "value: " + managers[i].id;
    const choice = {
      name: full_name,
      value: managers[i].id,
    };
    managerChoices.push(choice);
}

inquirer.prompt([
  {
      type: 'input',
      name: 'firstName',
      message: "Please enter the first name >> "
  },
  {
      type: 'input',
      name: 'lastName',
      message: "Please enter the last name >> "
  },
  {
      type: 'list',
      name: 'role',
      message: "Please select the role  >> ",
      choices: roleChoices
  },
  {
      type: 'list',
      name: 'manager',
      message: "Please select a manager  >> ",
      choices: managerChoices
  }
])
.then ((answer) => {
  return insertEmployee(answer);
  
})

   
}

async function insertEmployee(values) {

  try {
    const sql = `INSERT INTO employee 
    SET first_name = "${values.firstName}",
    last_name = "${values.lastName}",
    role_id = ${values.role},
    manager_id = ${values.manager}`;
    const result = await db.query(sql);
    
    return mainPrompt();
  } catch (error) {
    return error;
  }

}

async function updateEmployee () {
  console.log(`
=====================
Update Employee
=====================
`);

let result = await db.execute("SELECT * FROM employee;");
let employees = result[0];
let employeeChoices = [];

for( i = 0; i< employees.length; i++){
  full_name = employees[i].first_name + " " + employees[i].last_name;
  const choice = {
    name: full_name,
    value: employees[i].id,
  };
  employeeChoices.push(choice);
}
inquirer.prompt([
  {
      type: 'list',
      name: 'employee',
      message: "Please select an employee  >> ",
      choices: employeeChoices
  }
])
.then ((answer) => {

  return promptForManager(answer);
});
   
}

async function promptForManager (employee) {
let result = await db.execute(`SELECT * FROM employee WHERE id != ${employee.employee};`);
let managers = result[0];
let managerChoices = [];

for( i = 0; i< managers.length; i++){
  full_name = managers[i].first_name + " " + managers[i].last_name;
  const choice = {
    name: full_name,
    value: managers[i].id,
  };
  managerChoices.push(choice);
}

inquirer.prompt([
  {
      type: 'list',
      name: 'manager',
      message: "Please select a manager  >> ",
      choices: managerChoices
  }
])
.then ((answer) => {
  answer.employee = employee.employee;
  return updateEmployeeManager(answer);
});
   
}
async function updateEmployeeManager(values) {

  try {
    const sql = `UPDATE employee 
    SET manager_id = ${values.manager}
    WHERE id=${values.employee}`;
    const result = await db.query(sql);
    console.log("Updated employee's manager.");
    return mainPrompt();
  } catch (error) {
    return error;
  }

}

async function mainPrompt () {

  inquirer.prompt( [
      {
          type: 'list',
          name: 'actions',      
          message: 'Please select one of the following options:',
          choices: ['View all departments', 
          'View all roles', 
          'View all employees', 
          'Add a department', 
          'Add a role', 
          'Add an employee', 
          'Update an employee']
      }])
  .then(answer => {
      //If 'View all departments' is chosen
      //call displayDepartmentNames() to display all departments
      if (answer.actions === 'View all departments') {
        console.clear();
        getDeparments().then((departments) => {
            printDataTable("Departments", departments);
            return mainPrompt();
        })
          
      } else if (answer.actions === 'View all roles'){
        console.clear();
        getRoles().then((roles) => {
            printDataTable("Roles", roles);
            return mainPrompt();
        })
      } else if (answer.actions === 'View all employees'){
        console.clear();
        getEmployees().then((roles) => {
            printDataTable("Employees", roles);
            return mainPrompt();
        })
      } else if (answer.actions === 'Add a role'){
        console.clear();
        addRole();
      } else if (answer.actions === 'Add a department'){
        console.clear();
        addDepartment();
      } else if (answer.actions === 'Add an employee'){
        console.clear();
        addEmployee();
      } else if (answer.actions === 'Update an employee'){
        console.clear();
        updateEmployee();
      }
  });
};

    module.exports = {getDepartmentID, getDeparments, getEmployees, getRoles, addRole, getDepartmentNames, addDepartment, mainPrompt};