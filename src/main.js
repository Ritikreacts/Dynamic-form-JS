import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId) {
    this.storage = new Storage(storageId);
    this.frm = new Form(formContainerId, formData);
    this.tbl = new Table(tableContainerId);
    console.log(this.tbl);
    this.getUserId = (obj) => formData.find((field) => field.key === 'userId').getValue(obj);
    this.getCreatedAt = (obj) => formData.find((field) => field.key === 'createdAt').getValue(obj);

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('formSubmit', this.handleFormSubmit.bind(this));
  }

  handleFormSubmit(event) {
    const getFormData = event.detail;
    this.initializeHandlers(getFormData);
  }

  initializeHandlers(formDataObject) {
    const getUserId = this.getUserId;
    const getCreatedAt = this.getCreatedAt;
    this.storage.addData(formDataObject, getUserId, getCreatedAt);
    this.tbl.appendHeader(formData);
    this.tbl.appendDataRow(formDataObject);
    alert('Data added successfully!');
  }
}

const main = new Main('employeeForm', 'storageId', 'tableDiv');
