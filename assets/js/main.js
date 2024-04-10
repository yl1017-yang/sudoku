
var arr;

document.addEventListener('DOMContentLoaded', function() {
    
    // ui 설정
    uiSet();

    // 2차 배열 생성 9 x 9. 총 81개 필요
    arr = create2DArray(9, 9);

    //console.log("arr = ",arr);

    // 배열에 랜덤한 숫자 넣기.
    var v1;
    var v2;

    console.log("arr[0].lenth = ",arr[0].length);

    for(var n = 0;n< arr[0].length;n++){
      while (1) {
        var v2 = random(1,9);
        //console.log("v2 = ",v2);
        if(!isContain(arr[0],v2)) {
          //console.log("isContain = false ");
          arr[0][n] = v2;
          break;
        }
      }
    }
    /*
    v1 = random(1,9);
    arr[0][0] = v1; 

    while (1) {
      var v2 = random(1,9);
      if(!isContain(arr[0]),v2) {
        arr[0][1] = v2;
        break;
      }
    }

    while (1) {
      var v2 = random(1,9);
      if(!isContain(arr[0]),v2) {
        arr[0][2] = v2;
        break;
      }
    }

    while (1) {
      var v2 = random(1,9);
      if(!isContain(arr[0]),v2) {
        arr[0][3] = v2;
        break;
      }
    }
    */
    //console.log("v1 = ",v1);
    //console.log("v2 = ",v2);
    //console.log("v3 = ",v3);

    console.log("arr = ",arr);
  });
  
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
