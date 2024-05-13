//load tasks from the local storage when the page loads in
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTask(task);
    });
}

//update local storage when a task i added or removed
function updateLocalStorage(){
    const tasks = [...document.querySelectorAll("#tasks li")].map(task => task.innerText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function checkDesktopView(){
    return window.innerWidth > 600;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    //variables for dragging detection for phone view task delete
    let startX;
    let startY;
    let distance;
    let threshold = 50; //min distance for the swipe to delete
    document.querySelector("#tasks").addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });
    document.querySelector("#tasks").addEventListener("touchmove", (event) => {
        if (!startX || !startY) {
            return;
        }

        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        distance = Math.abs(deltaX);

        // Check if swipe is horizontal and not vertical
        if (distance > Math.abs(deltaY)) {
            event.preventDefault(); // Prevent scrolling
            const listItem = event.target.closest("li");

            if (listItem) {
                listItem.style.transition = "none"; // Disable transition to improve performance
                listItem.style.transform = `translateX(${deltaX}px)`; // Move the task item horizontally
            }
        }
    });

    document.querySelector("#tasks").addEventListener("touchend", (event) => {
        if (distance >= threshold) {
            const listItem = event.target.closest("li");
            if (listItem) {
                listItem.remove(); // Delete the task item if the swipe distance exceeds the threshold
                updateLocalStorage();
                sortTasks();
            }
        } else {
            const listItem = event.target.closest("li");
            if (listItem) {
                listItem.style.transition = ""; // Re-enable transition
                listItem.style.transform = ""; // Reset the position of the task item
            }
        }

        startX = null;
        startY = null;
        distance = 0;
    });

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

    //function to add a new task to the list
    function addTask(task) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span>${task}</span>
            <button class="delete-button">X</button>
        `;
        document.querySelector("#tasks").appendChild(li);

        //delete task when the delete button is clicked
        li.querySelector(".delete-button").addEventListener("click", (event) => {
            event.stopPropagation();
            li.remove();
            updateLocalStorage();
        });

        //update local storage and sort tasks
        updateLocalStorage();
        sortTasks();
    }

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

        //flag variables to track if tasks exist for each category
        let hasIncompleteTasks = incompleteTasks.length > 0;
        let hasCompletedTasks = completedTasks.length > 0;

        //remove all tasks from the list
        taskList.innerHTML = "";

        //add incomplete tasks first
        if (hasIncompleteTasks) {
            const incompleteHeading = document.createElement("h2");
            incompleteHeading.textContent = "Uncompleted Tasks";
            taskList.appendChild(incompleteHeading);
            incompleteTasks.forEach(task => taskList.appendChild(task));
        }

        //add completed tasks next
        if (hasCompletedTasks) {
            const completedHeading = document.createElement("h2");
            completedHeading.textContent = "Completed Tasks";
            taskList.appendChild(completedHeading);
            completedTasks.forEach(task => taskList.appendChild(task));
        }

        //remove category titles if there are no tasks in the respective categories
        if (!hasIncompleteTasks) {
            const incompleteHeading = taskList.querySelector("h2");
            if (incompleteHeading && incompleteHeading.textContent === "Uncompleted Tasks") {
                incompleteHeading.remove();
            }
        }

        if (!hasCompletedTasks) {
            const completedHeading = taskList.querySelector("h2");
            if (completedHeading && completedHeading.textContent === "Completed Tasks") {
                completedHeading.remove();
            }
        }
    };

    //ddd new task to the list when the form is submitted (Desktop view)
    document.querySelector("#desktop-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const task = document.querySelector("#task").value.trim();
        if (task !== "") {
            addTask(task);
            document.querySelector("#task").value = "";
        }
    });

    //ddd new task to the list when the form is submitted (Phone view)
    document.querySelector("#phone-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const task = document.querySelector("#phone-task").value.trim();
        if (task !== "") {
            addTask(task);
            document.querySelector("#phone-task").value = "";
        }
    });

    //display phone form when button is clicked
    document.querySelector("#open-task").addEventListener("click", () => {
        document.querySelector("#phone-form").style.display = "block";
        document.querySelector("#open-task").style.display = "none";
    });

    //hide the phone form when task is submitted
    document.querySelector("#phone-submit").addEventListener("click", () => {
        document.querySelector("#phone-form").style.display = "none";
        document.querySelector("#open-task").style.display = "block";
    })

    function toggleFormVisibility(){
        const desktopForm = document.getElementById("desktop-form");
        const phoneForm = document.getElementById("open-task");

        if(checkDesktopView()){
            desktopForm.style.display = "block";
            phoneForm.style.display = "none";
        }
        else{
            desktopForm.style.display = "none";
            phoneForm.style.display = "block";
        }
    }
    toggleFormVisibility();
    window.addEventListener("resize", toggleFormVisibility);
});