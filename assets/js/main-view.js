
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

  hideDialog();
}

function showDialog() {
  let div = document.querySelector('.modal-wrap');
  //div.classList.remove('hidden').add('hidden');
  div.style.display = 'initial';
}

function hideDialog() {
  let div = document.querySelector('.modal-wrap');
  //div.classList.remove('hidden').add('hidden');
  div.style.display = 'none';
}

