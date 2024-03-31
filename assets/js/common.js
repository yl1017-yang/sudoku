document.addEventListener('DOMContentLoaded', function() {
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
      // 마지막으로 포커스된 input이 있고, 수정 가능한 상태인지 확인합니다.
      if (lastFocused && !lastFocused.readOnly) {
          lastFocused.value = number;
      }
  }
});
