let tasks = loadTasksFromLocalStorage();
let filter = "all"; // all, completed, pending

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (text === "") return alert("Please enter a task!");

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);
  input.value = "";
  saveTasksToLocalStorage();
  displayTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToLocalStorage();
  displayTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasksToLocalStorage();
  displayTasks();
}

function editTask(id) {
  const newText = prompt("Edit your task:");
  if (newText !== null && newText.trim() !== "") {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText.trim() } : task
    );
    saveTasksToLocalStorage();
    displayTasks();
  }
}

function setFilter(newFilter) {
  filter = newFilter;
  displayTasks();
}

function getFilteredTasks() {
  if (filter === "completed") return tasks.filter(task => task.completed);
  if (filter === "pending") return tasks.filter(task => !task.completed);
  return tasks;
}

function displayTasks() {
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-message");
  list.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if(filteredTasks.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(task.id);

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";
    if (task.completed) span.classList.add("completed");

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(task.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

window.onload = displayTasks;