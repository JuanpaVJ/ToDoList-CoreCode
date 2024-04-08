import React, { useState, useEffect, useRef } from "react";
import { BsArrowDown, BsPlusCircleFill } from "react-icons/bs";
import { RiCheckboxCircleLine } from "react-icons/ri";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { CiWarning } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";

function TodoForm(props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : "");
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState(
    props.edit ? props.edit.description : ""
  );

  const inputRef = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setShowDescription(!showDescription);
  };

  const missingCamps = () => {
    toast("The task must have a title", {
      duration: 4000,
      icon: <CiWarning size={"1.5em"} />,
    });
  };

  const taskCreated = () => {
    toast("Task created successfully", {
      duration: 4000,
      icon: <FaCheck size={"1.5em"} />,
    });
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      let newTask = {
        title: e.currentTarget.title.value,
        description: showDescription ? e.currentTarget.description.value : "",
      };
      if (!newTask.title || /^\s*$/.test(newTask.title)) {
        missingCamps();
      }
      const res = await axios.post(
        "http://localhost:3000/create_task",
        newTask
      );
      const listRes = await axios.get("http://localhost:3000/all_tasks");
      props.onSubmit(listRes.data);
      setInput("");
      setDescription("");
      taskCreated();
    } catch (e) {
      console.error(e);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const body = {
        id: props.edit.id,
        title: e.currentTarget.title_edit.value,
        description: e.currentTarget.description_edit.value,
      };
      console.log(body);
      const res = await axios.put(
        `http://localhost:3000/edit_task/${props.edit.id}`,
        body
      );
      toast("Task edited successfully", {
        duration: 4000,
        icon: <FaCheck size={"1.5em"} />,
      });
    } catch (e) {
      console.error(e);
      toast("Error updating task.", {
        duration: 4000,
        icon: <CiWarning size={"1.5em"} />,
      });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {props.edit ? (
        <form onSubmit={updateTask} className="todo-form">
          <div className="todo-form--update">
            <input
              placeholder="Update your item"
              value={input}
              onChange={handleChange}
              name="title_edit"
              ref={inputRef}
              className="todo-input edit todo-description"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              name="description_edit"
              className="todo-input todo-description"
            />

            <button className="todo-button">
              <RiCheckboxCircleLine size={"2em"} />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={addTask}>
          <input
            placeholder="Add a todo"
            value={input}
            onChange={handleChange}
            name="title"
            className="todo-input"
            ref={inputRef}
          />
          <button onClick={handleDescription} className="todo-button edit">
            <BsArrowDown />
          </button>
          <button type="submit" className="todo-button">
            <BsPlusCircleFill />
          </button>
          {showDescription && (
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              name="description"
              className="todo-input todo-description"
            />
          )}
        </form>
      )}
    </>
  );
}

export default TodoForm;
