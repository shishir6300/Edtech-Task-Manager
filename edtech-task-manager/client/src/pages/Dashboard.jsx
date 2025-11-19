import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const res = await getTasks();
    if (res.data.success) setTasks(res.data.tasks);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await createTask({ title, description: desc, dueDate: due });
    setTitle("");
    setDesc("");
    setDue("");
    load();
  };

  const change = async (id, value) => {
    await updateTask(id, { progress: value });
    load();
  };

  const remove = async (id) => {
    await deleteTask(id);
    load();
  };

  const filtered =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.progress === filter);

  return (
    <div className="card">
      <h2>Dashboard</h2>

      <p>
        <strong>Role:</strong> {user.role}
        {user.role === "student" && user.teacherId
          ? ` | Teacher: ${user.teacherId}`
          : ""}
      </p>

      <form onSubmit={add} className="task-form">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button>Add Task</button>
      </form>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="not-started">Not started</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <hr />

      {filtered.map((t) => (
        <div key={t._id} className="task">
          <h3>{t.title}</h3>
          <p>{t.description}</p>
          <p>Due: {t.dueDate ? t.dueDate.slice(0, 10) : "—"}</p>

          <select
            value={t.progress}
            onChange={(e) => change(t._id, e.target.value)}
          >
            <option value="not-started">Not started</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          {t.userId === user.id && (
            <button onClick={() => remove(t._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}
