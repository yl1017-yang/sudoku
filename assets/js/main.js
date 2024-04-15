
var total_array;

document.addEventListener('DOMContentLoaded', function() {
    
    // ui 설정(설아)
    uiSet();

    // 랜덤 어레이를 생성한다.(알베르토)
    setRandomArray();

    // 스도쿠 div에 데이타를 세팅한다.(알베르토)
    setData();
});

function setRandomArray() {

  var array = create2DArray(9,9); 
  for(var n=1;n<10000;n++) {
    if(fnSetRandomArray(array)){
      console.log("fnSetRandomArray success th = ",n);
      break;
    }
  }

  console.log("array = ",array);

  var mask_array = create2DArray(9,9); 

  for(var n=1;n<1000;n++) {
    if(fnSetMask(mask_array)){
      console.log("fnSetMask success th = ",n);
      break;
    }
  }

  console.log("mask_array = ",mask_array);

  total_array = create2DArray(9,9); 

  for (var row=0;row<9;row++) {
    for (var col=0;col<9;col++) {

      var obj = new Object();
      obj.value = array[row][col];  // 숫자
      obj.input = -1; // 입력값


      obj.isVisible = mask_array[row][col] == 1 ? true : false; // 보이는 여부

      total_array[row][col] = obj;
    }
  }

  console.log("total_array = ",total_array);
 
}

function fnSetMask(array) {

  initArray(array,9,9,-1);
  
  for (var row=0;row<9;row++) {
    for (var col=0;col<9;col++) {

      var ran = random(0,5);

      var v = ran == 0 ? 0 : 1; 

      array[row][col] = v;

      var box_s_row = parseInt(row / 3) * 3;
      var box_e_row = box_s_row + 2;
      var box_s_col = parseInt(col / 3) * 3;
      var box_e_col = box_s_col + 2;

      //console.log("box_s_row = ",box_s_row);
      //console.log("box_e_row = ",box_e_row);
      //console.log("box_s_col = ",box_s_col);
      //console.log("box_e_col = ",box_e_col);

      if(isSameRow(array,row,1)
          ||isSameCol(array,col,1)
          ||isSameBox(array
                          ,box_s_row
                          ,box_e_row
                          ,box_s_col
                          ,box_e_col
                          ,1 )) {
          return false;
        }
      }
  }
  return true;
}

function setData() {

  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {

      document.querySelectorAll(`.cell input[data-row="${row}"]`) .forEach(input => {        
        var data_col = input.getAttribute('data-col');
        if(data_col == col ) {
          //console.log("input = ",input );
          var obj = total_array[row][col];
          if(obj.isVisible) {            
            input.value = total_array[row][col].value;
            input.setAttribute('readonly', true);
          } else {
            input.value = "";
            input.removeAttribute('readonly');
          }
        }
      });
    }
  }
}


function fnSetRandomArray(array) {

    // 추후 개선이 필요하다.***
    // 하나씩 만들어본다.
    // 만들때 체크조건은 3가지이다. 
    // 1. 열에서 공통된게 있는지
    // 2. 줄에서 공통된게 있는지
    // 3. 박스 (9개) 에서 공통된게 있는지

    // 어레이 초기화
    initArray(array,9,9,-1);

    for (var row=0;row<9;row++) {
      for (var col=0;col<9;col++) {
  
        var box_s_row = parseInt(row / 3) * 3;
        var box_e_row = box_s_row + 2;
        var box_s_col = parseInt(col / 3) * 3;
        var box_e_col = box_s_col + 2;
  
        //console.log("box_s_row = ",box_s_row);
        //console.log("box_e_row = ",box_e_row);
        //console.log("box_s_col = ",box_s_col);
        //console.log("box_e_col = ",box_e_col);
  
        if(!setArray(array
          ,row
          ,col
          ,box_s_row
          ,box_e_row
          ,box_s_col
          ,box_e_col))
          return false;
      }
    }

    return true;
}  

// 어레이 초기화
function initArray(array,row,col,initValue) {
  for (var n=0;n<row;n++) {
    for (var i=0;i<col;i++) {
      array[n][i] = -1;
    }  
  }
}

function setArray(array
    ,row
    ,col
    ,box_s_row
    ,box_e_row
    ,box_s_col
    ,box_e_col) {

      var random_array1 = createRandomArray(9,1,9);

      for(var n=0;n<random_array1.length;n++) {
        var v= random_array1[n];


        // 열, 박스 체크
        if(!isContainRow(array,row,v)
          &&!isContainCol(array,col,v)
          && !isContainBox(array
                          ,box_s_row
                          ,box_e_row
                          ,box_s_col
                          ,box_e_col
                          ,v )) {

          array[row][col] = v; 
          return true;
        }
      }
      return false;
}

// 1부터 9까지 랜덤하게 숫자를 생성해 어레이에 넣는다. 각각은 고유하다.  
function createRandomArray(size,min,max) {

  var random_array = new Array(size);

  // 1부터 9까지 숫자를 생성한다. 포함되지않게.
  for(var n = 0;n< random_array.length;n++){
    while (1) {
      var v = random(min,max);
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


// 4   3   5
//
// 2   4   3
//
// 1   3   2
