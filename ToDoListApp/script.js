document.addEventListener("DOMContentLoaded", function () {

    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const clearAllBtn = document.getElementById("clearAll");
    const taskCount = document.getElementById("taskCount");
    const filterButtons = document.querySelectorAll(".filters button");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    renderTasks();

    addBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") addTask();
    });

    clearAllBtn.addEventListener("click", function() {
        tasks = [];
        saveTasks();
        renderTasks();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelector(".filters .active").classList.remove("active");
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    function addTask() {
        const text = taskInput.value.trim();
        if (text === "") return;

        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = "";

        let filteredTasks = tasks.filter(task => {
            if (currentFilter === "completed") return task.completed;
            if (currentFilter === "pending") return !task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            let li = document.createElement("li");

            let span = document.createElement("span");
            span.textContent = task.text;
            if (task.completed) span.classList.add("completed");

            span.addEventListener("click", function() {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function() {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        taskCount.textContent = tasks.length + " Tasks";
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

});
