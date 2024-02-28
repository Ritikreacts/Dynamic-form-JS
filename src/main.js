import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId) {
    this.storage = new Storage(storageId);
    this.frm = new Form(formContainerId, formData);
    this.tbl = new Table(tableContainerId);
    this.getUserId = (obj) => formData.find((field) => field.key === 'userId').getValue(obj);
    this.getCreatedAt = (obj) => formData.find((field) => field.key === 'createdAt').getValue(obj);
    this.getFormData;

    this.frm.on('submit', (getFormData) => {
      this.initializeHandlers(getFormData);
    });

    this.tbl.on('edit', (userId) => {
      console.log('userId in main -', userId);
      this.handleEditItem(userId);
    });

    this.frm.on('update', (getFormData) => {
      this.handleFormUpdate(getFormData);
    });

    this.tbl.on('delete', (userId) => {
      this.handleDeleteItem(userId);
    });
  }
  // setupEventListeners() {
  //   document.addEventListener('formSubmit', this.handleFormSubmit.bind(this));
  //   document.addEventListener('formUpdateSubmit', this.handleFormUpdate.bind(this));
  //   document.addEventListener('deleteItem', this.handleDeleteItem.bind(this));
  //   document.addEventListener('editItem', this.handleEditItem.bind(this));
  // }

  // handleFormSubmit(event) {
  //   const getFormData = event.detail;
  //   this.initializeHandlers(getFormData);
  // }
  handleFormUpdate(getFormData) {
    const userId = this.userId;
    this.editDataHandler(getFormData, userId);
  }
  handleDeleteItem(userId) {
    console.log('user id deleted-', userId);
    this.storage.deleteData(userId);
    const data = this.storage.loadData();
    this.tbl.updateDisplay(data);
    if (this.userId == userId) {
      this.frm.formFullReset();
    }
  }
  handleEditItem(userId) {
    this.userId = userId;
    const data = this.storage.loadData();
    const formDataToEdit = data.find((obj) => obj.userId === this.userId);
    this.frm.fillFormOnEdit(formDataToEdit);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  initializeHandlers(formDataObject) {
    const getUserId = this.getUserId;
    const getCreatedAt = this.getCreatedAt;
    this.storage.addData(formDataObject, getUserId, getCreatedAt);
    this.tbl.appendHeader(formData);
    this.tbl.appendDataRow(formDataObject);
    const data = this.storage.loadData();
    this.tbl.updateDisplay(data);
  }
  addOnTab(formDataObject) {
    this.storage.addDataOnSwitch(formDataObject);
    this.tbl.appendHeader(formDataObject);
    this.tbl.appendDataRow(formDataObject);
    const data = this.storage.loadData();
    this.tbl.updateDisplay(data);
  }
  editDataHandler(getFormData, userId) {
    const data = this.storage.loadData();
    const formDataToEdit = data.find((obj) => obj.userId === this.userId);
    getFormData.userId = userId;
    const formDataToEditClone = Object.keys(formDataToEdit)
      .filter((objKey) => objKey !== 'createdAt')
      .reduce((newObj, key) => {
        newObj[key] = formDataToEdit[key];
        return newObj;
      }, {});

    if (JSON.stringify(getFormData) == JSON.stringify(formDataToEditClone)) {
      this.frm.formFullReset();
    } else {
      this.tbl.updateRow(userId, getFormData);
      this.storage.updateData(getFormData, userId);
    }
  }
}

const main = new Main('employeeForm', 'storageId', 'tableDiv');
const dataInStorage = main.storage.loadData();
main.tbl.appendHeader(formData);
main.tbl.displayDataOnLoad(dataInStorage);
const data = main.storage.loadData();
main.tbl.updateDisplay(data);

//For Synchronous table

window.addEventListener('storage', (change) => {
  const newVal = JSON.parse(change.newValue);
  const oldVal = JSON.parse(change.oldValue);
  console.log(oldVal !== null);
  console.log(oldVal.length === newVal.length);
  console.log(oldVal.length);
  console.log(newVal.length);
  if (oldVal !== null && oldVal.length === newVal.length) {
    console.log('Value updated from another tab');
    for (let i = 0; i < newVal.length; i++) {
      for (let key in newVal[i]) {
        if (newVal[i][key] !== oldVal[i][key]) {
          console.log('newVal[i][key]', newVal[i][key]);
          console.log('oldVal[i][key]', oldVal[i][key]);
          console.log('newVal[i]', newVal[i]);
          main.tbl.updateRow(newVal[i].userId, newVal[i]);
        }
      }
    }
  } else if (newVal.length == oldVal.length - 1) {
    console.log('Value deleted from another tab');

    const userObjectDeleted = oldVal.filter((object) => !newVal.some((obj) => obj.userId === object.userId));
    const userIdDeleted = userObjectDeleted[0].userId;
    const rowToDelete = document.getElementById(userIdDeleted);
    rowToDelete.remove();
  } else {
    console.log('Value added from another tab');
    const newlyAddedObject = newVal.at(-1);
    main.tbl.appendHeader(formData);
    main.tbl.appendDataRow(newlyAddedObject);
  }
});
