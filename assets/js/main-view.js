
document.addEventListener('DOMContentLoaded', function() {
    
    // event 세팅
    setEvent();

    // 데이타 초기화
    initData();

    // 뷰 세팅
    setView();
	
	  // 애니메이션
	  startAnimation();
});

var lastFocused;

function setEvent() {

  // 숫자판 포커스 이벤트
  //let lastFocused;
  const divs = document.querySelectorAll('.cell_text');

  divs.forEach(div => {
    div.addEventListener('click', function() {

      setNumberInputFocusEvent(this);

    });
  });

  // 숫자판 입력 이벤트
  window.insertNumber = function(number) {
	  
	  const lastFocused_input  = lastFocused;

    console.log("lastFocused_input=",lastFocused_input);

    //if (lastFocused_input && !lastFocused_input.readOnly) {
    if (lastFocused_input && !lastFocused_input.classList.contains('readonly')) {
        

        var row = lastFocused_input.getAttribute('data-row');
        var col = lastFocused_input.getAttribute('data-col');

        // 연습모드가 아니면
        if(!isExamMode) {

          lastFocused_input.innerText = number;

          lastFocused_input.parentElement.querySelectorAll('.small-number').forEach(numdiv => {
            numdiv.style.display = 'none';
          });

          // 정답을 맞추면
          if(isSameNumber(mainModel.total_array,row,col,number)) {

            lastFocused_input.classList.remove('wrong-answer');

            mainModel.total_array[row][col].isHidden = false;
            lastFocused_input.classList.add('readonly');
			
            var elements = new Array();

            // 애니메이션을 준다.
            animateGrid_Correct(row,col);

            // 모든 하이라이트와 포커스를 지운다.
            reomveAllHighlight();

            // 같은 숫자를 하이라이트
            setHighlightSameNumber(number);

            // 히든된 숫자 카운트를 세팅한다.
            setHiddenNumberCount();

            // 진행도를 세팅한다.
            setProgress();

            // 모두 맞췄다면    
            var total_hidden = getHiddenCountInArray(mainModel.total_array,0,8,0,8);
            if(total_hidden == 0) {
				
              // 애니메이션을 시작한다. 	
              sparkAnimation();	
              
              // 기록을 저장한다.
              if(typeof NativeJSinterface != 'undefined') {
                
                var elaspedTimeText = getElaspedTimeText();	
                console.log("elaspedTimeText=",elaspedTimeText);

                // 난이도 레벨
                NativeJSinterface.saveRecord(mainModel.mode_type,mainModel.level,elaspedTimeText);				
              }
              
              if(mainModel.mode_type == 1) {
                showModal("완벽해요!!!!\n다시 하시겠어요?"
                          ,function(){window.location.reload();}
                          ,function(){location.href = "../game/index.html";}
                );
              } else if(mainModel.mode_type == 2) {
                // 10 레벨까지~
                if(mainModel.level < 10) {
                  setTimeout(function(){
                    var level = mainModel.level + 1;
                    location.href = "../game/main.html?mode_type=2&level=" + level;
                  },2000);
                } else {
                  showModal("최고에요!!!!\n후속 컨텐츠가 업데이트될 예정입니다."
                          ,function(){location.href = "../game/index.html";}
                          ,null); 
                }
              }
            }   
          } // 틀렷다면 
          else {

            if(typeof NativeJSinterface != 'undefined')
              NativeJSinterface.vibrate();

            lastFocused_input.classList.add('wrong-answer');
            lastFocused_input.classList.remove('answer');
            lastFocused_input.classList.add('focus_wrong_answer');

            lastFocused_input.classList.remove('focus');

            setHighlightSameNumber(number);
			
            const row = lastFocused_input.getAttribute('data-row');
            const col = lastFocused_input.getAttribute('data-col');

            animateGrid_Incorrect(row,col);
            
            console.log("row = ",row);
            console.log("col = ",col);

            // 실수 횟수를 세팅한다.
            mainModel.incorrect_count++;
            setMistake();

            if(mainModel.incorrect_count>= mainModel.incorrect_max_count) {
              showModal("실수를 너무 많이 했어요!!!!\n다시 하시겠어요?"
                      ,function(){window.location.reload();}
					            ,function(){location.href = "../game/index.html";}
					    );
            }
          }
        // 연습모드이면  
        } else {

          // 연습모드 일때 포커스 유지 - 연습모드 아닐때 포커스 해제를 해줘요!!!!  (양작업)
          lastFocused_input.classList.add('focus');
          lastFocused_input.innerText = "";

          var numdiv = lastFocused_input.parentElement.querySelector('.number' + number);
          numdiv.style.display = 'block';  
      }
    }
  }

  // 뒤로 가기 버튼 이벤트
  document.querySelector('#btn_back').onclick = function(){
    if (mainModel.mode_type == "2") {
      showModal("도전모드를 포기하시겠습니까?"
                            ,function(){location.href="../game/index.html";}
                            ,function(){hideModal();}); 
    } else {
      location.href="../game/index.html";
    }
  };

  // 설정 버튼 이벤트
  document.querySelector('#btn_setting').onclick = function(){
	  if(typeof NativeJSinterface != 'undefined') 
		NativeJSinterface.goSetting(); 
  };

  // 리로드 버튼 이벤트
  document.querySelector('#btn_reload').onclick = function(){

    if(mainModel.mode_type == "2") {
      showModal("도전모드에서는 재시작할 수 없어요!"
                          ,function(){hideModal();}
                          ,null); 
    } else
      window.location.reload();
  };

  // 지우기 버튼 이벤트
  document.querySelector('#btn_erase').onclick = function(){

    document.querySelector('#btn_erase').blur();
    if (lastFocused && !lastFocused.classList.contains('readonly')) {
      
      lastFocused.parentElement.querySelectorAll('.small-number').forEach(numdiv => {
        numdiv.style.display = 'none';
      });

      lastFocused.classList.remove('wrong-answer');
      lastFocused.innerText = "";
      lastFocused.classList.add('highlight');
    }   
  };
}

