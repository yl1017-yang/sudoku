
var uiSet = function() {
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
          lastFocused.value = number;
      }
    } 
}
