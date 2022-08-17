const state = {
  tasklist: [],
};

taskContents = document.querySelector(".task--content");
taskModal = document.querySelector(".task--modal-body");

const htmlTaskContents = ({ id, title, description, type, url }) =>
  `<div class="col-lg-6 col-md-4" id=${id} key=${id}>
        <div class="card shadow-sm task--card">
            <div class="card-header d-flex justify-content-end task--card-header">
                <button class="btn btn-outline-info mr-2" type="button" name=${id}>
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="btn btn-outline-danger mr-2" type="button" name=${id}>
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
          `<img src=${url} alt="card image" class="img-fluid place--holder--img">`
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

  taskModal.innerHTML = htmlTaskContents(
    state.tasklist.find(({ id }) => id === e.target.id)
  );
};