function setNumberInputFocusEvent(numinput) {

  const _numinput = numinput;

  console.log("_numinput = ",_numinput);

  const row = _numinput.getAttribute('data-row');
  const col = _numinput.getAttribute('data-col');

  console.log("row = ",row);
  console.log("col = ",col);

  // 모든 하이라이트와 포커스를 지운다.
  reomveAllHighlight();

  console.log("_numinput.innerText = ",_numinput.innerText);

  // 하이라이트를 추가한다.
  setHighlightRowColBox(row,col);

  if(_numinput.innerText != "") {
    setHighlightSameNumber(_numinput.innerText);
  } else {
    numinput.classList.add('focus');
  }

  if(_numinput.classList.contains('wrong-answer')){
    _numinput.classList.add('focus_wrong_answer');     
  }

  lastFocused = _numinput;
}

function initData() {

  mainModel.init();

}

function setView() {

  // 숫자 박스 세팅
  setNumberBox();

  // 실수횟수를 세팅한다.
  setMistake();

  // 게임모드를 세팅한다.
  setModeType();
  
  // 타이머를 세팅한다.
  setTimer();

  // 히든된 숫자 카운트를 세팅한다.
  setHiddenNumberCount();

  // 진행도를 세팅한다.
  setProgress();

  // 하단 남은 숫자 개수 보여주기
  setHiddenNumberCount();

  // 배경 세팅
  setBackground();
}

function setHighlightRowColBox(row,col){
  document.querySelectorAll(`.cell_text[data-row="${row}"]`).forEach(input => {
      input.classList.add('highlight');
  });

  document.querySelectorAll(`.cell_text[data-col="${col}"]`).forEach(input => {
      input.classList.add('highlight');
  });

  var box_arrange = mainModel.get3x3BoxArrange(row,col);
  for (var r = box_arrange.s_row;r<=box_arrange.e_row;r++){
    for(var c = box_arrange.s_col;c<=box_arrange.e_col;c++){
      document.querySelector(`.cell_text[data-row="${r}"].cell_text[data-col="${c}"]`).classList.add('highlight');
    }
  }

}

function setHighlightSameNumber(number){
    document.querySelectorAll(`.cell_text`).forEach(input => {
      // 같은 숫자라면
      if(input.innerText == number) {
        // 오답이 아니면
        if(!input.classList.contains('wrong-answer')){
          input.classList.add('highlight');
          input.classList.add('focus');
        }
      }
    });
}

function reomveAllHighlight(){
  document.querySelectorAll('.cell_text').forEach(input => {
    input.classList.remove('highlight');
    input.classList.remove('focus');
    input.classList.remove('focus_wrong_answer');
  });
}

