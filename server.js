const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files

// Connect to SQLite database
const db = new sqlite3.Database("./tasks.db");

// Get all tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { task, priority } = req.body;
  db.run(
    "INSERT INTO tasks (task, priority) VALUES (?, ?)",
    [task, priority],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, task, priority });
    }
  );
});

// Edit a task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.run("UPDATE tasks SET task = ? WHERE id = ?", [task, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, task });
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id });
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
