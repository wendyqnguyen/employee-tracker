const mysql = require('mysql2');
const cTable = require('console.table');


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

  function getEmployees(){
    let employeeArr = [];
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err,rows) =>{
        if (err) {
            console.log({ error: err.message});
            return;
        }
        for(i = 0; i < rows.length; i++){
          employeeArr[i] = {ID: rows[i].id,
            First_Name: rows[i].first_name,
            Last_Name: rows[i].last_name
          }
        }
        console.table(employeeArr);
    });
  }

function getRoles(){
    let rolesArr = [];
    const sql = `SELECT roles.id, roles.title, roles.salary, department.name  FROM roles, department WHERE roles.department_id = department.id;`;
    db.query(sql, (err,rows) =>{
        if (err) {
            console.log({ error: err.message});
            return;
        }
        for(i = 0; i < rows.length; i++){
          rolesArr[i] = {ID: rows[i].id,
            Title: rows[i].title,
            Salary: rows[i].salary,
            Deparment: rows[i].name
          }
        }
        console.table(rolesArr);
    });
  }

  module.exports = {getDepartmentID, getDepartmentNames, getEmployees, getRoles};