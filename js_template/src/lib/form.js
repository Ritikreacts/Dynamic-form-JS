export default class Form{
 constructor(formContainerId, formData){
  this.container = document.getElementById(formContainerId);
  this.formData = formData;
  this.form = document.createElement('form');
  this.createForm()

 }
 createForm(){
  this.formData.foreach(field=>{
   //create input field
    this.form.appendChild(inputElement);

  })
 }
}
