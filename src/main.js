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
    this.getFormData = null;

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
  handleFormUpdate(event) {
    this.getFormData = event.detail;
    const userId = this.userId;
    this.editDataHandler(this.getFormData, userId);
  }
  handleDeleteItem(event) {
    const userId = event.detail;
    this.storage.deleteData(userId);
    const data = this.storage.loadData();
    this.tbl.updateDisplay(data);
    if (this.userId == userId) {
      this.frm.formFullReset();
    }
  }
  handleEditItem(event) {
    this.userId = event.detail;
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
  console.log(newVal);
  console.log(oldVal);
  if (oldVal == !null || oldVal.length == newVal.length) {
    for (let i = 0; i < oldVal.length; i++) {
      const obj1 = oldVal[i];
      const obj2 = newVal[i];
      for (const key in obj1) {
        if (obj1[key].hasOwnProperty && obj1[key] !== obj2[key]) {
          const userIdChanged = obj2.userId;
          console.log(obj2);
          return main.tbl.updateRow(userIdChanged, obj2);
        }
      }
    }
  }

  // newVal.forEach((object) => {
  //   const userIdChanged = object.userId;
  //   main.tbl.updateRow(userIdChanged, object);
  // });
  else if (newVal.length == oldVal.length - 1) {
    const userObjectDeleted = oldVal.filter((object) => !newVal.some((obj) => obj.userId === object.userId));
    const userIdDeleted = userObjectDeleted[0].userId;
    const rowToDelete = document.getElementById(userIdDeleted);
    rowToDelete.remove();
  } else {
    const newlyAddedObject = newVal.at(-1);
    main.tbl.appendHeader(formData);
    main.tbl.appendDataRow(newlyAddedObject);
  }
});
