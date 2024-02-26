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
  updateData(getFormData, userId) {
    const data = this.loadData();
    const originalObject = data.find((item) => item.userId === userId);
    const objectToReplace = Object.keys(getFormData)
      .filter((objKey) => objKey !== 'userId')
      .reduce((newObj, key) => {
        newObj[key] = getFormData[key];
        return newObj;
      }, {});

    for (const key in objectToReplace) {
      if (key !== 'userId' && key !== 'createdAt') {
        originalObject[key] = objectToReplace[key];
      }
    }
    localStorage.setItem(this.storageId, JSON.stringify(data));
  }
}
