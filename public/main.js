document.addEventListener("DOMContentLoaded", function () {
  const addTaskBtn = document.getElementById("add-task-btn");
  const tasksList = document.getElementById("task-list"); // Change this to "task-list"

  // Fetch tasks from the server
  const fetchTasks = async () => {
    const response = await fetch("http://localhost:3000/tasks"); // Change to "/tasks"
    const tasks = await response.json();
    displayTasks(tasks);
  };

  // Display tasks on the page
  const displayTasks = (tasks) => {
    tasksList.innerHTML = ""; // Clear the current task list

    tasks.forEach((item) => {
      const li = document.createElement("li"); // Use <li> instead of <div>
      const exclamations = getExclamations(item.priority);
      li.textContent = `${item.task} ${exclamations}`; // Display task and priority

      // Add styles based on priority
      if (item.priority === "low") {
        li.style.backgroundColor = "lightgreen";
      } else if (item.priority === "medium") {
        li.style.backgroundColor = "orange"; // More orangey color
      } else if (item.priority === "high") {
        li.style.backgroundColor = "lightcoral";
      }

      // Create Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = function () {
        editTask(item.id); // Pass the task id to edit
      };

      // Create Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = function () {
        deleteTask(item.id);
      };

      // Append task content and buttons to list item
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      // Append list item to task list
      tasksList.appendChild(li);
    });
  };

  const getExclamations = (priority) => {
    if (priority === "low") return "!";
    if (priority === "medium") return "!!";
    return "!!!"; // For high priority
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
    fetchTasks(); // Refresh the tasks list
  };

  const editTask = async (id) => {
    const newTask = prompt("Enter the new task text:"); // Prompt for new task text
    if (newTask) {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });
      fetchTasks(); // Refresh the tasks list
    }
  };

  // Add a new task
  addTaskBtn.addEventListener("click", async () => {
    const taskInput = document.getElementById("add-task").value;
    const priority = document.getElementById("priority").value;

    if (taskInput) {
      await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskInput, priority: priority }),
      });
      fetchTasks(); // Refresh the tasks list
      document.getElementById("add-task").value = ""; // Clear input field
    }
  });

  // Initial fetch of tasks
  fetchTasks();
});
