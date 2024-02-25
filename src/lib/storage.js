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
  deleteData(userId){
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
}
