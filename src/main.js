import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId) {
    // this.dataToMain();
    const getUserId = (obj) => formData.find((field) => field.key === 'userId').getValue(obj);
    const getCreatedAt = (obj) => formData.find((field) => field.key === 'createdAt').getValue(obj);

    const storage = new Storage(storageId);
    const frm = new Form(formContainerId, formData);
    // frm.container.addEventListener('submit', (e) => {
    //   e.preventDefault();
    //   const data = frm.handleForm();
    //   console.log(data);
    // });

    const tbl = new Table(tableContainerId);
  }
}
const main = new Main('employeeForm', 'storageId', 'tableDiv');

console.log(main);
