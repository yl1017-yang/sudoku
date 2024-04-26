

// 어레이 초기화
function initArray(array,row,col,initValue) {
  for (var n=0;n<row;n++) {
    for (var i=0;i<col;i++) {
      array[n][i] = -1;
    }  
  }
}

// 어레이에 있는 숫자랑 같은지 비교한다.
function isSameNumber(array,row,col,v){

  console.log("ValidNumber = ",array[row][col].value); 
  console.log("v = ",v); 

  if(v == array[row][col].value) 
    return true;
  else
    return false;

}

// 1부터 9까지 랜덤하게 숫자를 생성해 어레이에 넣는다. 각각은 고유하다.  
function createRandomArray(size,min,max) {

  var random_array = new Array(size);

  // 1부터 9까지 숫자를 생성한다. 포함되지않게.
  for(var n = 0;n< random_array.length;n++){
    while (1) {
      var v = random(min,max);
      if(!this.isContain(random_array,v)) {
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

// 1차 어레이에 속해있는지 체크
function isContain(array,v) {
  for (var i = 0; i < array.length; i++) {
    if(v == array[i]) 
      return true;
  }
  return false
}

// 2차 어레이에서 줄에 같은값이 있는지 체크
function isContainRow(array,row,v) {

  for(var n=0;n<9;n++) {
    var row_v= array[row][n];

    if( v == row_v ) {
      return true;
    }
  }
  return false;
}

// 2차 어레이에서 열에 같은 값이 있는지 체크
function isContainCol(array,col,v) {

  for(var n=0;n<9;n++) {
    var col_v= array[n][col];

    if( v == col_v ) {
      return true;
    }
  }
  return false;
}

// 박스에 같은 값이 있는지 체크
function isContainBox(array,s_row,e_row,s_col,e_col,v) {
  for(var n=s_row;n<=e_row;n++) {
    for(var i=s_col;i<=e_col;i++) {
      var box_v = array[n][i];
      if( v == box_v ) {
        return true;
      }
    }
  }
  return false;
}

// 2차 어레이에서 줄에 값이 모두 같은지 체크
function isSameRow(array,row,v) {

  for(var n=0;n<9;n++) {
    var row_v= array[row][n];

    if( v != row_v ) {
      return false;
    }
  }
  return true;
}

// 2차 어레이에서 열에 값이 모두 같은지 체크
function isSameCol(array,col,v) {

  for(var n=0;n<9;n++) {
    var col_v= array[n][col];

    if( v != col_v ) {
      return false;
    }
  }
  return true;
}

// 박스에 값이 모두 같은지 체크
function isSameBox(array,s_row,e_row,s_col,e_col,v) {
  for(var n=s_row;n<=e_row;n++) {
    for(var i=s_col;i<=e_col;i++) {
      var box_v = array[n][i];
      if( v != box_v ) {
        return false;
      }
    }
  }
  return true;
}

// 어레이안에 들어있는 숫자 갯수를 가져온다.
function getNumberCountInArray(array,s_row,e_row,s_col,e_col,v) {
  var count = 0;
  for(var n=s_row;n<e_row;n++) {
    for(var i=s_col;i<e_col;i++) {
      var array_v = array[n][i];
      if(array_v == v) {
        count++;
      }
    }
  }
  return count; 
}

// 어레이안에 들어있는 히든이 되어 있는 숫자 갯수를 가져온다.
function getHiddenNumberCountInArray(array,s_row,e_row,s_col,e_col,v) {
  var count = 0;
  for(var n=s_row;n<e_row;n++) {
    for(var i=s_col;i<e_col;i++) {
      var array_v = array[n][i];
      if(array_v.isHidden && array_v.value == v) {
        count++;
      }
    }
  }
  return count; 
}

// 어레이안에 들어있는 히든 여부 갯수를 가져온다.
function getHiddenCountInArray(array,s_row,e_row,s_col,e_col) {
  var count = 0;
  for(var n=s_row;n<e_row;n++) {
    for(var i=s_col;i<e_col;i++) {
      var array_v = array[n][i];
      if(array_v.isHidden) {
        count++;
      }
    }
  }
  return count; 
}
