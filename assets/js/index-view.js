
document.addEventListener('DOMContentLoaded', function() {
    
    // event 세팅
    setEvent();

    // 데이타 초기화
    initData();

    // 뷰 세팅
    setView();

});

function setEvent() {

  // 설정 버튼 이벤트 - 레벨선택
  document.querySelector('#btn_mode_level').onclick = function(){
    //location.href="../game/main.html?mode_type=1&level=1"
    showLevelSelect(
      "레벨을 선택해주세요 !"
      ,function(){
        const selected = document.querySelector('input[name="level"]:checked');
        if(selected){
          location.href="../game/main.html?mode_type=1&level=" + selected.value; 
        }
      }
      ,function(){
        hideLevelSelect();
      });
  };

  // 설정 버튼 이벤트 - 도전모드
  document.querySelector('#btn_mode_challenge').onclick = function(){
	  if(typeof NativeJSinterface != 'undefined') 
		  NativeJSinterface.getChallengeCurLevel();
    else
      location.href="../game/main.html?mode_type=2&level=1" 
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
        location.href="../game/main.html?mode_type=2&level=" + nAdvancelevel
      }
      ,function(){
        location.href="../game/main.html?mode_type=2&level=1"
      });
   } else {
     location.href="../game/main.html?mode_type=2&level=1" 
   }
}

function initData() {

}

function setView() {

}

function showModal(msg,ok_listner,cancel_listner) {
  let div = document.querySelector('.modalyesno');
  div.classList.remove("hidden");

  document.querySelector('.modalyesno .modal-text').innerText = msg;
  document.querySelector('.modalyesno .btn-point').onclick = ok_listner;
  document.querySelector('.modalyesno .btn-gray').onclick = cancel_listner;
}

function hideModal() {
  let div = document.querySelector('.modalyesno');
  div.classList.add("hidden");
}

function showLevelSelect(msg,ok_listner,cancel_listner){
  let div = document.querySelector('.modallevel');
  div.classList.remove("hidden");

  document.querySelector('.modallevel .modal-text').innerText = msg;
  document.querySelector('.modallevel .btn-point').onclick = ok_listner;
  document.querySelector('.modallevel .btn-gray').onclick = cancel_listner;
}

function hideLevelSelect() {
  let div = document.querySelector('.modallevel');
  div.classList.add("hidden");
}

window.NativeInterface = {
  closeConfirm: () => {
    showModal("정말 종료하시겠습니까?"
                              ,function(){NativeJSinterface.close()}
                              ,function(){hideModal()});
  },
}



