const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const dbUtils = require('./utils/dbUtils');
const inputCheck = require('./utils/inputCheck');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'root',
      database: 'company'
    },
    console.log('Connected to the company database.')
  );

// //Get all employees
// app.get('/api/employee', (req,res) => {
//     const sql = `SELECT * FROM employee`;
//     db.query(sql, (err,rows) =>{
//         if (err) {
//             res.status(500).json({ error: err.message});
//             return;
//         }
//         res.json({
//             message: "success",
//             data: rows,
//         });
//     });
// });

// // Get a single employee
// app.get('/api/employee/:id', (req, res) => {
//     const sql = `SELECT * FROM employee WHERE id = ?`;
//     const params = [req.params.id];
  
//     db.query(sql, params, (err, row) => {
//       if (err) {
//         res.status(400).json({ error: err.message });
//         return;
//       }
//       res.json({
//         message: 'success',
//         data: row
//       });
//     });
//   });

//   // Delete a employee
// app.delete('/api/employee/:id', (req, res) => {
//     const sql = `DELETE FROM employee WHERE id = ?`;
//     const params = [req.params.id];
  
//     db.query(sql, params, (err, result) => {
//       if (err) {
//         res.statusMessage(400).json({ error: res.message });
//       } else if (!result.affectedRows) {
//         res.json({
//           message: 'Candidate not found'
//         });
//       } else {
//         res.json({
//           message: 'deleted',
//           changes: result.affectedRows,
//           id: req.params.id
//         });
//       }
//     });
//   });

//   // Create a employee
// app.post('/api/employee', ({ body }, res) => {
//     const errors = inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');
//     if (errors) {
//       res.status(400).json({ error: errors });
//       return;
//     }
//   });

// // Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
//   });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

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

const addRole = () =>{
    dbUtils.getDepartmentNames().then( arrDepartments => {
        console.log(`addRole = ${arrDepartments}`);

    });

    return;
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Please enter the role name >> "
        },
        {
            type: 'input',
            name: 'salary',
            message: "Please enter the salary >> "
        },
        {
            type: 'list',
            name: 'department',
            message: `${departmentArr}`
        }
    ])
    .then ( answer => {
        console.log(answer);
        const errors = inputCheck(answer, 'title', 'salary', 'department_id');
        if (errors) {
        console.log({ error: errors });
        return;
        }
    //     const sql = `INSERT INTO department (title, salary, department_id)
    // VALUES (?,?,?)`;
    //     const params = [answer.name];
    //     db.query(sql, params, (err, result) => {
    //         if (err) {
    //             console.log({ error: err.message });
    //             return;
    //         } else {
    //             console.log(`${answer.name} was added to the database`);
    //         }
    //     });

        
    })
}

// inquirer.prompt( [
//     {
//         type: 'list',
//         name: 'action',      
//         message: 'Please select one of the following options:',
//         choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
//     }])
// .then(answer => {
//     console.log(`Answer is ${answer.action}`);
//     if (answer.action === 'View all employees') {
//         const sql = `SELECT * FROM employee`;
//         db.query(sql, (err,rows) =>{
//             if (err) {
//                 res.status(500).json({ error: err.message});
//                 return;
//             }
//             console.table(rows);
//         });
//     } else if (answer.action === 'View all roles') {
//         const sql = `SELECT * FROM role`;
//         db.query(sql, (err,rows) =>{
//             if (err) {
//                 res.status(500).json({ error: err.message});
//                 return;
//             }
//             console.table(rows)
//         });
//     } else if (answer.action === 'View all departments') {
//         const sql = `SELECT * FROM department`;
//         db.query(sql, (err,rows) =>{
//             if (err) {
//                 res.status(500).json({ error: err.message});
//                 return;
//             }
//             console.table(rows);
//         });
//     } else if (answer.action === 'Add a department') {
//         addDepartment();
//     } else if (answer.action === 'Add a department') {
//         console.log("Add a department was selected.");
//     } else if (answer.action === 'Add a role') {
//         console.log("Add a department was selected.");
//     } else if (answer.action === 'Add a employee') {
//         console.log("Add a department was selected.");
//     }
// });

// console.log(getDepartmentID('Management'));
addRole();