
var total_array;

document.addEventListener('DOMContentLoaded', function() {
    
    // ui 설정
    uiSet();

    // 0~2 row

    total_array = create2DArray(9,9); 

    var s_col = 0;
    var e_col = 3;
    var s_row = 0;
    var e_row = 3; 

    setArray(total_array,s_row,e_row,s_col,e_col);

    s_col +=  3;
    e_col +=  3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    s_col +=  3;
    e_col +=  3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    // 3~5 row

    s_col = 0;
    e_col = 3;
    s_row += 3;
    e_row += 3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    s_col +=  3;
    e_col +=  3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    s_col +=  3;
    e_col +=  3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    // 6~8 row

    s_col = 0;
    e_col = 3;
    s_row += 3;
    e_row += 3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    s_col +=  3;
    e_col +=  3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    s_col +=  3;
    e_col +=  3;

    setArray(total_array,s_row,e_row,s_col,e_col);

    console.log("total_arr = ",total_array);
  });

  function setArray(array
                    ,s_row
                    ,e_row
                    ,s_col
                    ,e_col) {

    var random_array = createRandomArray(9);

    index = 0;
    for(var n=s_row;n<e_row;n++) {
      for(var i=s_col;i<e_col;i++) {
        array[n][i] = random_array[index++];   
      }
    }

  }


// 1부터 9까지 랜덤하게 숫자를 생성해 어레이에 넣는다. 각각은 고유하다.  
function createRandomArray(size) {

  var random_array = new Array(size);

  // 1부터 9까지 숫자를 생성한다. 포함되지않게.
  for(var n = 0;n< random_array.length;n++){
    while (1) {
      var v = random(1,size);
      if(!isContain(random_array,v)) {
        random_array[n] = v;
        break;
      }
    }
  }

  return random_array;
}  
  
// 2 차 배열 생성
function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}

// 최소값부터 최대값까지의 정수를 랜덤하게 생성.
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 어레이에 속해있는지 체크
function isContain(array,v) {
  for (var i = 0; i < array.length; i++) {
    //console.log("v = ",v);
    //console.log("array = ",array);
    if(v == array[i]) 
      return true;
  }
  return false
}


// 4   3   5
//
// 2   4   3
//
// 1   3   2
