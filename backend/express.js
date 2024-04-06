const express = require("express");
const cors = require("cors");
const app = express();
const {
  get_tasks,
  create_task,
  delete_task,
  edit_task,
  update_status,
} = require("./database");
app.use(express.json());
app.use(cors());
// *Get tasks

app.get("/all_tasks", (req, res) => {
  get_tasks((err, tasks) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving tasks");
    } else {
      res.json(tasks);
    }
  });
});

// *Create task

app.post("/create_task", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).send("Please provide a title and description");
  }

  create_task(title, description, (err) => {
    if (err) {
      console.error("Error creating task:", err);
      return res.status(500).send({ code: 1, message: "Error creating task" });
    }

    console.log("Task created successfully");
    res.send({ code: 0, message: "Task created successfully" });
  });
});

// *Delete task

app.delete("/delete_task/:id", (req, res) => {
  const id = req.params.id;
  delete_task(id, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ code: 1, message: "Error deleting task" });
    }
    res.send({ code: 0, message: "Task deleted successfully" });
  });
});

// *Edit task

app.put("/edit_task/:id", (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  edit_task(id, title, description, (err) => {
    if (err) {
      return res.status(500).send({
        code: 1,
        message: `Task with ID ${id} not found or no changes where made.`,
      });
    }

    res.send({ code: 0, message: "Task edited successfully" });
  });
});

// *Update status
app.put("/edit_status/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  update_status(id, status, (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ code: 1, message: "Error changing status of task" });
    }
    res.send({ code: 0, message: `Status changed of task ${id}` });
  });
});

app.listen(3000, () => "Server listening: 3000");
