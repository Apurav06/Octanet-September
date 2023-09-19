// Initialize tasks array from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
    const taskCount = document.getElementById("taskCount");

    taskCount.textContent = `Total Tasks: ${tasks.length}`;
}


function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        const deadlineText = task.deadline ? `Deadline: ${task.deadline}` : "Deadline: Not specified";
        const isCompleted = task.completed ? "Completed" : "Not Completed";

        li.innerHTML = `
            <span class="task">${task.text}</span>
            <span class="priority ${task.priority}">${task.priority}</span>
            <span class="deadline">${deadlineText}</span>
            <span class="completion-status">${isCompleted}</span>
            <button class="edit-button" onclick="editTask('${task.id}')">
                <i class="fas fa-edit"></i> <!-- Edit icon -->
            </button>
            <button class="remove-button" onclick="removeTask('${task.id}')">
                <i class="fas fa-trash-alt"></i> <!-- Delete icon -->
            </button>
            <button class="complete-button" onclick="completeTask('${task.id}')">
            ${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
        </button>
        `;
        taskList.appendChild(li);
    });

    const taskCount = document.getElementById("taskCount");
    taskCount.textContent = `Total Tasks: ${tasks.length}`;
}

function filterTasks() {
    const filterSelect = document.getElementById("filterSelect");
    const selectedFilter = filterSelect.value;

    const searchInput = document.getElementById("searchTask");
    const searchQuery = searchInput.value.toLowerCase();

    // Apply both filter by status and search filter
    const filteredTasks = tasks.filter(task => {
        const taskText = task.text.toLowerCase();
        const isCompleted = selectedFilter === 'completed' ? task.completed : selectedFilter === 'uncompleted' ? !task.completed : true;
        return taskText.includes(searchQuery) && isCompleted;
    });

    // Render the filtered tasks
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<li>No matching tasks found.</li>";
    } else {
        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            const deadlineText = task.deadline ? `Deadline: ${task.deadline}` : "Deadline: Not specified";
            const isCompleted = task.completed ? "Completed" : "Not Completed";

            li.innerHTML = `
                <span class="task">${task.text}</span>
                <span class="priority ${task.priority}">${task.priority}</span>
                <span class="deadline">${deadlineText}</span>
                <span class="completion-status">${isCompleted}</span>
                <button class="edit-button" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i> <!-- Edit icon -->
                </button>
                <button class="remove-button" onclick="removeTask('${task.id}')">
                    <i class="fas fa-trash-alt"></i> <!-- Delete icon -->
                </button>
                <button class="complete-button" onclick="completeTask('${task.id}')">
                    ${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
                </button>
            `;
            taskList.appendChild(li);
        });
    }

    // Update the task count for filtered tasks
    const taskCount = document.getElementById("taskCount");
    taskCount.textContent = `Total Tasks: ${filteredTasks.length}`;
}

function addTask() {
    const taskInput = document.getElementById("task");
    const priorityInput = document.getElementById("priority");
    const deadlineInput = document.getElementById("deadline");
    const taskText = taskInput.value.trim();
    const priorityValue = priorityInput.value;
    const deadlineValue = deadlineInput.value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const currentDate = new Date();
    // Convert the entered deadline value to a Date object
    const selectedDate = new Date(deadlineValue);

    // Check if the selected date is not in the past
    if (selectedDate < currentDate) {
        alert("Deadline cannot be a past date.");
        return;
    }


    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        priority: priorityValue,
        deadline: deadlineValue || null, // Store null if no deadline provided
    };

    tasks.push(newTask);
    saveTasks();
    updateTaskCount();
    renderTasks();

    taskInput.value = "";
    deadlineInput.value = "";
}
function editTask(taskId) {
    // Find the task with the given taskId
    editedTask = tasks.find(task => task.id === taskId);

    if (!editedTask) {
        alert("Task not found");
        return;
    }

    // Populate the edit form with the task's current details
    const editTaskText = document.getElementById("editTaskText");
    const editTaskPriority = document.getElementById("editTaskPriority");
    const editTaskDeadline = document.getElementById("editTaskDeadline");

    editTaskText.value = editedTask.text;
    editTaskPriority.value = editedTask.priority;
    editTaskDeadline.type="date";
    editTaskDeadline.value = editedTask.deadline || '';

    // Show the modal dialog
    const editTaskModal = document.getElementById("editTaskModal");
    editTaskModal.style.display = "block";
}

function cancelEditTask() {
    // Hide the modal dialog without saving changes
    const editTaskModal = document.getElementById("editTaskModal");
    editTaskModal.style.display = "none";

    // Clear the edited task
    editedTask = null;
}


function saveEditedTask() {
    // Get the edited values from the edit form
    const editTaskText = document.getElementById("editTaskText").value;
    const editTaskPriority = document.getElementById("editTaskPriority").value;
    const editTaskDeadline = document.getElementById("editTaskDeadline").value;


    const currentDate = new Date();
    const selectedDate = new Date(editTaskDeadline);

    if (selectedDate < currentDate) {
        alert("Deadline cannot be a past date.");
        return;
    }

    // Update the edited task with the new values
    editedTask.text = editTaskText;
    editedTask.priority = editTaskPriority;
    editedTask.deadline = editTaskDeadline || null;

    // Save the updated tasks to localStorage
    saveTasks();

    // Hide the edit modal
    const editTaskModal = document.getElementById("editTaskModal");
    editTaskModal.style.display = "none";

    // Clear the edited task
    editedTask = null;

    // Update the task list and task count
    renderTasks();
    updateTaskCount();
}


function completeTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        alert("Task not found");
        return;
    }

    // Toggle the completion status
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks();
    renderTasks();
    
}

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    updateTaskCount();
    renderTasks();
}

function sortTasks(sortBy) {
    if (sortBy === 'priority') {
        tasks.sort((a, b) => {
            const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    } else if (sortBy === 'text') {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
    }

    renderTasks();
}
function searchTasks() {
    const searchInput = document.getElementById("searchTask");
    const searchQuery = searchInput.value.toLowerCase(); 

    const filteredTasks = tasks.filter(task => {
        const taskText = task.text.toLowerCase();
        return taskText.includes(searchQuery);
    });

    // Render the filtered tasks
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<li>No matching tasks found.</li>";
    } else {
        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            const deadlineText = task.deadline ? `Deadline: ${task.deadline}` : "Deadline: Not specified";
            const isCompleted = task.completed ? "Completed" : "Not Completed";

            li.innerHTML = `
                <span class="task">${task.text}</span>
                <span class="priority ${task.priority}">${task.priority}</span>
                <span class="deadline">${deadlineText}</span>
                <span class="completion-status">${isCompleted}</span>
                <button class="edit-button" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i> <!-- Edit icon -->
                </button>
                <button class="remove-button" onclick="removeTask('${task.id}')">
                    <i class="fas fa-trash-alt"></i> <!-- Delete icon -->
                </button>
                <button class="complete-button" onclick="completeTask('${task.id}')">
                    ${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
                </button>
            `;
            taskList.appendChild(li);
        });
    }

    // Update the task count for filtered tasks
    const taskCount = document.getElementById("taskCount");
    taskCount.textContent = `Total Tasks: ${filteredTasks.length}`;
}

const searchInput = document.getElementById("searchTask");
searchInput.addEventListener("input", searchTasks);

// Initial rendering of tasks
updateTaskCount();
renderTasks();



