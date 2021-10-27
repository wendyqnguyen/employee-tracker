const cTable = require("console.table");

//Print titles
function printTitle(title) {
  console.log(`
  ---------------------------------------------------
  ${title.toUpperCase()}
  ---------------------------------------------------`);
}

//Print the data in a table with the given title
function printDataTable(title, data) {
  console.log(`
  ---------------------------------------------------
  ${title.toUpperCase()}
  ---------------------------------------------------`);
  console.table(data);
  console.log(`----------------------------------------------------------`);
}

module.exports = { printTitle, printDataTable };