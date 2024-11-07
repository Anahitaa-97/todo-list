//selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//event listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deletecheck);
filterOption.addEventListener('click', filterTodo);

//functions
function addTodo(event) {
    event.preventDefault();
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    newTodo.setAttribute('contenteditable', 'false'); // اضافه کردن این خط
    todoDiv.appendChild(newTodo);
    
    saveLocalTodo(todoInput.value);
    
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-pen"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);
    
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    
    todoList.appendChild(todoDiv);
    todoInput.value = "";
}

function deletecheck(e) {
    const item = e.target;
    const todo = item.parentElement;
    const todoItem = todo.querySelector('.todo-item');

    if (item.classList[0] === 'trash-btn') {
        todo.classList.add("fall");
        removeLocalTodo(todo);
        todo.addEventListener('transitionend', function() {
            todo.remove();
        });
    }

    if (item.classList[0] === "complete-btn") {
        todo.classList.toggle("completed");
    }

    if (item.classList[0] === 'edit-btn') {
        const isEditing = todoItem.getAttribute('contenteditable') === 'true';
        
        if (!isEditing) {
            // شروع ویرایش
            todoItem.setAttribute('contenteditable', 'true');
            todoItem.focus();
            item.innerHTML = '<i class="fas fa-save"></i>';
            
            // ذخیره متن قبلی
            todoItem.dataset.oldText = todoItem.innerText;
            
            // اضافه کردن event listener برای کلید Enter
            todoItem.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    finishEditing(todoItem, item);
                }
            });
            
            // اضافه کردن event listener برای زمانی که focus از روی المان برداشته می‌شود
            todoItem.addEventListener('blur', function() {
                finishEditing(todoItem, item);
            });
        }
    }
}

function finishEditing(todoItem, editButton) {
    const newText = todoItem.innerText.trim();
    const oldText = todoItem.dataset.oldText;
    
    if (newText !== '' && newText !== oldText) {
        updateLocalTodo(oldText, newText);
    } else if (newText === '') {
        todoItem.innerText = oldText;
    }
    
    todoItem.setAttribute('contenteditable', 'false');
    editButton.innerHTML = '<i class="fas fa-pen"></i>';
    delete todoItem.dataset.oldText;
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                if(todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                }else{
                    todo.style.display = "none";
                } 
                break;
            case "uncompleted":
                if(!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else{
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodo(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function (todo) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        
        const newTodo = document.createElement('li');
        newTodo.innerText = todo;
        newTodo.classList.add('todo-item');
        newTodo.setAttribute('contenteditable', 'false'); // اضافه کردن این خط
        todoDiv.appendChild(newTodo);
        
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);
        
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pen"></i>';
        editButton.classList.add("edit-btn");
        todoDiv.appendChild(editButton);
        
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodo(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalTodo(oldTodo, newTodo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.indexOf(oldTodo);
    if (todoIndex !== -1) {
        todos[todoIndex] = newTodo;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}