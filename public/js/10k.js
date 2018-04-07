/*
* Main javascript file
 */
$(document).ready(() =>{
  $('#addSkillModal').modal('attach events', '#addSkill');

  $('.ui.dropdown').dropdown();
});
// Functions
function reloadSkills() {
  $.ajax({
    method: 'get',
    url: '/skills/list',
    success: (data) =>{
      console.log(data)
    },
    error: (error) =>{
      console.log(error);
    }
  });
}


// FORMS
$('#addSkillForm').on('submit', e =>{
  e.preventDefault();
  const form = e.target;
  let skill = {};
  for(let i=0;i<Object.keys(form).length;i++){
    if(form[i] && form[i].name !== 'submit'){
      // TODO:: Added check for required fields
      skill[form[i].name] = form[i].value;
    }
  }
  // TODO :: Use axios
  $.ajax({
    method: 'post',
    url: '/skills/add',
    data: skill,
    success: (data, status, message) =>{
      if(data.status) {
        $("#addSkillForm").get(0).reset();
        $('#successMessage').html('<div class="ui hidden divider"></div>\n' +
          '  <div class="ui message info">\n' +
          '    <div class="header">Success... !!</div>\n' +
          '    <p>Skill added successfully.</p>\n' +
          '  </div>');
        reloadSkills();
      }
    },
    error: (error) => {
      $('#errorMessage').html('<div class="ui hidden divider"></div>\n' +
        '  <div class="ui message error">\n' +
        '    <div class="header">Error... !!</div>\n' +
        '    <p>error.</p>\n' +
        '  </div>');
    }
  })
});
