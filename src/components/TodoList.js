import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { CiWarning } from "react-icons/ci";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const allTasks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/all_tasks");
        setTodos(res.data);
        console.log(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    allTasks();
  }, []);

  const addTodo = async (todos) => {
    const newTodos = [...todos];

    setTodos(newTodos);
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }
    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const removeTodo = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/delete_task/${id}`);
      const removedArr = [...todos].filter((todo) => todo.id !== id);
      setTodos(removedArr);
      toast("Task deleted", {
        duration: 4000,
        icon: <CiWarning size={"1.5em"} />,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const changeStatus = (id) => {
    const updatedTasks = todos.map((item) => {
      if (item.id === id) {
        const status = item.status === 1 ? 0 : 1;
        try {
          axios.put(`http://localhost:3000/edit_status/${id}`, {
            status,
          });
          return { ...item, status };
        } catch (error) {
          console.error("Error updating task:", error);
          toast("Error updating status of task", {
            duration: 4000,
            icon: <CiWarning size={"1.5em"} />,
          });
          return item;
        }
      } else {
        return item;
      }
    });
    setTodos(updatedTasks);
  };

  return (
    <>
      <Toaster position="top-right" />
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={changeStatus}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
