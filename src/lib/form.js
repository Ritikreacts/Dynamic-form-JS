export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId); //Container element from HTML in which you have to add form
    // Pass formContainerId to append form element inside of HTML DIV element
    // use formData to create form
    console.log('Form', formData);
  }
  // create methods/event to create form/ reset form/ submit form, etc
}
