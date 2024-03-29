// 숫자 버튼 클릭시 input에 숫자 넣기
var buttons = document.querySelectorAll('.btn-number');

buttons.forEach(function(button) {
  button.addEventListener('click', function() {
      var value = button.textContent.trim().split(' ')[0];
      var input = button.parentNode.nextElementSibling.querySelector('input');

      input.value = value;
  });
});
