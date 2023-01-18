const saveToLocalStorage = (obj, key = 'toDoList') => window.localStorage.setItem(key, JSON.stringify(obj));
const getFromLocalStorage = (key = 'toDoList') => JSON.parse(window.localStorage.getItem(key));

const toDoList = getFromLocalStorage() || [];

const toDoListContainer = document.getElementById('todoList');

const findIndexById = (id) => toDoList.findIndex((el) => el.id === id);

const deleteFromArray = (index) => {
  toDoList.splice(index, 1);
  saveToLocalStorage(toDoList);
};

const switchIsDone = (id) => {
  const index = findIndexById(id);
  toDoList[index].isDone = !toDoList[index].isDone;
};

function renderAllToDoItems() {
  toDoListContainer.innerHTML = '';
  toDoList.filter((el) => !el.isDone).concat(toDoList.filter((el) => el.isDone))
    .map((el) => createListItem(el)); // eslint-disable-line no-use-before-define
}

const handleDeleteButtonClick = (index) => {
  deleteFromArray(index);
  renderAllToDoItems();
};

const createDeleteButton = (listObject, divForToDoItem) => {
  const divForButtonDelete = document.createElement('div');
  divForButtonDelete.classList.add('btnDeleteTodo');
  divForButtonDelete.setAttribute('data-testid', 'btnDeleteTodo');
  divForButtonDelete.setAttribute('id', listObject.id);
  divForToDoItem.append(divForButtonDelete);

  divForButtonDelete.addEventListener('click', () => {
    const index = findIndexById(divForButtonDelete.parentNode.id);
    handleDeleteButtonClick(index);
    saveToLocalStorage(toDoList);
  });
};

const createListItem = (listObject) => {
  const divForToDoItem = document.createElement('div');
  divForToDoItem.setAttribute('id', listObject.id);
  divForToDoItem.setAttribute('data-testid', 'todoItem');
  toDoListContainer.append(divForToDoItem);
  const divForToDoText = document.createElement('div');
  divForToDoText.classList.add('toDoText');
  divForToDoItem.append(divForToDoText);
  const h3ForToDoText = document.createElement('h3');
  h3ForToDoText.textContent = listObject.title;
  divForToDoText.append(h3ForToDoText);
  const pForToDoText = document.createElement('p');
  pForToDoText.textContent = listObject.description;
  divForToDoText.append(pForToDoText);
  if (listObject.isDone) {
    divForToDoItem.classList.add('toDoItem', 'todo__item--completed');
    createDeleteButton(listObject, divForToDoItem);
  } else {
    divForToDoItem.classList.add('toDoItem');
  }
  divForToDoItem.addEventListener('click', (event) => {
    if (event.composedPath()[0] !== 'btnDeleteTodo') {
      const { id } = divForToDoItem;
      switchIsDone(id);
      renderAllToDoItems();
    }
    saveToLocalStorage(toDoList);
  });
};

const createUnicId = () => {
  let id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 3; i += 1) {
    id += characters.charAt(Math.floor(Math.random() * 60));
    if (toDoList.map((el) => el.id).includes(id)) {
      id = '';
      i = 0;
    }
  }
  return id;
};

const pushToDoToArray = (title, description) => {
  const id = createUnicId();
  toDoList.unshift({
    id,
    title,
    description,
    isDone: false,
  });
  saveToLocalStorage(toDoList);
};

const handleAddButtonClick = () => {
  const inputTitle = document.getElementById('txtTodoItemTitle');
  const inputTitleData = inputTitle.value;
  inputTitle.value = '';

  const inputDescription = document.getElementById('txtTodoItemDescription');
  const inputDescriptionData = inputDescription.value;
  inputDescription.value = '';

  if (inputTitleData !== '') {
    pushToDoToArray(inputTitleData, inputDescriptionData);
  }
  renderAllToDoItems();
};

const addButton = document.getElementById('btnAddTodo');
addButton.addEventListener('click', () => {
  handleAddButtonClick();
});

window.addEventListener('keypress', (event) => (event.key === 'Enter' ? handleAddButtonClick() : undefined));

renderAllToDoItems();
