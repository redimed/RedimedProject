var str = ' where phuong=:phuong and quyen=:quyen';
var _s = require('underscore.string');
var array = _s.words(str);
var para = [];
var index = 0;

for(i = 0; i < array.length ; i++){
    if(array[i].indexOf(':')>-1){
        console.log(array[i] + '  ' + array[i].indexOf(':'));
        para[index] = array[i].substr(array[i].indexOf(':') + 1);
        index++;
    }
}

console.log(para);