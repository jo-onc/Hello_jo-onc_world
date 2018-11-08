const toDoInput = document.getElementsByClassName('js-toDoInput')[0];
const form = document.getElementsByClassName('js-toDoForm')[0];
const toDoUl = document.getElementsByClassName('js-toDoUl')[0];

const TODOS_LS = "ToDos";

let toDoArr = []

function setList(text){
    toDoObj = {
        id : toDoArr.length + 1,
        text : text,
        success : null
    }
    toDoArr.push(toDoObj);
    saveTodo()
}

function saveTodo(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDoArr))
}

function handleDelete(event){
    const toDoArrFilter = toDoArr.filter(function(toDo){
        return toDo.id !== parseInt(event.target.parentNode.getAttribute('data-id'));
    })
    console.log(toDoArrFilter)
    toDoArr = toDoArrFilter;
    saveTodo();
    window.location.reload();
}

function printList(text){
    const li = document.createElement('li');
    const span = document.createElement('span');
    const btnDel = document.createElement('button');
    const fragment = document.createDocumentFragment();
    btnDel.innerText = "X";
    btnDel.addEventListener('click', handleDelete);
    li.setAttribute('data-id', toDoArr.length + 1)
    span.innerText = text;
    li.appendChild(btnDel);
    li.appendChild(span);
    fragment.appendChild(li);
    toDoUl.append(fragment);
    setList(text);
}

function handleSubmit(event){
    event.preventDefault();
    const text = toDoInput.value;
    console.log(text);
    printList(text);
    toDoInput.value = "";
}

function loadTodo(){
    const getTodo = localStorage.getItem(TODOS_LS),
        getTodoParse = JSON.parse(getTodo);
    for (const i in getTodoParse) {
        printList(getTodoParse[i].text);
    }
}

function init(){
    loadTodo();
    form.addEventListener("submit", handleSubmit);
}
init()