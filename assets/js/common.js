document.addEventListener('DOMContentLoaded', function() {
  // 마지막으로 포커스된 input 요소를 추적합니다.
  let lastFocused;
  const inputs = document.querySelectorAll('.cell input[type="text"]');

  // 각 input 필드에 대해 focus 이벤트 리스너를 추가합니다.
  inputs.forEach(input => {
      input.addEventListener('focus', function() {
          lastFocused = this; // 현재 포커스된 input을 저장합니다.
      });
  });

  window.insertNumber = function(number) {
      // 마지막으로 포커스된 input이 있고, 수정 가능한 상태인지 확인합니다.
      if (lastFocused && !lastFocused.readOnly) {
          lastFocused.value = number; // 숫자를 입력합니다.
          
          // 여기에 숫자를 입력한 후 필요한 로직 추가 (예: 숫자 카운트 감소)
      }
  }
});
