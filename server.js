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

//   const promisePool = db.promise();

  

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




  console.log(`
=====================
Employee Tracker
=====================
`);

  dbUtils.mainPrompt();
