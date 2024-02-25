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
    document.addEventListener('formUpdateSubmit', this.handleFormUpdate.bind(this));
    document.addEventListener('deleteItem', this.handleDeleteItem.bind(this));
    document.addEventListener('editItem', this.handleEditItem.bind(this));
  }

  handleFormSubmit(event) {
    const getFormData = event.detail;
    this.initializeHandlers(getFormData);
  }
  handleFormUpdate(event){
    const getFormData = event.detail;
    this.editDataHandler(getFormData);
  }
  handleDeleteItem(event) {
    const userId = event.detail;
    this.storage.deleteData(userId);
    console.log(`User with ID ${userId} is marked for deletion.`);
  }
  handleEditItem(event) {
    const userId = event.detail;
    console.log(`User with ID ${userId} is marked for edition.`);
    const data=this.storage.loadData();
    const formDataToEdit = data.find(obj => obj.userId === userId);
    console.log("formDataToEdit",formDataToEdit)
    this.frm.fillFormOnEdit(formDataToEdit)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
     })
  }
  initializeHandlers(formDataObject) {
    const getUserId = this.getUserId;
    const getCreatedAt = this.getCreatedAt;
    this.storage.addData(formDataObject, getUserId, getCreatedAt);
    this.tbl.appendHeader(formData);
    this.tbl.appendDataRow(formDataObject);
    alert('Data added successfully!');
  }
  editDataHandler(getFormData) {
    const data = this.storage.loadData();
    const dataChange = data.filter((item) => item.userId == getFormData.userId);

    const compareObjects = (obj1, obj2) => {
      const { createdAt, ...data1 } = obj1;
      const { createdAt: _, ...data2 } = obj2;
      for (const key in data1) {
        if (data1[key] !== data2[key]) {
          return false;
        }
      }
      return true;
    };

    if (compareObjects(dataChange, getFormData)) {
      alert('No changes');
    } else {
      alert('Changed');
    }
  }


}

const main = new Main('employeeForm', 'storageId', 'tableDiv');
