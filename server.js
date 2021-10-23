const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 4001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

  db.query(`SELECT * FROM employee`, (err, rows) => {
    console.log(rows);
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// GET a single employee
db.query(`SELECT * FROM employee WHERE id = 11`, (err, row) => {
    if (err) {
      console.log(err);
    }
    console.log(row);
  });

// // Delete a employee
// db.query(`DELETE FROM employee WHERE id = ?`, 11, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });

  // Create a employee
const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES (?,?,?,?,?)`;
const params = [13, 'Ronald', 'Firbank', 25, 12];

db.query(sql, params, (err, result) => {
if (err) {
console.log(err);
}
console.log(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});