


var mainModel = {

  // 최종 어레이
  total_array:{},
  // 레벨
  level:1,
  // 초기화
  init: function() {

    var plevel = getParameterValue("level"); 
    console.log("getParameterValue level  = " + plevel);

    if(plevel == "")
      this.level = 1;
    else
      this.level = Number(plevel);

    console.log("level  = " + this.level);

     // 랜덤 어레이 생성
     var randomArratTryMaxCnt = 10000; 
     var array = create2DArray(9,9); 
     for(var n=1;n<=randomArratTryMaxCnt;n++) {
       if(this.setRandomOption(array)){
         console.log("setRandomOption success th = ",n);
         break;
       }
       if(n== randomArratTryMaxCnt)
        console.log("setRandomOption fail");
     }

     console.log("array = ",array);
 
     // 하이드 어레이 생성
     var hideArratTryMaxCnt = 1000;
     var hide_array = create2DArray(9,9); 
     for(var n=1;n<=hideArratTryMaxCnt;n++) {
       if(this.setHideOption(hide_array)){
         console.log("setHideOption success th = ",n);
         break;
       }
       if(n== hideArratTryMaxCnt)
        console.log("setHideOption fail");
     }
 
     console.log("hide_array = ",hide_array);
 
     // 랜덤어레이와 하이드어레이를 결합해 최종 어레이 생성
     this.total_array = create2DArray(9,9); 
     for (var row=0;row<9;row++) {
       for (var col=0;col<9;col++) {
 
         var obj = new Object();
         obj.value = array[row][col];  // 숫자
         obj.input = -1; // 입력값
 
         obj.isVisible = hide_array[row][col] == 1 ? false : true; // 보이는 여부
 
         this.total_array[row][col] = obj;
       }
     }
 
     console.log("total_array = ",this.total_array); 

  },
 setRandomOption : function(array) {
 
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
 },
 setHideOption: function(array) {

  initArray(array,9,9,-1);
  
  var total_count = 9 * 9; 

  for (var row=0;row<9;row++) {
    for (var col=0;col<9;col++) {

      // 옵션 
      // 총 히든숫자는 9*9 = 81
      // 레벨 1 - 15*1 = 15
      // 레벨 2 - 15*2 = 30
      // 레벨 3 - 15*3 = 45
      var ran = random(1,total_count);

      var hide_max = 15 * (this.level);

      var v = ran <= hide_max ? 1 : 0; 

      array[row][col] = v;

      var box_s_row = parseInt(row / 3) * 3;
      var box_e_row = box_s_row + 2;
      var box_s_col = parseInt(col / 3) * 3;
      var box_e_col = box_s_col + 2;

      //console.log("box_s_row = ",box_s_row);
      //console.log("box_e_row = ",box_e_row);
      //console.log("box_s_col = ",box_s_col);
      //console.log("box_e_col = ",box_e_col);

      // 같은 줄이나 같은 열, 같은 박스에 하이드가 없다면 false
      // 같은 줄이나 같은 열, 같은 박스에 하이드가 모두 있다면 false
      if(isSameRow(array,row,0)
          ||isSameCol(array,col,0)
          ||isSameBox(array
                      ,box_s_row
                      ,box_e_row
                      ,box_s_col
                      ,box_e_col
                      ,0 )
          ||isSameRow(array,row,1)
          ||isSameCol(array,col,1)
          ||isSameBox(array
                      ,box_s_row
                      ,box_e_row
                      ,box_s_col
                      ,box_e_col
                      ,1 )                
                          
                          ) {
          return false;
        }
      }
    }
    
    // 어레이에 총 히든이 몇개 있는지 체크한다.
    if(!checkValueCount(array,0,9,0,9,1,hide_max,hide_max+5)) {
        return false;
    }

    return true;
  }
};
