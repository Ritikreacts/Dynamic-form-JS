export default class Storage {
  constructor(storageId) {
    this.storageId = storageId;
    console.log('Storage');
  }

  loadData() {
    const storedData = localStorage.getItem(this.storageId);
    return storedData ? JSON.parse(storedData) : [];
  }

  saveData(data) {
    localStorage.setItem(this.storageId, JSON.stringify(data));
  }
  getDataById(userId) {
    const data = this.loadData();
    return data.find((item) => item.userId === userId);
  }

  addData(newData, getUserId, getCreatedAt) {
    const data = this.loadData();
    const userId = getUserId(newData);
    const createdAt = getCreatedAt(newData);

    newData.userId = userId;
    newData.createdAt = createdAt;

    data.push(newData);
    this.saveData(data);
  }
}
