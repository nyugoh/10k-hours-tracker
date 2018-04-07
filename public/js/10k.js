/*
* Main javascript file
 */
$(document).ready(() =>{
  $('#addSkillModal').modal('attach events', '#addSkill');

  $('#basic.progress').progress({
    label   : false,
    value   : Math.floor(Math.random() * 5) + 1,
    text    : {
      active  : '{percent}% Complete',
      success : 'Done!'
    }
  });

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

function populateSkills(skills) {
  let table = $('#skillsTable');
  if (skills.length > 0){
    skills.map((skill) =>{
      console.log(skill);
      let subject = skill.subject.toUpperCase();
      let lastActivity = new Date(skill.updatedAt);
      table.append('<tr id="'+skill._id+'">\n' +
        '            <td>'+subject+'</td>\n' +
        '            <td>'+lastActivity+'</td>\n' +
        '            <td>\n' +
        '              <div class="ui basic progress success" data-percent="52">\n' +
        '                <div class="bar" style="transition-duration: 300ms; width: 52%;">\n' +
        '                  <div class="progress"></div>\n' +
        '                </div>\n' +
        '                <div class="label">52% Complete</div>\n' +
        '              </div>\n' +
        '            </td>\n' +
        '            <td>'+skill.hours+' hours</td>\n' +
        '            <td>\n' +
        '              <ul class="ui list" style="list-style: none;">\n' +
        '                <li class="item">\n' +
        '                  <i class="icon checkmark"></i> Login with passport\n' +
        '                </li>\n' +
        '                <li class="item">\n' +
        '                  <i class="icon checkmark"></i> Login with OAth\n' +
        '                </li>\n' +
        '              </ul>\n' +
        '            </td>\n' +
        '            <td class="text center">\n' +
        '              <i class="icon trash red"></i>\n' +
        '              <div class="ui hidden divider"></div>\n' +
        '              <i class="icon pencil blue"></i>\n' +
        '              <div class="ui hidden divider"></div>\n' +
        '              <div class="field">\n' +
        '                <div class="ui slider checkbox">\n' +
        '                  <input name="top-posts" type="checkbox" tabindex="0" class="hidden">\n' +
        '                  <label>Complete</label>\n' +
        '                </div>\n' +
        '              </div>\n' +
        '            </td>\n' +
        '          </tr>')
    });
  } else {
    table.html("<h3>No Skills yet</h3>");
  }
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
