export default class Storage {
  constructor(storageId) {
    this.storageId = storageId;
  }

  loadData() {
    const storedData = localStorage.getItem(this.storageId);
    return storedData ? JSON.parse(storedData) : [];
  }

  saveData(data) {
    localStorage.setItem(this.storageId, JSON.stringify(data));
  }
  deleteData(userId) {
    let data = this.loadData();
    data = data.filter((item) => item.userId !== userId);
    this.saveData(data);
  }

  addData(dataToAdd, getUserId, getCreatedAt) {
    const data = this.loadData();
    const userId = getUserId(dataToAdd);
    const createdAt = getCreatedAt(dataToAdd);

    dataToAdd.userId = userId;
    dataToAdd.createdAt = createdAt;

    data.push(dataToAdd);
    this.saveData(data);
  }
  addDataOnSwitch(getFormData) {
    const data = this.loadData();
    data.push(getFormData);
    this.saveData(data);
  }
  updateData(getFormData, userId) {
    const data = this.loadData();
    const objectToReplace = getFormData;
    const originalObject = data.find((item) => item.userId === userId);
    objectToReplace.createdAt = originalObject.createdAt;
    const indexToReplace = data.findIndex((item) => item.userId === objectToReplace.userId);
    if (indexToReplace !== -1) {
      data[indexToReplace] = objectToReplace;
      localStorage.setItem(this.storageId, JSON.stringify(data));
    }
  }
}
