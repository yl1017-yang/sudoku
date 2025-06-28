
document.addEventListener('DOMContentLoaded', function() {
    
    // event 세팅
    setEvent();

    // 데이타 초기화
    initData();

    // 뷰 세팅
    setView();

});

function setEvent() {

  // 설정 버튼 이벤트 - 쉬워요
  document.querySelector('#btn_mode1').onclick = function(){
    location.href="../game/sudoku.html?mode_type=1&level=1"
  };

  // 설정 버튼 이벤트 - 할만해요
  document.querySelector('#btn_mode2').onclick = function(){
    location.href="../game/sudoku.html?mode_type=2&level=5"
  };

  // 설정 버튼 이벤트 - 도전모드
  document.querySelector('#btn_mode3').onclick = function(){
	  if(typeof NativeJSinterface != 'undefined') 
		  NativeJSinterface.getChallengeCurLevel();
    else
      location.href="../game/sudoku.html?mode_type=3&level=1" 
  };

  // 설정 버튼 이벤트 - 레벨선택
  document.querySelector('#btn_mode4').onclick = function(){
    location.href="../game/sudoku.html?mode_type=1&level=1"
  };

}

function getChallengeCurLevelCallback(level) {
   if(level != "1") {
    var nAdvancelevel = parseInt(level,10);
    showModal("스테이지 "+ nAdvancelevel +" 까지 진행한 기록이 있네요. 이어서 진행하시겠어요?"
      ,function(){
        // 현재 기록되어있는 레벨을 초기화한다.
        if(typeof NativeJSinterface != 'undefined') {
          NativeJSinterface.setChallengeCurLevel(1);				
        }
        location.href="../game/sudoku.html?mode_type=3&level=" + nAdvancelevel
      }
      ,function(){
        location.href="../game/sudoku.html?mode_type=3&level=1"
      });
   } else {
     location.href="../game/sudoku.html?mode_type=3&level=1" 
   }
}

function initData() {

}

function setView() {

}

function showModal(msg,ok_listner,cancel_listner) {
  let div = document.querySelector('.modal-wrap');
  div.classList.remove("hidden");

  document.querySelector('.modal-wrap .modal-text').innerText = msg;
  document.querySelector('.modal-wrap .btn-point').onclick = ok_listner;
  document.querySelector('.modal-wrap .btn-gray').onclick = cancel_listner;
}

function hideModal() {
  let div = document.querySelector('.modal-wrap');
  div.classList.add("hidden");
}

window.NativeInterface = {
  closeConfirm: () => {
    showModal("정말 종료하시겠습니까?"
                              ,function(){NativeJSinterface.close()}
                              ,function(){hideModal()});
  },
}



