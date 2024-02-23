export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId);
    console.log('Form ki ID = ', formContainerId);
    // this.container.addEventListener('submit', this.handleSubmit.bind(this))
    this.container.addEventListener('submit', this.handleForm.bind(this));
    this.formData = formData;
    this.startForm();
  }

  startForm() {
    this.formData.forEach((field) => {
      const inputElement = this.createInputElement(field);
      if (inputElement) {
        this.container.appendChild(inputElement);
      }
    });
  }
  resetForm() {
    this.container.reset();
  }

  createInputElement(field) {
    if (field.type === 'hidden') {
      return;
    }

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('form-group');
    const labelElement = document.createElement('label');
    labelElement.innerText = field.label;
    labelElement.setAttribute('for', field.attr && field.attr.id ? field.attr.id : field.key);
    inputContainer.appendChild(labelElement);

    switch (field.type) {
      case 'submit':
      case 'reset':
        const buttonElement = document.createElement('input');
        buttonElement.setAttribute('type', field.type);
        buttonElement.setAttribute('id', field.attr && field.attr.id ? field.attr.id : field.key);
        buttonElement.setAttribute('name', field.key);
        buttonElement.setAttribute('class', field.attr && field.attr.className ? field.attr.className : 'btn');
        buttonElement.innerText = field.value || '';
        return buttonElement;

      case 'radio':
        field.options.forEach((option) => {
          const radioContainer = document.createElement('div');
          radioContainer.classList.add('form-check');

          const radioElement = document.createElement('input');
          radioElement.setAttribute('type', 'radio');
          radioElement.setAttribute('id', option.attr && option.attr.id ? option.attr.id : option.value);
          radioElement.setAttribute('name', field.key);
          radioElement.setAttribute(
            'class',
            option.attr && option.attr.className ? option.attr.className : 'form-check-input'
          );
          radioElement.setAttribute('value', option.value);

          const optionLabel = document.createElement('label');
          optionLabel.innerText = option.innerText;
          optionLabel.setAttribute('for', option.attr && option.attr.id ? option.attr.id : option.value);

          radioContainer.appendChild(radioElement);
          radioContainer.appendChild(optionLabel);
          inputContainer.appendChild(radioContainer);
        });
        break;

      case 'checkbox':
        field.options.forEach((option) => {
          const checkboxContainer = document.createElement('div');
          checkboxContainer.classList.add('form-check');

          const checkboxElement = document.createElement('input');
          checkboxElement.setAttribute('type', 'checkbox');
          checkboxElement.setAttribute('id', option.attr && option.attr.id ? option.attr.id : option.value);
          checkboxElement.setAttribute('name', field.key);
          checkboxElement.setAttribute(
            'class',
            option.attr && option.attr.className ? option.attr.className : 'form-check-input'
          );
          checkboxElement.setAttribute('value', option.value);

          const optionLabel = document.createElement('label');
          optionLabel.innerText = option.innerText;
          optionLabel.setAttribute('for', option.attr && option.attr.id ? option.attr.id : option.value);

          checkboxContainer.appendChild(checkboxElement);
          checkboxContainer.appendChild(optionLabel);

          inputContainer.appendChild(checkboxContainer);
        });
        break;

      case 'select':
        const selectElement = document.createElement('select');
        selectElement.setAttribute('id', field.attr && field.attr.id ? field.attr.id : field.key);
        selectElement.setAttribute('name', field.key);
        selectElement.setAttribute('class', field.attr && field.attr.className ? field.attr.className : 'form-control');

        selectElement.setAttribute('required', field.attr && field.attr.required ? 'required' : '');

        field.options.forEach((option) => {
          const optionElement = document.createElement('option');
          optionElement.innerText = option.innerText;
          optionElement.setAttribute('value', option.value);
          selectElement.appendChild(optionElement);
        });
        inputContainer.appendChild(selectElement);
        break;

      case 'textarea':
        const textareaElement = document.createElement('textarea');
        textareaElement.setAttribute('id', field.attr && field.attr.id ? field.attr.id : field.key);
        textareaElement.setAttribute('name', field.key);
        textareaElement.setAttribute(
          'class',
          field.attr && field.attr.className ? field.attr.className : 'form-control'
        );
        textareaElement.setAttribute('required', field.attr && field.attr.required ? 'required' : '');

        inputContainer.appendChild(textareaElement);
        textareaElement.setAttribute('placeholder', field.attr && field.attr.placeholder ? field.attr.placeholder : '');
        textareaElement.setAttribute('rows', field.attr && field.attr.rows ? field.attr.rows : '5');
        textareaElement.setAttribute('value', field.value || '');
        break;

      case 'tel':
        const numberElement = document.createElement('input');
        numberElement.setAttribute('type', 'tel');
        numberElement.setAttribute('id', field.attr && field.attr.id ? field.attr.id : field.key);
        numberElement.setAttribute('name', field.key);
        numberElement.setAttribute('value', field.value || '');

        numberElement.setAttribute(
          'placeholder',
          field.attr && field.attr.placeholder ? field.attr.placeholder : 'Enter your number'
        );
        numberElement.setAttribute(
          'class',
          field.attr && field.attr.className ? field.attr.className : 'form-control textInput'
        );
        numberElement.innerText = field.value || '';
        inputContainer.appendChild(numberElement);
        break;

      default:
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', field.type);
        inputElement.setAttribute('id', field.attr && field.attr.id ? field.attr.id : field.key);
        inputElement.setAttribute('name', field.key);
        inputElement.setAttribute('class', field.attr && field.attr.className ? field.attr.className : 'form-control');
        inputElement.setAttribute('placeholder', field.attr && field.attr.placeholder ? field.attr.placeholder : '');
        inputElement.setAttribute('required', field.attr && field.attr.required ? 'required' : '');

        inputElement.setAttribute('value', field.value || '');

        inputContainer.appendChild(inputElement);
    }

    return inputContainer;
  }

  handleForm(event) {
    event.preventDefault();

    const getFormData = {};
    Array.from(this.container.elements).forEach((element) => {
      if (element.name) {
        switch (element.type) {
          case 'hidden':
            getFormData[element.name] = element.value;

            break;
          case 'checkbox':
            if (element.checked) {
              getFormData[element.name] = getFormData[element.name] || [];
              getFormData[element.name].push(element.value);
            }
            break;
          case 'radio':
            if (element.checked) {
              getFormData[element.name] = element.value;
            }
            break;
          case 'select-one':
          case 'select-multiple':
            getFormData[element.name] = getFormData[element.name] || [];
            getFormData[element.name].push(element.value);
            break;
          default:
            if (element.value.length !== 0) {
              getFormData[element.name] = element.value;
            }
            break;
        }
      }
    });
    // console.log(getFormData);

    const formSubmitEvent = new CustomEvent('formSubmit', { detail: getFormData });
    document.dispatchEvent(formSubmitEvent);
    console.log(getFormData);
    this.resetForm();
  }
}
