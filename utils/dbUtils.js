const mysql = require('mysql2');

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

  function getDepartmentNames(){
    let departmentArr = [];
    const sql = `SELECT name FROM department`;
    db.query(sql, (err,rows) =>{
        if (err) {
            console.log({ error: err.message});
            return;
        }
        for(i = 0; i < rows.length; i++){
          departmentArr[i] = rows[i].name;
        }
        console.log(departmentArr);
        return(departmentArr);
    });
  }


  module.exports = {getDepartmentID, getDepartmentNames};