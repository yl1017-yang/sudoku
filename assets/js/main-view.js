
document.addEventListener('DOMContentLoaded', function() {
    
    // event 세팅
    setEvent();

    // 데이타 초기화
    initData();

    // 뷰 세팅
    setView();

});

function setEvent() {

  // 숫자판 포커스 이벤트
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

  // 숫자판 입력 이벤트
  window.insertNumber = function(number) {

    //clearExamDupColor();

    if (lastFocused && !lastFocused.readOnly) {

        console.log("lastFocused=",lastFocused);

        var row = lastFocused.getAttribute('data-row');
        var col = lastFocused.getAttribute('data-col');

        console.log("isExamMode = ",isExamMode);

        // 연습모드가 아니면
        if(!isExamMode) {

          lastFocused.value = number;

          lastFocused.parentElement.querySelectorAll('.small-number').forEach(numdiv => {
            numdiv.style.display = 'none';
          });

          // 정답을 맞추면
          if(isSameNumber(mainModel.total_array,row,col,number)) {
            lastFocused.style.color = "#00cb73";
            lastFocused.classList.add('answer');
            lastFocused.classList.remove('wrong-answer');

            setTimeout(function(){
               lastFocused.style.color = "#555";
               lastFocused.classList.remove('answer');
            },1000);

            mainModel.total_array[row][col].isHidden = false;
            lastFocused.setAttribute('readonly', true);

            // 히든된 숫자 카운트를 세팅한다.
            setHiddenNumberCount();

            // 진행도를 세팅한다.
            setProgress();

            // 모두 맞췄다면    
            var total_hidden = getHiddenCountInArray(mainModel.total_array,0,9,0,9);
            if(total_hidden == 0) {
              showModal("게임이 끝났어요!!!!\n다음 게임으로 진행하세요"
                      ,function(){window.location.reload()}
                      ,function(){hideModal()});
            }   

          } // 틀렷다면 
          else {
            lastFocused.style.color = "#DF2935";
            lastFocused.classList.add('wrong-answer');
            lastFocused.classList.remove('answer');

            // 실수 횟수를 세팅한다.
            mainModel.incorrect_count++;
            setMistake();

            if(mainModel.incorrect_count>= mainModel.incorrect_max_count) {
              showModal("실수를 너무 많이 했어요!!!!\n다시 하시겠어요?"
              ,function(){window.location.reload()}
              ,function(){hideModal()});
            }
          }
        // 연습모드이면  
        } else {

          // 중복된것이 잇는지 검사한다.
          // 가로 세로 박스 체크. col과 row가 헷갈릴수 잇다. 주의!! 실질적으로 col은 X, row는 y 이다.
          var _col = isContainRow(mainModel.total_array,row,number,true,true);
          var _row = isContainCol(mainModel.total_array,col,number,true,true);

          var box_arrange = mainModel.getBoxArrange(row,col);
          box_s_row = box_arrange.s_row;
          box_e_row = box_arrange.e_row;
          box_s_col = box_arrange.s_col;
          box_e_col = box_arrange.e_col;

          var _box = isContainBox(mainModel.total_array
                                  ,box_s_row
                                  ,box_e_row
                                  ,box_s_col
                                  ,box_e_col
                                  ,number
                                  ,true
                                  ,true);

          console.log("number = " + number);
          console.log("row = " + row + ",_col = " + _col);
          console.log("_row = " + _row + ",col = " + col);
          console.log("_box = ",_box);

          if(_row == -1 && _col == -1 && _box.row == -1) {
            lastFocused.value = "";

            var numdiv = lastFocused.parentElement.querySelector('.number' + number);
            console.log("numdiv = ",numdiv);
            numdiv.style.display = 'block';  
          } 
          // 중복된것이 있다면
          else {
            var color = "#0000ff";
            setNumberBoxColor(row,_col,color); 
            setNumberBoxColor(_row,col,color); 
            setNumberBoxColor(_box.row,_box.col,color); 

            setTimeout(function(){
              color = "#555";
              setNumberBoxColor(row,_col,color); 
              setNumberBoxColor(_row,col,color); 
              setNumberBoxColor(_box.row,_box.col,color);
           },1000);
          }

          // 연습모드 일때 포커스 유지 - 연습모드 아닐때 포커스 해제를 해줘요!!!!  (양작업)
          lastFocused.classList.add('focus');
      }
    }
  } 

  // 리로드 버튼 이벤트
  document.querySelector('#btn_reload').onclick = function(){
    window.location.reload();
  };

  // 지우기 버튼 이벤트
  document.querySelector('#btn_erase').onclick = function(){
     
    if (lastFocused && !lastFocused.readOnly) {
      lastFocused.value = "";
    }   
  };

}

