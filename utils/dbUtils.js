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

  const result = await db.query("SELECT * FROM employee");
  return result[0];
  }

async function getRoles(){
  const result = await db.query("SELECT roles.id, roles.title, roles.salary, department.name  FROM roles, department WHERE roles.department_id = department.id;");
  return result[0];
  }

async function addRole () {
    console.log(`
=====================
Add Role
=====================
`);


let department_id;
let result = await db.execute("SELECT name FROM department;");
let departments = result[0];
departments = JSON.stringify(departments);
departments = departments.replace(/"name":/g, '');
departments = departments.replace(/}/g, '');
departments = departments.replace(/{/g, '');
departments = JSON.parse(departments);

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
  return insertRole(answer);
    
  })

     
}

async function insertRole(values) {
  try {
    const sql = `INSERT INTO roles 
    SET title = "${values.title}",
    salary = ${values.salary},
    department_id = (
        SELECT id
          FROM department
          WHERE name = "${values.department_name}")`;
    const result = await db.query(sql);
    console.log(values.title + " role was added.")
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
    const sql = "INSERT INTO department (name) VALUES (?)";
    params = [name];
    const result = await db.query(sql, params);
    console.log(name + " department was added.")
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

let result = await db.execute("SELECT title FROM roles;");
let roles = result[0];
roles = JSON.stringify(roles);
roles = roles.replace(/"title":/g, '');
roles = roles.replace(/}/g, '');
roles = roles.replace(/{/g, '');
roles = JSON.parse(roles);

result = await db.execute("SELECT first_name, last_name FROM employee;");
let managers = result[0];
let managerNames = [];
for( i = 0; i< managers.length; i++){
  managerNames.push(managers[i].first_name + " " + managers[i].last_name)
}
// console.log("* " + managers[0].first_name + " " + managers[0].last_name);
// managers = JSON.stringify(managers);
// managers = managers.replace(/"first_name":/g, '');
// managers = managers.replace(/"last_name":/g, '');
// managers = managers.replace(/}/g, '');
// managers = managers.replace(/{/g, '');
// // managers = JSON.parse(managers);

console.log("* " + managerNames);
return;
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
      name: 'roles',
      message: "Please select the role  >> ",
      choices: roles
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
  role_id = (
      SELECT id
        FROM roles
        WHERE title = "${values.roles}")`;
  console.log(sql);
  const result = await db.query(sql);
  console.log(values.title + " employee was added.")
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
          'Update an employee role']
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
      }
  });
};

    module.exports = {getDepartmentID, getDeparments, getEmployees, getRoles, addRole, getDepartmentNames, addDepartment, mainPrompt};