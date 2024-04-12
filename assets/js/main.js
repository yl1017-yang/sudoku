
var total_array;

document.addEventListener('DOMContentLoaded', function() {
    
    // ui 설정
    uiSet();

    // 랜덤 어레이를 생성한다.
    setRandomArray();
});

function setRandomArray() {

  var array = create2DArray(9,9); 
  for(var n=0;n<10000;n++) {
    if(fnSetRandomArray(array)){
      console.log("success count = ",n);
      break;
    }
  }

  console.log("array = ",array);

  total_array = create2DArray(9,9); 

  for (var n=0;n<9;n++) {
    for (var i=0;i<9;i++) {


      var obj = new Object();
      obj.num = array[n][i];  // 숫자
      obj.input = -1; // 입렵값

      var ran = random(1,3);
      obj.isVisible = ran != 1 ? true : false; // 보이는 여부

      total_array[n][i] = obj;
    }  
  }

  console.log("total_array = ",total_array);
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

    var box_s_row = 0;
    var box_e_row = 2;

    for(var n=0;n<3;n++) {

      var box_s_col = 0;
      var box_e_col = 2;

      for(var i=0;i<3;i++) {
        if(!setBoxArray(array,box_s_row,box_e_row,box_s_col,box_e_col))
          return false;

        box_s_col += 3;
        box_e_col += 3;  
      }

      box_s_row += 3;
      box_e_row += 3;
    }
    
    return true;
}  

function setBoxArray(array
                     ,box_s_row
                     ,box_e_row
                     ,box_s_col
                     ,box_e_col) {

    for(var n=box_s_row;n<=box_e_row;n++) {
      for(var i=box_s_col;i<=box_e_col;i++) {
        if(!setArray(array
          ,n
          ,i
          ,box_s_row
          ,box_e_row
          ,box_s_col
          ,box_e_col))
          return false;
      }
    }
    //console.log("array = ",array);
    return true;
}

// 어레이 초기화
function initArray(array,row,col,initValue) {
  for (var n=0;n<9;n++) {
    for (var i=0;i<9;i++) {
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

      var random_array1 = createRandomArray(9);

      for(var n=0;n<random_array1.length;n++) {
        var v= random_array1[n];

        /*
        var b1 = isContainRow(array,row,v);
        var b2 = isContainCol(array,col,v);
        var b3 = isContainBox(array
                              ,box_s_row
                              ,box_e_row
                              ,box_s_col
                              ,box_e_col
                              ,v );

        console.log("----");  
        console.log("v = " + v + " ,b1 = ",b1);
        console.log("v = " + v + " ,b2 = ",b2);
        console.log("v = " + v + " ,b3 = ",b3);
        console.log("----");
        */

        // 열, 박스 체크
        if(!isContainRow(array,row,v)
          &&!isContainCol(array,col,v)
          && !isContainBox(array
                          ,box_s_row
                          ,box_e_row
                          ,box_s_col
                          ,box_e_col
                          ,v )) {
          var obj = new Object();
          //obj.num = v;  // 숫자
          //obj.input = -1; // 입렵값

          //var ran = random(1,3);
          //obj.isVisible = ran != 1 ? true : false; // 보이는 여부

          array[row][col] = v; //obj;  // =v;
          return true;
          //break;
        }
      }
      return false;
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

// 박스에서 체크
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


// 4   3   5
//
// 2   4   3
//
// 1   3   2
