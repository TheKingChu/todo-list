document.addEventListener("DOMContentLoaded", () => {
    //by defualt the submit button is disabled
    document.querySelector("#submit").disabled = true;

    document.querySelector("#task").onkeyup = () => {
        if(document.querySelector("#task").value.length > 0){
            document.querySelector("#submit").disabled = false;
        }
        else{
            document.querySelector("#submit").disabled = true;
        }
    }

    document.querySelector("form").onsubmit = () => {
        const task = document.querySelector("#task").value;
        
        //create a list element to the ul element
        const li = document.createElement("li")
        li.innerHTML = task;

        //actually add the task and add that to the list
        document.querySelector("#tasks").append(li);

        //clear the input field after adding the task to the list
        document.querySelector("#task").value = "";
        //disable the submit button
        document.querySelector("#submit").disabled = true;

        //stop form from submitting
        return false;
    }
});