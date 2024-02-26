export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId);
    this.table = document.createElement('table');
    this.table.classList.add('table', 'table-bordered');
    this.container.appendChild(this.table);
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
    if (!document.querySelector('thead')) {
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
    const action = document.createElement('td');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', (event) => this.handleDelete(event, reorderedFormData.userId));
    editButton.addEventListener('click', (event) => this.handleEdit(event, reorderedFormData.userId));
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Delete';
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
      const action = document.createElement('td');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      editButton.textContent = 'Edit';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', (event) => this.handleDelete(event, reorderedFormData.userId));
      editButton.addEventListener('click', (event) => this.handleEdit(event, reorderedFormData.userId));
      action.appendChild(editButton);
      action.appendChild(deleteButton);
      row.appendChild(action);
      this.table.appendChild(row);
    });
  }

  handleDelete(event, userId) {
    const rowToDelete = document.getElementById(userId);

    rowToDelete.remove();
    const deleteEvent = new CustomEvent('deleteItem', { detail: userId });
    document.dispatchEvent(deleteEvent);
  }
  handleEdit(event, userId) {
    const editEvent = new CustomEvent('editItem', { detail: userId });
    document.dispatchEvent(editEvent);
  }
  updateRow(userId, getFormData) {
    const RowToChange = document.getElementById(userId).children;
    const RowNewData = Object.keys(getFormData)
      .filter((objKey) => objKey !== 'userId')
      .reduce((newObj, key) => {
        newObj[key] = getFormData[key];
        return newObj;
      }, {});
    for (let x = 2; x <= RowToChange.length - 1; x++) {
      Object.values(RowNewData).forEach((value) => {
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
