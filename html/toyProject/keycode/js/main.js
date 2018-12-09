(function(){
    var input = document.querySelector('#input'),
    output = document.querySelector('#output');
    input.focus();
    input.addEventListener('keydown', updateKey);
    input.addEventListener('input', updateKey);
    function updateKey(e){
        if(e.type === 'keydown'){
            output.textContent = `e.code : ${e.code} -> e.keyCode : ${e.keyCode}`;
        }
    }
})();