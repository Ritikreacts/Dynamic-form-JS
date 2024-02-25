export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId);
    this.table = document.createElement('table');
    this.table.classList.add('table', 'table-bordered');
    this.container.appendChild(this.table);
  }
  const;
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
    row.setAttribute('id',reorderedFormData.userId)
    Object.values(reorderedFormData).forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      console.log(value);
      row.appendChild(cell);
    });
    const action = document.createElement('td');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', (event) => this.handleDelete(event, reorderedFormData.userId));
    editButton.addEventListener('click', (event) => this.handleEdit(event, reorderedFormData.userId));
    console.log({ as: editButton });
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Delete';
    action.appendChild(editButton);
    action.appendChild(deleteButton);
    row.appendChild(action);
    this.table.appendChild(row);
  }

  handleDelete(event, userId) {
    alert("delete clicked");
    const rowToDelete = document.getElementById(userId)
    rowToDelete.remove();
    const deleteEvent = new CustomEvent('deleteItem', { detail: userId });
    document.dispatchEvent(deleteEvent);

  }
  handleEdit(event, userId) {
    alert("Update clicked");
    const rowToEdit = document.getElementById(userId)
    console.log(rowToEdit.childNodes)
    const editEvent = new CustomEvent('editItem', { detail: userId });
    document.dispatchEvent(editEvent);

}
}
