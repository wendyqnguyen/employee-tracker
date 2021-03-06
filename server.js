const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dbUtils = require('./utils/dbUtils');

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

// start app functionality
  console.log(`
=====================
Employee Tracker
=====================
`);

// call main prompt
dbUtils.mainPrompt();
