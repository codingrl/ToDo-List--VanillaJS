let todoData = JSON.parse(localStorage.getItem('todoData')) || [];

let searchValue = '';
let filterValue = 'all';

function saveTodoData(data) {
  todoData = data;
  localStorage.setItem('todoData', JSON.stringify(todoData));
}

// Elements
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const searchInput = document.querySelector('#search-input');
const filterSelect = document.querySelector('#filter-select');

// Show todoData
function showTodosData() {
  todoList.innerHTML = '';
  todoData
    .filter((todo) =>
      todo.text.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    )
    .filter((el) => {
      if (filterValue == 'all') return el;
      if (filterValue == 'done' && el.isDone) return el;
      if (filterValue == 'todo' && !el.isDone) return el;
    })
    .forEach((todo) => {
      todoList.innerHTML += `
        <div class="todo ${todo.isDone ? 'done' : ''} ${
        todo.isEditable ? 'edit' : ''
      }">    
          ${
            todo.isEditable
              ? `<textarea>${todo.text}</textarea>`
              : `<h3>${todo.text}</h3>`
          }
          ${
            !todo.isEditable
              ? `<button data-id=${todo.key} class="finish-todo">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button ${todo.isDone ? 'disabled' : ''} data-id=${
                  todo.key
                } class="edit-todo">
                <i class="fa-solid fa-pen"></i>
                </button>`
              : `<button data-id=${todo.key} class="save-todo">
                  <i class="fa-solid fa-file-pen"></i>
                </button>
                <button ${todo.isDone ? 'disabled' : ''} data-id=${
                  todo.key
                } class="edit-todo">
                <i class="fa-solid fa-xmark"></i>
              </button>`
          }
          <button data-id=${todo.key} class="remove-todo">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    });
  handlersEvents();
}

function addTodo(text) {
  let todoBody = {
    key: new Date().getTime(),
    text,
    isDone: false,
    isEditable: false,
  };
  let editedTodoData = [...todoData, todoBody];
  saveTodoData(editedTodoData);
  showTodosData();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = todoInput.value;
  if (inputValue) {
    addTodo(inputValue);
    todoInput.value = '';
    todoInput.focus();
  }
});

searchInput.addEventListener('input', (e) => {
  searchValue = e.target.value;
  showTodosData();
});

filterSelect.addEventListener('input', (e) => {
  filterValue = e.target.value;
  showTodosData();
});

function handlersEvents() {
  const finishBtns = document.querySelectorAll('.finish-todo');
  const editBtns = document.querySelectorAll('.edit-todo');
  const saveBtns = document.querySelectorAll('.save-todo');
  const removeBtns = document.querySelectorAll('.remove-todo');

  const curEditableTodo = document.querySelector('.edit textarea');
  let curEditableValue = '';

  finishBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let btnKey = btn.dataset.id;
      let editedTodoData = todoData.map((todo) => {
        if (todo.key == btnKey) {
          return { ...todo, isDone: !todo.isDone };
        }
        return todo;
      });
      saveTodoData(editedTodoData);
      showTodosData();
    });
  });

  editBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let btnKey = btn.dataset.id;
      let editedTodoData = todoData.map((todo) => {
        if (todo.key == btnKey) {
          return { ...todo, isEditable: !todo.isEditable };
        }
        if (todo.key != btnKey && todo.isEditable) {
          return { ...todo, isEditable: false };
        }
        return todo;
      });
      saveTodoData(editedTodoData);
      showTodosData();
    });
  });

  removeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let btnKey = btn.dataset.id;
      let editedTodoData = todoData.filter((todo) => todo.key != btnKey);
      saveTodoData(editedTodoData);
      showTodosData();
    });
  });

  if (curEditableTodo != null) {
    curEditableTodo.addEventListener('change', (e) => {
      curEditableValue = e.target.value;
    });
  }
  
  saveBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let btnKey = btn.dataset.id;
      let editedTodoData = todoData.map((todo) => {
        if (todo.key == btnKey && curEditableValue) {
          return { ...todo, isEditable: false, text: curEditableValue };
        } else {
          return { ...todo, isEditable: false };
        }
        return todo;
      });
      saveTodoData(editedTodoData);
      showTodosData();
    });
  });
}

showTodosData();
