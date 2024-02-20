export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId); // Use this container to create table inside of it
    // Pass tableContainerId to append table inside of HTML DIV element
    console.log('Table');
  }
  // create methods/event to refresh table data, add data row, update data row, delete data row, etc
}
