export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId);
    this.table = document.createElement('table');
    this.table.classList.add('table', 'table-bordered');
    this.container.appendChild(this.table);
    this._events = {};
    this.on = (eventName, callback) => {
      if (!this._events[eventName]) {
        this._events[eventName] = [callback];
      } else {
        this._events[eventName].push(callback);
      }
    };
  }
  appendHeader(formDataArgument) {
    const formData = formDataArgument;
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    formData.forEach((field) => {
      if (field.type !== 'submit' && field.type !== 'reset') {
        const headerCell = document.createElement('th');
        headerCell.textContent = field.label || field.key;
        headerRow.appendChild(headerCell);
      }
    });

    const actionHeaderCell = document.createElement('th');
    actionHeaderCell.textContent = 'Action';
    headerRow.appendChild(actionHeaderCell);
    const theadElements = document.getElementsByTagName('thead');
    const hasThead = theadElements.length > 0;
    if (!hasThead) {
      thead.appendChild(headerRow);
    }
    this.table.appendChild(thead);
  }
  appendDataRow(getFormData) {
    const reorderedFormData = {
      userId: getFormData.userId,
      createdAt: getFormData.createdAt,
      ...getFormData,
    };

    const row = document.createElement('tr');
    row.setAttribute('id', reorderedFormData.userId);
    Object.values(reorderedFormData).forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;

      row.appendChild(cell);
    });
    const createButton = (text, clickHandler) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', clickHandler);
      return button;
    };
    const action = document.createElement('td');
    const editButton = createButton('Edit', (event) => this.handleEdit(event, reorderedFormData.userId));
    const deleteButton = createButton('Delete', (event) => this.handleDelete(event, reorderedFormData.userId));
    action.appendChild(editButton);
    action.appendChild(deleteButton);

    row.appendChild(action);
    this.table.appendChild(row);
  }
  displayDataOnLoad(data) {
    data.forEach((object) => {
      const row = document.createElement('tr');

      const reorderedFormData = {
        userId: object.userId,
        createdAt: object.createdAt,
        ...object,
      };
      row.setAttribute('id', reorderedFormData.userId);
      Object.values(reorderedFormData).forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });
      const createButton = (text, clickHandler) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        return button;
      };
      const action = document.createElement('td');
      const editButton = createButton('Edit', (event) => this.handleEdit(event, reorderedFormData.userId));
      const deleteButton = createButton('Delete', (event) => this.handleDelete(event, reorderedFormData.userId));
      action.appendChild(editButton);
      action.appendChild(deleteButton);

      row.appendChild(action);
      this.table.appendChild(row);
    });
  }

  handleDelete(event, userId) {
    const rowToDelete = document.getElementById(userId);
    rowToDelete.remove();
    this.on('delete', () => userId);
    this._events['delete'].forEach((fun) => fun(userId));
    // const deleteEvent = new CustomEvent('deleteItem', { detail: userId });
    // document.dispatchEvent(deleteEvent);
  }
  handleEdit(event, userId) {
    console.log('this._events', this._events);
    // this.on('edit', () => userId);
    this._events['edit'].forEach((fun) => fun(userId));
    console.log('userId in Table -', userId);
    console.log(this._events);
    // const editEvent = new CustomEvent('editItem', { detail: userId });
    // document.dispatchEvent(editEvent);
  }
  updateRow(userId, getFormData) {
    const RowToChange = document.getElementById(userId).children;
    const RowNewData = Object.keys(getFormData)
      .filter((objKey) => objKey !== 'userId')
      .reduce((newObj, key) => {
        newObj[key] = getFormData[key];
        return newObj;
      }, {});
    const integratedData = Object.keys(RowNewData)
      .filter((objKey) => objKey !== 'createdAt')
      .reduce((newObj, key) => {
        newObj[key] = RowNewData[key];
        return newObj;
      }, {});

    for (let x = 2; x <= RowToChange.length - 1; x++) {
      Object.values(integratedData).forEach((value) => {
        RowToChange[x].innerText = value;
        x += 1;
      });
    }
  }
  updateDisplay(data) {
    const localStorageData = data;
    if (localStorageData !== null && localStorageData.length !== 0) {
      document.getElementById('tableDiv').style.display = 'block';
    } else {
      document.getElementById('tableDiv').style.display = 'none';
    }
  }
}
