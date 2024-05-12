//load tasks from the local storage when the page loads in
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTaskToList(task);
    });
}

//update local storage when a task i added or removed
function updateLocalStorage(){
    const tasks = [...document.querySelectorAll("#tasks li")].map(task => task.innerText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    //get todays date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    //update the html with todays date
    document.getElementById("todays-date").textContent = formattedDate;

    //by defualt the submit button is disabled
    document.querySelector("#submit").disabled = true;
    //enable submit button when there is a text input
    document.querySelector("#task").onkeyup = () => {
        if(document.querySelector("#task").value.length > 0){
            document.querySelector("#submit").disabled = false;
        }
        else{
            document.querySelector("#submit").disabled = true;
        }
    }

    //add new task to the list when the form is submitted
    document.querySelector("form").onsubmit = () => {
        const task = document.querySelector("#task").value;
        
        //create a list element to the ul element
        const li = document.createElement("li")
        li.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span>${task}</span>
        <button class="delete-button">X</button>
        `;

        //actually add the task and add that to the list
        document.querySelector("#tasks").append(li);

        //when button is clicked remove from list
        li.querySelector(".delete-button").onclick = (event) => {
            event.stopPropagation();
            li.remove();
            updateLocalStorage();
        };

        //clear the input field after adding the task to the list
        document.querySelector("#task").value = "";
        //disable the submit button
        document.querySelector("#submit").disabled = true;

        //update local storage
        updateLocalStorage();
        //sort the tasks
        sortTasks();

        //stop form from submitting
        return false;
    };

    //toggle task completion when task is clicked
    document.querySelector("#tasks").addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "LI" || target.tagName === "SPAN") {
        const listItem = target.tagName === "LI" ? target : target.parentElement;
        const checkbox = listItem.querySelector(".task-checkbox");
        checkbox.checked = !checkbox.checked; //toggle checkbox state
        listItem.classList.toggle("completed", checkbox.checked); //toggle completed class based on checkbox state
        updateLocalStorage();
        sortTasks();
    }
    });

    //toggle task completion when checkbox is clicked
    document.querySelector("#tasks").addEventListener("click", (event) => {
    if (event.target.classList.contains("task-checkbox")) {
        const checkbox = event.target;
        const listItem = checkbox.parentElement;
        listItem.classList.toggle("completed", checkbox.checked); //toggle completed class based on checkbox state
        updateLocalStorage();
        sortTasks();
    }
    });

    //sort tasks by completion status
    const sortTasks = () => {
        const taskList = document.querySelector("#tasks");
        const completedTasks = taskList.querySelectorAll("li.completed");
        const incompleteTasks = taskList.querySelectorAll("li:not(.completed)");

        //remove all tasks from the list
        taskList.innerHTML = "";

        //add incomplete tasks first
        if (incompleteTasks.length > 0) {
            const incompleteHeading = document.createElement("h2");
            incompleteHeading.textContent = "Uncompleted Tasks";
            taskList.appendChild(incompleteHeading);
            incompleteTasks.forEach(task => taskList.appendChild(task));
        }

        //add completed tasks next
        if (completedTasks.length > 0) {
            const completedHeading = document.createElement("h2");
            completedHeading.textContent = "Completed Tasks";
            taskList.appendChild(completedHeading);
            completedTasks.forEach(task => taskList.appendChild(task));
        }
    };
});