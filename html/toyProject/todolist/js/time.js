(function(){
    function getTime(){
        const d = new Date();
        const s = d.getSeconds();
        const m = d.getMinutes();
        const h = d.getHours();
        printTime(h, m, s);
    }

    function printTime(h, m, s){
        const target = document.getElementsByClassName('js-time')[0];
        const time = `${h<10 ? `0${h}` : h} : ${m<10 ? `0${m}` : m} : ${s<10 ? `0${s}` : s}`;
        target.innerText = time;
    }

    function init(){
        getTime()
        setInterval(getTime, 1000)
    }
    init();
})();