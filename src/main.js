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
    const getFormData = event.detail;
    const userId = this.userId;
    this.editDataHandler(getFormData, userId);
  }
  handleDeleteItem(event) {
    const userId = event.detail;
    this.storage.deleteData(userId);
    const data = this.storage.loadData();
    this.tbl.updateDisplay(data);
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
      alert('No changes');
    } else {
      alert('Changed');
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
