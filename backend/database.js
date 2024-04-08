const sqlite3 = require("sqlite3").verbose();

//? Create database
const db = new sqlite3.Database("tasks.db");

db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        creataed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

const get_tasks = (callback) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

const create_task = (title, description, callback) => {
  const stmt = db.prepare(
    "INSERT INTO tasks (title, description) VALUES (?, ?)"
  );

  stmt.bind([title, description]);

  stmt.run((err) => {
    if (err) {
      console.error("Error creating task:", err);
      callback(err);
    } else {
      callback(0);
    }
  });

  stmt.finalize();
};

const delete_task = (id, callback) => {
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  stmt.bind([id]);
  stmt.run((err) => {
    if (err) {
      console.error("Error deleting task: ", err);
    } else {
      callback(null);
    }
  });
  stmt.finalize();
};

const edit_task = (title, description, id, callback) => {
  const stmt = db.prepare(
    "UPDATE tasks SET title = ?, description = ? WHERE id = ?"
  );
  stmt.bind([title, description, id]);

  stmt.run((err) => {
    if (err) {
      callback(new Error(`Error editing task: ${err.message}`));
    } else {
      if (stmt.changes === 0) {
        callback(new Error(`Task with ID ${id} not found`));
      } else {
        callback(null);
      }
    }
  });
  stmt.finalize();
};

const update_status = (id, status, callback) => {
  const stmt = db.prepare(`
    UPDATE tasks SET status = ? WHERE id = ?
  `);
  stmt.bind([status, id]);

  stmt.run((err) => {
    if (err) {
      callback(new Error("Error updating status", err));
    } else {
      callback(null);
    }
  });
};

module.exports = {
  get_tasks,
  create_task,
  delete_task,
  edit_task,
  update_status,
};
