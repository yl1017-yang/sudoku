
document.addEventListener('DOMContentLoaded', function() {
    
    // event 세팅
    setEvent();

    // 데이타 초기화
    initData();

    // 뷰 세팅
    setView();

});

function setEvent() {

  let lastFocused;
  const inputs = document.querySelectorAll('.cell input');

  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      
      const row = this.getAttribute('data-row');
      const col = this.getAttribute('data-col');

      document.querySelectorAll('.cell input').forEach(input => {
          input.classList.remove('highlight');
      });

      document.querySelectorAll(`.cell input[data-row="${row}"]`).forEach(input => {
          input.classList.add('highlight');
      });

      document.querySelectorAll(`.cell input[data-col="${col}"]`).forEach(input => {
          input.classList.add('highlight');
      });

      lastFocused = this;
    });
  });

  window.insertNumber = function(number) {
    if (lastFocused && !lastFocused.readOnly) {

        console.log("lastFocused=",lastFocused);

        var row = lastFocused.getAttribute('data-row');
        var col = lastFocused.getAttribute('data-col');

        lastFocused.value = number;

        if(isSameNumber(mainModel.total_array,row,col,number)) {
          lastFocused.style.color = "#00cb73";
          lastFocused.classList.add('answer');
          lastFocused.classList.remove('wrong-answer');
        } else {
          lastFocused.style.color = "#DF2935";
          lastFocused.classList.add('wrong-answer');
          lastFocused.classList.remove('answer');
        }
    }
  } 
}

function initData() {

  mainModel.init();
}

function setView() {

  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {

      document.querySelectorAll(`.cell input[data-row="${row}"]`) .forEach(input => {        
        var data_col = input.getAttribute('data-col');
        if(data_col == col ) {
          //console.log("input = ",input );
          var obj = mainModel.total_array[row][col];
          if(obj.isVisible) {            
            input.value = mainModel.total_array[row][col].value;
            input.setAttribute('readonly', true);
          } else {
            input.value = "";
            input.removeAttribute('readonly');
          }
        }
      });
    }
  }

  let div_progress = document.querySelector('#div_progress');
  let li_mistake   = document.querySelector('#li_mistake');
  let li_level     = document.querySelector('#li_level');
  let li_timer     = document.querySelector('#li_timer');

  var level_text = "초급";
  if(mainModel.level == 1)
    level_text = "초급";
  else if(mainModel.level == 2)
    level_text = "중급";
  else if(mainModel.level == 3)
    level_text = "고급";
  
  li_level.innerText = level_text;
  startTime = new Date().getTime();

  li_timer.innerText = "03:00";

  timerIntervalId = setInterval(function(){
    var curTime = new Date().getTime();
    var elapsedTimeSec = Math.floor((curTime - startTime)/1000);
    var remainTime = 180 - elapsedTimeSec;
    
    if(remainTime < 0)
      remainTime = 0;
    
    var remainMin = Math.floor(remainTime / 60);
    var remainSec = remainTime % 60;
    
    var remainMinText = remainMin < 10 ? "0" + remainMin : remainMin;
    var remainSecText = remainSec < 10 ? "0" + remainSec : remainSec;

    li_timer.innerText = remainMinText + ":" + remainSecText;

    if(remainTime == 0) {
      clearInterval(timerIntervalId);
    }

  },1000);
}

var startTime = 0;
var timerIntervalId;

function showModal() {
  let div = document.querySelector('.modal-wrap');
  div.style.display = 'initial';
}

function hideModal() {
  let div = document.querySelector('.modal-wrap');
  div.style.display = 'none';
}

