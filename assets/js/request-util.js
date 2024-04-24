

function getParameterValue(key){	
    var url = unescape(location.href); //현재 주소를 decoding  
    var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&"); 
    var val = "";
    for(var i = 0 ; i < paramArr.length ; i++){
        var temp = paramArr[i].split("="); 
        if(temp[0].toUpperCase() == key.toUpperCase()){
            val = paramArr[i].split("=")[1]; 
            return val;
        } 
    };
    return val;
}