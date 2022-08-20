const state = {
  tasklist: [],
};

taskContents = document.querySelector(".task--content");
taskModal = document.querySelector(".task--modal-body");

const htmlTaskContents = ({ id, title, description, type, url }) =>
  `<div class="col-lg-6 col-md-4" id=${id} key=${id}>
        <div class="card shadow-sm task--card">
            <div class="card-header d-flex justify-content-end task--card-header">
                <button class="btn btn-outline-info mr-2" type="button" name=${id} onclick="editTask.apply(this , arguments)">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="btn btn-outline-danger mr-2" type="button" name=${id} onclick="deleteTask().apply(this,arguments)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="card-body">
                ${
                  url
                    ? `<img style = "width : 100%;" src=${url} alt="card image" class="card--image">`
                    : ``
                }
                <h4 class="task--card-title">${title}</h4>
                <p class="description trim-3-lines text-muted" data-gram_editor= "false">${description}</p>
                <div class="text-white tags d-flex flex-wrap">
                    <span class="badge bg-primary m-1">${type}</span>
                </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary
                 float-right" data-bs-toggle="modal" data-bs-target="#showTasks"
                id=${id} onclick="openTask.apply(this ,arguments)"
                 >Open Task</button>
            </div>
        </div>
    </div>`;
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
        <div id = ${id}>
        ${
          url &&
          `<img src=${url} style="width : 100%;" alt="card image" class="img-fluid place--holder--img">`
        }
        <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="lead">${description}</p>
        
        </div>


    `;
};

const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify({ tasks: state.tasklist }));
};

const LoadLocalStorage = () => {
  const LocalStorageCopy = JSON.parse(localStorage.tasks);

  if (LocalStorageCopy) state.tasklist = LocalStorageCopy.tasks;

  state.tasklist.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContents(cardData));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDesc").value,
    type: document.getElementById("tags").value,
  };
  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("Enter Details Correctly");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContents({ id, ...input })
  );

  state.tasklist.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  taskModal.innerHTML = htmlModalContent(
    state.tasklist.find(({ id }) => id === e.target.id)
  );
};

const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;

  const removeTask = state.tasklist.filter(({ id }) => id !== targetID);
  state.tasklist = removeTask;
  updateLocalStorage();
  console.log(e.target.parentNode.parentNode.parentNote);
  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const editTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  console.log(taskType);
  submitButton = parentNode.childNodes[5].childNodes[1];

  // console.log(taskDescription, taskTitle, taskType);

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.setAttribute("onclick", "saveEdited.apply(this , arguments)");
  submitButton.innerHTML = "Save Changes";
};

const saveEdited = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  // console.log(parentNode);

  let taskTitle = parentNode.childNodes[3].childNodes[3];
  console.log(taskTitle);
  let taskDescription = parentNode.childNodes[3].childNodes[5];
  console.log(taskDescription);
  let taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  console.log(taskType);
  let submitButton = parentNode.childNodes[5].childNodes[1];

  let stateCopy = state.tasklist;

  const UpdatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  stateCopy = stateCopy.map((task) => {
    if (task.id === targetID) {
      id: task.id;
      title: UpdatedData.taskTitle;
      description: UpdatedData.taskDescription;
      type: UpdatedData.taskType;
      url: task.url;
    } else {
      task;
    }

    state.tasklist = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTasks");
    submitButton.setAttribute("onclick", "openTask.apply(this,arguments)");
    submitButton.innerHTML = "Open Task";
  });
};

const searchTask = (e) => {
  if (!e) e = window.event;
  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.tasklist.filter(({ title }) => {
    return title.toUpperCase().includes(e.target.value.toUpperCase());
  });

  resultData.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContents(cardData));
  });
};
