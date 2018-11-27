window.addEventListener('load', (function(){
'use strict';

var ul = document.getElementById('js-todoUl');
var input = document.getElementById('js-todoInput');

var TODO_LS = 'ToDo';

var todoArr = []

function CreateElem(elem, elemClass, data){ // fn_createElement
    var data = null || data;
    var elem = document.createElement(elem); 
    elem.classList.add(elemClass);
    if(data !== null){
        if(elem instanceof HTMLInputElement){
            elem.value = data;
        } else {
            elem.textContent = data;
        }
    }
    return elem;
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

//리스트 로드

//setData
function setData(data, checked){
    var checked = checked || false;
    var todoObj = {
        id: todoArr.length + 1,
        checked: checked,
        data: data
    }
    todoArr.push(todoObj);
    saveLS()
}
function saveLS(){
    localStorage.setItem(TODO_LS, JSON.stringify(todoArr));
}

function load(){
    var todoData = localStorage.getItem(TODO_LS),
    todoDataParse = JSON.parse(todoData);
    for(var index in todoDataParse){
        var todo = todoDataParse[index];
        printData(todo.data, todo.id, todo.checked);
    }
    input.focus();
}

//리스트 읽기
function printData(todoData, todoId, todoChk){
    var li = new CreateElem('li', 'todo-li', null)
    li.setAttribute('id', todoId)
    var span = new CreateElem('span', 'todo-span', todoData);
    var chkBox = new CreateElem('input', 'todo-chk', null)
    chkBox.setAttribute('type','checkbox');
    if(todoChk !== false){
        li.setAttribute('data-chk', todoChk);
        chkBox.setAttribute('checked', 'checked')
    }
    var btnDel = new CreateElem('input', 'todo-btn-del', 'X');
    btnDel.setAttribute('type', 'button');
    var frag = document.createDocumentFragment();
    li.appendChild(chkBox);
    li.appendChild(span);
    li.appendChild(btnDel);
    frag.appendChild(li);
    ul.append(frag);
    li.addEventListener('click', function(e){
        if(e.target.getAttribute('class') === 'todo-span'){
            handleUpdate(e);
        } else {
            return false;
        }
    });
    chkBox.addEventListener('change', handleChk);
    btnDel.addEventListener('click', handleDelete);
    setData(todoData, todoChk)
}

//리스트 입력
function handleCreate(){
    var inputData = input.value;
    setData(inputData)
    input.value = "";
}
(function(){
    var form = document.getElementById('js-todoForm');
    form.addEventListener('submit', function(e){
        var inputValue = input.value;
        if(!inputValue.isEmpty()){
            handleCreate();
        } else {
            return false;
        }
    });
})();


//리스트 수정
function handleUpdate(e){
    var target = e.target;
    var li = target.parentNode;
    var targetText = target.textContent;
    // var varName = new CreateElem(tag, addClass, value data or null);
    var createdForm = new CreateElem('form', 'todo-form-update', null);
    var createdInput = new CreateElem('input', 'todo-input-update', null);
    createdInput.value = targetText;
    var createdBtnSubmit = new CreateElem('button', 'todo-btn-update', 'OK');
    var frag = document.createDocumentFragment()
    createdForm.appendChild(createdInput);
    createdForm.appendChild(createdBtnSubmit);
    frag.appendChild(createdForm);
    var form = document.getElementsByClassName('todo-form-update')[0];
    if(!form){
        var targetId = li.getAttribute('id');
        li.append(frag);
        createdInput.focus();
        createdBtnSubmit.addEventListener('click',function(){
            todoArr[targetId-1].data = createdInput.value;
            saveLS();
            window.location.reload();
        });
    } else {
        form.parentNode.removeChild(form);
    }
}

//리스트 체크
function handleChk(e){
    var li = e.target.parentNode;
    var liId = li.getAttribute('id');
    var targetIndex = todoArr[liId-1];
    if(this.checked){
        targetIndex.checked = 'checked';
        li.setAttribute('data-chk', targetIndex.checked)
    } else {
        targetIndex.checked = false;
        li.removeAttribute('data-chk');
    }
    saveLS();
}(this);

//리스트 삭제
function handleDelete(e){
    var liId = e.target.parentNode.getAttribute('id');
    var index = liId - 1;
    todoArr.splice(index, 1);
    saveLS();
    window.location.reload();
}
function init(){
    load();
}
init();
})());