function initData() {

  mainModel.init();
}

function setView() {

  // 숫자 박스 세팅
  setNumberBox();

  // 실수횟수를 세팅한다.
  setMistake();

  // 레벨을 세팅한다.
  setLevel();
  
  // 타이머를 세팅한다.
  setTimer();

  // 히든된 숫자 카운트를 세팅한다.
  setHiddenNumberCount();

  // 진행도를 세팅한다.
  setProgress();

  // 하단 남은 숫자 개수 보여주기
  setHiddenNumberCount();

}

function showModal(msg,ok_listner,cancel_listner) {
  let div = document.querySelector('.modal-wrap');
  div.classList.remove("hidden");

  document.querySelector('.modal-wrap .modal-text').innerText = msg;
  document.querySelector('.modal-wrap .btn-gray').onclick = ok_listner;
  document.querySelector('.modal-wrap .btn-point').onclick = cancel_listner;
}

function hideModal() {
  let div = document.querySelector('.modal-wrap');
  div.classList.add("hidden");
}

// 숫자 박스를 세팅한다.
function setNumberBox() {
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {

      document.querySelectorAll(`.cell input[data-row="${row}"]`).forEach(input => {
        var data_col = input.getAttribute('data-col');
        if(data_col == col ) {
          //console.log("input = ",input );
          var obj = mainModel.total_array[row][col];
          if(!obj.isHidden) {
            input.value = mainModel.total_array[row][col].value;
            input.setAttribute('readonly', true);
          } else {
            input.value = "";
            input.removeAttribute('readonly');
          }

          initExamNumbers(input.parentElement); // 연습숫자 추가 (양 추가)
        }
      });
    }
  }
}

//연습 숫자 9개 초기화 (양 추가)
function initExamNumbers(cell) {
  const smallNumber = cell.querySelectorAll('.small-number');
  if (smallNumber.length === 0) {
    for (let i = 1; i <= 9; i++) {
      const numberDiv = document.createElement("div");
      numberDiv.textContent = i;
      numberDiv.classList.add("small-number", `number${i}`);
      numberDiv.style.display = 'none';
      cell.appendChild(numberDiv);
    }
  }
}

function setHiddenNumberCount() {

   for (var i = 1; i <= 9; i++) {
      document.querySelector('#sp_remain_num_' + i).innerText = getHiddenNumberCountInArray(mainModel.total_array,0,9,0,9,i);
   }
}

function setProgress() {

  var total_hidden = getHiddenCountInArray(mainModel.total_array,0,9,0,9);
  //console.log("total_hidden=",total_hidden);
  document.querySelector('#div_progress').innerText 
      = "진행도 " + (100 - Math.floor(total_hidden/mainModel.init_hidden_count*100)) + "%";
}

var startTime = 0;
var timerIntervalId;

function setTimer() {

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

    let li_timer     = document.querySelector('#li_timer');
    li_timer.innerText = remainMinText + ":" + remainSecText;

    if(remainTime == 0) {
      clearInterval(timerIntervalId);
    }

  },1000);
}

function setLevel() {
  let li_level = document.querySelector('#li_level');

  var level_text = "쉬워요";
  if(mainModel.level == 1)
    level_text = "쉬워요";
  else if(mainModel.level == 2)
    level_text = "할만해요";
  else if(mainModel.level == 3)
    level_text = "어려워요";
  
  li_level.style.color = "#DF2935"; // 수정 by 알밤 최고남
  li_level.innerText = level_text;
}

function setMistake() {
  let li_mistake = document.querySelector('#li_mistake');
  li_mistake.innerText =  "실수ㆍ" + mainModel.incorrect_count + "/" + mainModel.incorrect_max_count;
}

var isExamMode = false;

function examMode() {

   if(!isExamMode) {
     isExamMode = true;
     document.querySelector('#btn_exammode').style.color = "#DF2935";
    //  document.querySelector('#btn_exammode').classList.add("on");
   } else {
     isExamMode = false;
     document.querySelector('#btn_exammode').style.color = "#555";
    // document.querySelector('#btn_exammode').classList.remove("on");
   }
}

/*
function clearExamDupColor() {

  document.querySelectorAll(`.cell input`).forEach(input => {

    console.log("input.style.color",input.style.color);
    if(input.style.color == "rgb(0, 0, 255)")
      input.style.color = "#555";
  });
}*/

function setNumberBoxColor(row,col,color) {

  document.querySelectorAll(`.cell input[data-row="${row}"]`).forEach(input => {
    var data_col = input.getAttribute('data-col');
    if(data_col == col ) {
      input.style.color = color;
    }
  });
}


