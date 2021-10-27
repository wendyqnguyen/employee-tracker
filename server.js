const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');

const dbUtils = require('./utils/dbUtils');
const inputCheck = require('./utils/inputCheck');
const { json } = require('express');
// const { getDepartmentNames } = require('./utils/dbUtils');

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

const addDepartment = () =>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Please enter the department name >> "
        }])
    .then ( answer => {
        const errors = inputCheck(answer, 'name');
        if (errors) {
        console.log({ error: errors });
        return;
        }
        const sql = `INSERT INTO department (name)
    VALUES (?)`;
        const params = [answer.name];
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                return;
            } else {
                console.log(`${answer.name} was added to the database`);
            }
        });

        
    })
}

const addEmployee = () =>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Please enter the employee first name >> "
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the employee last name >> "
        }])
    .then ( answer => {
        const errors = inputCheck(answer, 'name');
        if (errors) {
        console.log({ error: errors });
        return;
        }
        const sql = `INSERT INTO employee (name)
    VALUES (?)`;
        const params = [answer.name];
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log({ error: err.message });
                return;
            } else {
                console.log(`${answer.name} was added to the database`);
            }
        });

        
    })
}

async function getDeparments() {
    
    const result = await db.execute("SELECT * FROM department;");
    let str = result[0];
    str = JSON.stringify(str);
    // console.log(str);
    str = str.replace(/"name":/g, '');
    str = str.replace(/}/g, '');
    str = str.replace(/{/g, '');
    // str = str.replace(/"/g, '\'');
    console.log(str);
  
    return Promise.resolve(str);
}

async function addRole () {
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
                message: "Please enter the role department >> ",
                choices: departments
            }])
            .then ( async (answers) => {
                let params = answers.department_name;

                sql = `INSERT INTO roles (title, salary, department_id)
                VALUES ("${answers.title}", ${answers.salary},
                       (SELECT id FROM department WHERE name ="${answers.department_name}"));`;
                       
                    
                try {
                    result = await db.query(sql);
                    console.log(`${answers.title} was added to roles.`)
                } catch (err) {
                    console.log({ error: err.message });
                    return;
                } 
 });
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
            dbUtils.getDepartmentNames();
                return mainPrompt();
              
            // dbUtils.displayDepartmentNames();
            //     return mainPrompt();
        } else if (answer.actions === 'View all roles'){
            dbUtils.getRoles();
            return mainPrompt();
        } else if (answer.actions === 'View all employees'){
            dbUtils.getEmployees();
            return mainPrompt();
        }
    //   } else if (answer.actions === 'Add an engineer') {
    //       //if 'Add an engineer' is selected call the function to prompt for engineer info
    //       return promptEngineer();
    //   } else if (answer.actions === 'Add an intern') {
    //     //if 'Add an intern' is selected call the function to prompt for intern info
    //         return promptIntern();
    //     }
    });
  };

  console.log(`
    =====================
    Employee Tracker
    =====================
    `);

  mainPrompt();