// src/TaskManager.jsx
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export default function TaskManager({name}) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortAsc, setSortAsc] = useState(true);

  // 👇 Fetch tasks (GraphQL)
  async function fetchTasks() {
    try {
      const res = await client.graphql({
        query: `
          query ListTasks {
            listTasks {
              items {
                taskId
                title
                status
              }
            }
          }
        `,
        authMode: "userPool", // Cognito auth
      });
      setTasks(res.data.listTasks.items || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  // 👇 Add a new task
  async function addTask() {
    if (!newTaskTitle.trim()) return;
    try {
      await client.graphql({
        query: `
          mutation CreateTask($input: CreateTasksInput!) {
            createTasks(input: $input) {
              taskId
              title
              status
            }
          }
        `,
        variables: {
          input: {
            taskId: Date.now().toString(), // simple ID
            title: newTaskTitle,
            status: "pending",
          },
        },
        authMode: "userPool",
      });
      setNewTaskTitle("");
      await fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  // 👇 Mark a task as done
  async function markTaskDone(taskId) {
  try {
    await client.graphql({
      query: `
        mutation UpdateTask($input: UpdateTasksInput!) {
          updateTasks(input: $input) {
            taskId
            status
          }
        }
      `,
      variables: {
        input: { taskId, status: "done" },
      },
      authMode: "userPool",
    });
    await fetchTasks();
  } catch (err) {
    console.error("Error marking task done:", err);
  }
}


  // 👇 Delete a task
  async function deleteTask(taskId) {
  try {
    await client.graphql({
      query: `
        mutation DeleteTask($input: DeleteTasksInput!) {
          deleteTasks(input: $input) {
            taskId
          }
        }
      `,
      variables: {
        input: { taskId }, // 👈 must pass the primary key defined in schema
      },
      authMode: "userPool",
    });
    await fetchTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}


  useEffect(() => {
    fetchTasks();
  }, []);

  // 👇 Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortField === "title") {
      if (a.title < b.title) return sortAsc ? -1 : 1;
      if (a.title > b.title) return sortAsc ? 1 : -1;
      return 0;
    } else if (sortField === "status") {
      const orderA = a.status === "done" ? 1 : 0;
      const orderB = b.status === "done" ? 1 : 0;
      if (orderA < orderB) return sortAsc ? -1 : 1;
      if (orderA > orderB) return sortAsc ? 1 : -1;
      return 0;
    }
    return 0;
  });

  return (
    <div>
      <h2>My Tasks ({ name})</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTaskTitle}
          placeholder="Enter task title..."
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>
              Title{" "}
              <button
                onClick={() => {
                  setSortField("title");
                  setSortAsc(sortField === "title" ? !sortAsc : true);
                }}
              >
                {sortField === "title" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </th>
            <th>
              Status{" "}
              <button
                onClick={() => {
                  setSortField("status");
                  setSortAsc(sortField === "status" ? !sortAsc : true);
                }}
              >
                {sortField === "status" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((t) => (
            <tr key={t.taskId}>
              <td>{t.taskId}</td>
              <td>{t.title}</td>
              <td>{t.status === "done" ? "Done" : "Pending"}</td>
              <td>
                {t.status !== "done" && (
                  <button onClick={() => markTaskDone(t.taskId)}>Done</button>
                )}
                <button onClick={() => deleteTask(t.taskId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
