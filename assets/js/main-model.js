


var mainModel = {

   total_array:{},
   // 초기화
   init: function() {

      // 랜덤 어레이 생성
      var array = create2DArray(9,9); 
      for(var n=1;n<10000;n++) {
        if(this.setRandomArray(array)){
          console.log("setRandomArray success th = ",n);
          break;
        }
      }
  
      console.log("array = ",array);
  
      // 마스크 어레이 생성
      var mask_array = create2DArray(9,9); 
      for(var n=1;n<1000;n++) {
        if(this.setMaskArray(mask_array)){
          console.log("setMaskArray success th = ",n);
          break;
        }
      }
  
      console.log("mask_array = ",mask_array);
  
      // 랜덤어레이와 마스크어레이를 결합해 최종 어레이 생성
      this.total_array = create2DArray(9,9); 
      for (var row=0;row<9;row++) {
        for (var col=0;col<9;col++) {
  
          var obj = new Object();
          obj.value = array[row][col];  // 숫자
          obj.input = -1; // 입력값
  
          obj.isVisible = mask_array[row][col] == 1 ? true : false; // 보이는 여부
  
          this.total_array[row][col] = obj;
        }
      }
  
      console.log("total_array = ",this.total_array); 

   },
   setMaskArray: function(array) {

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
  },
  setRandomArray : function(array) {
  
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
    
          if(!this.setArrayData(array
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
  } , 
  // 어레이 세팅
  setArrayData : function(array
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
};