function startAnimation(){
  if(mainModel.mode_type == "1")
    goAnimation();
  else
    stageAnimation();
}

function goAnimation() {
	
	var ml4 = {};
	ml4.opacityIn = [0,1];
	ml4.scaleIn = [0.2, 1];
	ml4.scaleOut = 3;
	ml4.durationIn = 800;
	ml4.durationOut = 600;
	ml4.delay = 500;
	
	let div = document.querySelector('.ml4');
	div.style.display = "block";

  let span = document.querySelector('.letters-3');

	span.innerText = "Go!";
  div.style.fontSize = "4.5em";

	anime.timeline()
	  .add({
		targets: '.ml4 .letters-3',
		opacity: ml4.opacityIn,
		scale: ml4.scaleIn,
		duration: ml4.durationIn
	  }).add({
		targets: '.ml4 .letters-3',
		opacity: 0,
		scale: ml4.scaleOut,
		duration: ml4.durationOut,
		easing: "easeInExpo",
		delay: ml4.delay
	  });
	  
	setTimeout(function(){
	  let div = document.querySelector('.ml4');
	  div.style.display = "none";
	},1000);
}

function stageAnimation() {
	
	let div = document.querySelector('.ml4');
	div.style.display = "block";

  let span = document.querySelector('.letters-3');

  span.innerText = "Stage " + mainModel.level + "!";
  div.style.fontSize = "3.5em";

  anime.timeline({loop: true})
  .add({
    targets: '.ml4 .letters-3',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.ml2',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

	setTimeout(function(){
	  let div = document.querySelector('.ml4');
	  div.style.display = "none";
	},1000);
}

function stepAnimation(updateProgress) {
	
	var ml4 = {};
	ml4.opacityIn = [0,1];
	ml4.scaleIn = [0.2, 1];
	ml4.scaleOut = 3;
	ml4.durationIn = 800;
	ml4.durationOut = 600;
	ml4.delay = 500;
	
	let div = document.querySelector('.ml4');
	div.style.display = "block";

  let span = document.querySelector('.letters-3');
	span.innerText =  updateProgress + "%";;
  div.style.fontSize = "4.5em";

	anime.timeline()
	  .add({
		targets: '.ml4 .letters-3',
		opacity: ml4.opacityIn,
		scale: ml4.scaleIn,
		duration: ml4.durationIn
	  }).add({
		targets: '.ml4 .letters-3',
		opacity: 0,
		scale: ml4.scaleOut,
		duration: ml4.durationOut,
		easing: "easeInExpo",
		delay: ml4.delay
	  });
	  
	  setTimeout(function(){
		  let div = document.querySelector('.ml4');
		  div.style.display = "none";
	   },1000);
}

function showModal(msg,ok_listner,cancel_listner) {
  let div = document.querySelector('.modal-wrap');
  div.classList.remove("hidden");

  document.querySelector('.modal-wrap .modal-text').innerText = msg;
  
  document.querySelector('.modal-wrap .btn-point').onclick = ok_listner;
  
  if(cancel_listner == null)
	  document.querySelector('.modal-wrap .btn-gray').style.display = "none"; 
  else {
	  document.querySelector('.modal-wrap .btn-gray').style.display = "block"; 
	  document.querySelector('.modal-wrap .btn-gray').onclick = cancel_listner;
  }
}

function hideModal() {
  let div = document.querySelector('.modal-wrap');
  div.classList.add("hidden");
}

// 숫자 박스를 세팅한다.
function setNumberBox() {
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {

      document.querySelectorAll(`.cell_text[data-row="${row}"]`).forEach(input => {
        var data_col = input.getAttribute('data-col');
        if(data_col == col ) {
          //console.log("input = ",input );
          var obj = mainModel.total_array[row][col];
          if(!obj.isHidden) {
            input.innerText = mainModel.total_array[row][col].value;
            //input.setAttribute('readonly', true);
            input.classList.add('readonly')
          } else {
            input.innerText = "";
            input.classList.remove('readonly')
            //input.removeAttribute('readonly');
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

      // 연습모드에서 포커스를 가질수 있게 추가.
      numberDiv.addEventListener('click', function() {
      
        var numinput = numberDiv.parentElement.querySelector('.cell_text');

        setNumberInputFocusEvent(numinput);
        
      });
    }
  }
}

function setHiddenNumberCount() {

   for (var i = 1; i <= 9; i++) {
      var hiddenNumber = getHiddenNumberCountInArray(mainModel.total_array,0,9,0,9,i);
      document.querySelector('#sp_remain_num_' + i).innerText = hiddenNumber;
      if(hiddenNumber == 0) {
        document.querySelector('#btn-number_' + i).style.visibility = "hidden";
      }
   }
}

function setBackground() {
  if(mainModel.mode_type == 2) {

    if(mainModel.level >= 1 && mainModel.level <= 3)
      document.querySelector('.sudoku-wrap').classList.add('bg-sudoku-01');
    else if(mainModel.level >= 4 && mainModel.level <= 6)
      document.querySelector('.sudoku-wrap').classList.add('bg-sudoku-02');
    else if(mainModel.level >= 7 && mainModel.level <= 9)
      document.querySelector('.sudoku-wrap').classList.add('bg-sudoku-03');
    else if(mainModel.level >= 10)
      document.querySelector('.sudoku-wrap').classList.add('bg-sudoku-04');
  }
}

function setProgress() {
	var curProgress = document.querySelector('#div_progress').innerText.replace("진행도 ","").replace("%","");
	var nCurProgress = parseInt(curProgress,10);
	
	setTimeout(function(){
					  progressUpdate(nCurProgress);
			       },1000);
}

var isView35per = false;
var isView70per = false;

function progressUpdate(nCurProgress) {
	var total_hidden = getHiddenCountInArray(mainModel.total_array,0,8,0,8);
	var updateProgress = 100 - Math.floor(total_hidden/mainModel.init_hidden_count*100);

    document.querySelector('#div_progress').innerText = "진행도 " + nCurProgress + "%";
	
	if(nCurProgress < updateProgress) {	 
		setTimeout(function(){
					  nCurProgress++;
					  progressUpdate(nCurProgress);
			       },50);	
	} else {
		if(updateProgress > 35 && !isView35per){
			isView35per = true;
			stepAnimation(updateProgress);
		}
		else if(updateProgress > 70 && !isView70per){
			isView70per = true;
			stepAnimation(updateProgress);
		}
	}
}

var startTime = 0;
var timerIntervalId;

function setTimer() {

  startTime = new Date().getTime();
  
  var limitMinMax = mainModel.time_limit_max / 60;
  var limitSecMax = mainModel.time_limit_max % 60;
  
  var limitMinMaxText = limitMinMax < 10 ? "0" + limitMinMax : limitMinMax;
  var limitSecMaxText = limitSecMax < 10 ? "0" + limitSecMax : limitSecMax;
  
  let li_timer = document.querySelector('#li_timer');
  li_timer.innerText = limitMinMaxText + ":" + limitSecMaxText;

  timerIntervalId = setInterval(function(){
	  
    var curTime = new Date().getTime();
    var elapsedTimeSec = Math.floor((curTime - startTime)/1000);
    var remainTime = mainModel.time_limit_max - elapsedTimeSec;
    
    if(remainTime < 0)
      remainTime = 0;
    
    var remainMin = Math.floor(remainTime / 60);
    var remainSec = remainTime % 60;
    
    var remainMinText = remainMin < 10 ? "0" + remainMin : remainMin;
    var remainSecText = remainSec < 10 ? "0" + remainSec : remainSec;

    let li_timer = document.querySelector('#li_timer');
    li_timer.innerText = remainMinText + ":" + remainSecText;

    if(remainTime == 0) {
      clearInterval(timerIntervalId);
      if(mainModel.mode_type != 2) {
	      showModal("시간이 다 됬어요!!!!\n다시 하시겠어요?"
				  ,function(){window.location.reload();}
				  ,function(){location.href = "../game/index.html";}
				  );
      } else {
        showModal("시간이 다 됬어요!!!!"
        ,function(){location.href = "../game/index.html";}
        ,null
        ); 
      }
    }

  },1000);
}

function setModeType() {
  let li_level = document.querySelector('#li_level');
  var level_text = "";

  if(mainModel.mode_type == 1) {
    level_text = "레벨 "+  mainModel.level;
  } else if (mainModel.mode_type == 2) {
    level_text = "stage " +  mainModel.level;
    document.querySelector('.score-wrap').classList.add('level-mode');
  } 

  li_level.style.color = "#DF2935"; 
  li_level.innerText = level_text;
}

function setMistake() {
  let li_mistake = document.querySelector('#li_mistake');
  li_mistake.innerText =  "실수 " + mainModel.incorrect_count + "/" + mainModel.incorrect_max_count;
}

var isExamMode = false;

// 연습모드 세팅
function examMode() {

   if(!isExamMode) {
     isExamMode = true;
     document.querySelector('#btn_exammode').style.color = "#DF2935";
     document.querySelector('#btn_exammode').classList.add('focus');
   } else {
     isExamMode = false;
     document.querySelector('#btn_exammode').style.color = "#555";
     document.querySelector('#btn_exammode').blur();
     document.querySelector('#btn_exammode').classList.remove('focus');
   }
}

function setNumberBoxColor(row,col,color) {

  document.querySelectorAll(`.cell_text[data-row="${row}"]`).forEach(input => {
    var data_col = input.getAttribute('data-col');
    if(data_col == col ) {
      input.style.color = color;
    }
  });
}

function getElaspedTimeText(){
	
	let li_timer = document.querySelector('#li_timer');
	var remaintimeString = li_timer.innerText;
	
	var remainMin = remaintimeString.substring(0,2);
    var remainSec = remaintimeString.substring(3,5);
	
	var remaintime = parseInt(remainMin, 10)*60 + parseInt(remainSec, 10);
    
	var elapsedTime = mainModel.time_limit_max - remaintime;
	
	var elapsedMin = Math.floor(elapsedTime / 60);
	var elapsedSec = elapsedTime%60;

    var elapsedMinText = elapsedMin < 10 ? "0" + elapsedMin : elapsedMin;
    var elapsedSecText = elapsedSec < 10 ? "0" + elapsedSec : elapsedSec;
	
	console.log("elapsedMinText=",elapsedMinText);
	console.log("elapsedSecText=",elapsedSecText);
	
	return elapsedMinText + ":" + elapsedSecText;
}


let particles = [];
const colors = ["#eb6383","#fa9191","#ffe9c5","#b4f2e1"];

function sparkAnimation(){
	
	pop();	
	setTimeout(render,100);

}

function pop () {
  for (let i = 0; i < 150; i++) {
    const p = document.createElement('particule');
    p.x = window.innerWidth * 0.5;
    p.y = window.innerHeight + (Math.random() * window.innerHeight * 0.3);
    p.vel = {
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * -20 - 15
    };
    p.mass = Math.random() * 0.2 + 0.8;
    particles.push(p);
    p.style.transform = `translate(${p.x}px, ${p.y}px)`;
    const size = Math.random() * 15 + 5;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(p);
  }
}

function render () {
  for (let i = particles.length - 1; i--; i > -1) {
    const p = particles[i];
    p.style.transform = `translate3d(${p.x}px, ${p.y}px, 1px)`;
    
    p.x += p.vel.x;
    p.y += p.vel.y;
    
    p.vel.y += (0.5 * p.mass);
    if (p.y > (window.innerHeight * 2)) {
      p.remove();
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(render);
}

function animateGrid_Correct(row,col) {

  var anime_duration = 300;

  var box_arrange_3x3 = mainModel.get3x3BoxArrange(row,col);
  console.log("box_arrange_3x3 = ",box_arrange_3x3);
  var box_arrange_hor = mainModel.getHorizontalBoxArrange(row);
  console.log("box_arrange_hor = ",box_arrange_hor);
  var box_arrange_ver = mainModel.getVerticalBoxArrange(col);
  console.log("box_arrange_ver = ",box_arrange_ver);      

  console.log("mainModel.total_array = ",mainModel.total_array);   
  
  var total_hidden_3x3 = getHiddenCountInArray(mainModel.total_array
                                              ,box_arrange_3x3.s_row
                                              ,box_arrange_3x3.e_row
                                              ,box_arrange_3x3.s_col
                                              ,box_arrange_3x3.e_col);                                                                                                    
  var total_hidden_hor = getHiddenCountInArray(mainModel.total_array
                                              ,box_arrange_hor.s_row
                                              ,box_arrange_hor.e_row
                                              ,box_arrange_hor.s_col
                                              ,box_arrange_hor.e_col);
  var total_hidden_ver = getHiddenCountInArray(mainModel.total_array
                                              ,box_arrange_ver.s_row
                                              ,box_arrange_ver.e_row
                                              ,box_arrange_ver.s_col
                                              ,box_arrange_ver.e_col);                                            

  console.log("total_hidden_3x3 = ",total_hidden_3x3);
  console.log("total_hidden_hor = ",total_hidden_hor);
  console.log("total_hidden_ver = ",total_hidden_ver);

  var box_arrange;                                                                                        
  if(total_hidden_3x3 == 0) {
    box_arrange = box_arrange_3x3;
    fn_animateGrid_Correct(box_arrange,row,col,anime_duration);
  } 
  
  if (total_hidden_hor == 0) {
    box_arrange = box_arrange_hor;
    anime_duration = 100;
    fn_animateGrid_Correct(box_arrange,row,col,anime_duration);
  } 
  
  if (total_hidden_ver == 0) {
    box_arrange = box_arrange_ver;
    anime_duration = 100;
    fn_animateGrid_Correct(box_arrange,row,col,anime_duration);
  } 

  //if(box_arrange == null) {
  //  return;
  //}

  console.log("box_arrange = ",box_arrange);

  //fn_animateGrid_Correct(box_arrange,row,col,anime_duration);
}

function fn_animateGrid_Correct(box_arrange,row,col,anime_duration){
  var box_s_row = box_arrange.s_row;
  var box_e_row = box_arrange.e_row;
  var box_s_col = box_arrange.s_col;
  var box_e_col = box_arrange.e_col;

  var squares = [];

  for (var r = box_s_row;r<=box_e_row;r++){
    for(var c = box_s_col;c<=box_e_col;c++){
      squares.push(document.querySelector(`.cell_text[data-row="${r}"].cell_text[data-col="${c}"]`));
    }
  }

  const rows = (box_e_row - box_s_row) + 1; // 그리드 행 개수
  const cols = (box_e_col - box_s_col) + 1; // 그리드 열 개수
  const startX = col - box_s_col;
  const startY = row - box_s_row;

  console.log("rows = ",rows);
  console.log("cols = ",cols);

  console.log("startX = ",startX);
  console.log("startY = ",startY);

  anime({
      targets: squares,
      /*
      scale: [
        { value: [0, 1], duration: 300 },
        { value: 1, duration: 300 }
      ],*/
      /*
      boxShadow: [
        { value: '0 0 1rem 0 currentColor', duration: 300 },
        //{ value: '0 0 0rem 0 currentColor', duration: 300 }
      ],*/
      
      backgroundColor: [
        { value: '#222222', duration: anime_duration }, // 검정색으로 변경
        { value: '#f2f1e4', duration: anime_duration }, // 초록색으로 변경
      ],
      easing: 'easeInOutQuad',
      delay: (el, i) => {
        const x = i % cols;          // 열 좌표
        const y = Math.floor(i / cols); // 행 좌표
        // 외곽부터 중앙까지의 거리 계산
        const distX = Math.abs(x - startX);
        const distY = Math.abs(y - startY);
        const distance = distX + distY; // 맨해튼 거리
        console.log("distance = ",distance);
        return distance * 100;          // 거리 * 딜레이 값
      },
      complete: function(anim) {
        
        requestAnimationFrame(() => {
        squares.forEach(input => {
          input.style.transition = 'none'; // 트랜지션 제거
          input.style.removeProperty('color');
          input.style.removeProperty('background');
        });
      })
      }
	  });
}

function animateGrid_Incorrect(row,col) {

  var square = document.querySelector(`.cell_text[data-row="${row}"].cell_text[data-col="${col}"]`);

  anime({
    targets: square,
    translateX: [
      { value: -20, duration: 20 },
      { value: 20, duration: 20 },
      { value: 0, duration: 20 }
    ],
    direction: 'alternate',
    loop: 5, // 5번 반복
    easing: 'easeInOutSine'
  });
}

function getBoxArrangeSquares(box_arrange) {
  var box_s_row = box_arrange.s_row;
  var box_e_row = box_arrange.e_row;
  var box_s_col = box_arrange.s_col;
  var box_e_col = box_arrange.e_col;

  var squares = [];

  for (var r = box_s_row;r<=box_e_row;r++){
    for(var c = box_s_col;c<=box_e_col;c++){
      squares.push(document.querySelector(`.cell_text[data-row="${r}"].cell_text[data-col="${c}"]`));
    }
  }
  return squares;
}

window.NativeInterface = {
    closeConfirm: () => {
      showModal("정말 종료하시겠습니까?"
				,function(){
					if(typeof NativeJSinterface != 'undefined')
						NativeJSinterface.close()
				}
				,function(){hideModal()}
		);
  },
}


