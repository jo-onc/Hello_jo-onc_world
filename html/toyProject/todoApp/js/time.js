window.addEventListener('load', (function(){
'use strict';

function getTIme(){
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    var amPm = "";
    if(h < 12){
        amPm = 'am ';
        if(h < 10){
            h = `0${h}`;
        } else {
            h = h;
        }
    } else if(h == 12){
        amPm = 'pm ';
        h = h;
        
    } else {
        amPm = 'pm ';
        h = (h - 12);
        h = (h < 10 ? `0${h}` : h);
    }
    var result = `${amPm + h} : ${m < 10 ? `0${m}` : m} : ${s < 10 ? `0${s}` : s} `
    load(result);
}

function load(result){
    var timeArea = document.getElementById('js-time');
    timeArea.textContent = result;
}

(function(){
    setInterval(getTIme, 1000);
})();

})());