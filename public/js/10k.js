/*
* Main javascript file
 */
$(document).ready(() =>{
  $('#addSkillModal').modal('attach events', '#addSkillButton');

  $('#basic.progress').progress({
    label   : false,
    value   : Math.floor(Math.random() * 5) + 1,
    text    : {
      active  : '{percent}% Complete',
      success : 'Done!'
    }
  });

  $('.ui.dropdown').dropdown();

  $('#addSkillForm').on('submit', e => addSkill(e));

});
// Functions
function reloadSkills() {
  $.ajax({
    method: 'get',
    url: '/skills/list',
    success: (data) =>{
      $('#skillsTable').text('');
      populateSkills(data.skills);
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
      let subject = skill.subject.toUpperCase();
      let lastActivity = new Date(skill.updatedAt);
      let milestones;
      if (skill.milestones) {
        milestones = '';
      } else {
        milestones = 'NONE';
      }
      table.append('<tr id="'+skill._id+'" style="color:'+skill.theme+'">\n' +
        '            <td class="center aligned">'+subject+'</td>\n' +
        '            <td class="center aligned">'+lastActivity.toLocaleDateString() + ' '+ lastActivity.toLocaleTimeString() +'</td>\n' +
        '            <td class="center aligned">\n' +
        '              <div class="ui basic progress success" data-percent="52">\n' +
        '                <div class="bar" style="transition-duration: 300ms; width: 52%;">\n' +
        '                  <div class="progress"></div>\n' +
        '                </div>\n' +
        '                <div class="label">52% Complete</div>\n' +
        '              </div>\n' +
        '            </td>\n' +
        '            <td class="center aligned">'+skill.hours+' hours</td>\n' +
        '            <td class="center aligned">\n' +
        '              <ul class="ui list" style="list-style: none;">\n' +
                        milestones+
        '              </ul>\n' +
        '            </td>\n' +
        '            <td class="center aligned">\n' +
        '              <i onclick="removeSkill(\''+skill._id+'\');" class="icon trash red"></i>\n' +
        '              <div class="ui hidden divider"></div>\n' +
        '              <i class="icon pencil blue"></i>\n' +
        '              <div class="ui hidden divider"></div>\n' +

        '            </td>\n' +
        '          </tr>')
    });
  } else {
    table.html("<tr><td colspan='6' class='padded centered info'><h3>No Skills yet</h3></td></tr>");
  }
}

function addSkill(e) {
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
    success: (data) =>{
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
        '    <p>'+error+'</p>\n' +
        '  </div>');
    }
  })
}

function removeSkill(id) {
  $.ajax({
    method: 'post',
    url: '/skills/remove',
    data: {id: id},
    success: () =>{
      reloadSkills();
    },
    error: (error) =>{
      // TODO :: Show success message and error
      console.log(error);
    }
  });
}
