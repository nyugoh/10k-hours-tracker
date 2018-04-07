/*
* Main javascript file
 */
$(document).ready(() =>{
  $('#addSkillModal').modal('attach events', '#addSkill');

  $('.ui.dropdown').dropdown();
});
// Functions
const addSkill = () =>{
  // $("#addSkillModal").modal('show');
  $('#addSkillModal').modal();
  console.log("adding skill")
};


// FORMS
$('#addSkillForm').on('submit', e =>{
  e.preventDefault();

});
