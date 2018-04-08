/*
* Main javascript file
 */

// GLOBAL VARIABLES
var paused = false;
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

  showTimer();

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
      table.append('<tr id="'+skill._id+'" style="color:'+skill.theme+';">\n' +
        '            <td class="center aligned"><a href="/skills/'+subject.toLowerCase()+'" style="color:'+skill.theme+';">'+subject+'</a></td>\n' +
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

function showTimer() {
  let hour = $('#hours');
  let minute = $('#minutes');
  let second = $('#seconds');
  let date, hours, minutes, seconds;
  setInterval(() =>{
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    if(hours < 10)
      hours = '0' +hours;
    if(minutes < 10)
      minutes = '0' + minutes;
    if(seconds < 10)
      seconds = '0' + seconds;
    hour.text(hours);
    minute.text(minutes);
    second.text(seconds);
  }, 100);
}

function startTimer() {
  buttonsControl(true, false, false, false);
  let hour = $('#hoursDown');
  let minute = $('#minutesDown');
  let second = $('#secondsDown');
  let date, hours=0, minutes=0, seconds=0;
  setInterval(() =>{
    date = new Date();
    seconds ++;
    if(seconds>59){
      minutes = Math.floor(seconds/60);
    }
    if(minutes>59){
      hours = Math.floor(minutes/60);
    }
    if(hours < 10)
      hours = parseInt(hours)===0? '00': '0'+hours;
    if(minutes < 10)
      minutes = parseInt(minutes)===0? '00': '0'+minutes;
    hour.text(hours);
    minute.text(minutes);
    let showSeconds = '0'+Math.floor(seconds%60);
    console.log(showSeconds.substr(-2))
    second.text(showSeconds.substr(-2));
  }, 1000);
}

function pauseTimer() {
  paused = !paused;
  buttonsControl(false, true, false, false);
}

function resetTimer() {
  buttonsControl(false, false, true, false);
}

function stopTimer() {
  buttonsControl(false, false, false, true);
}

function buttonsControl(start, pause, reset, stop) {
  let startBtn = $('#startButton');
  let pauseBtn = $('#pauseButton');
  let resetBtn = $('#resetButton');
  let stopBtn = $('#stopButton');
  if(start){ // disable start enable others
    startBtn.attr('disabled', '');
    pauseBtn.removeAttr('disabled');
    resetBtn.removeAttr('disabled');
    stopBtn.removeAttr('disabled');
  }

  if(pause){ // disable start and stop enable reset
    if(paused){
      startBtn.attr('disabled', '');
      pauseBtn.html('<i class="icon play"></i> PLAY');
      resetBtn.removeAttr('disabled');
      stopBtn.attr('disabled', '');
    } else {
      startBtn.attr('disabled', '');
      pauseBtn.html('<i class="icon pause"></i> PAUSE');
      resetBtn.removeAttr('disabled');
      stopBtn.removeAttr('disabled');
    }
  }

  if(reset) { // disable all except start
    startBtn.removeAttr('disabled');
    pauseBtn.attr('disabled', '');
    resetBtn.attr('disabled', '');
    stopBtn.attr('disabled', '');
  }

  if(stop) { // disable all except start
    startBtn.removeAttr('disabled');
    pauseBtn.attr('disabled', '');
    resetBtn.attr('disabled', '');
    stopBtn.attr('disabled', '');
  }
}
