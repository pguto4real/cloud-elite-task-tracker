import React, { useState } from "react";
import { client } from "../services/graphql";

export default function TaskForm() {
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;

    try {
      await client.graphql({
        query: `mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) {
            id
            title
            status
          }
        }`,
        variables: { input: { title, status: "pending" } }
      });

      setTitle("");
      alert("Task created!");
    } catch (err) {
      console.error("GraphQL error:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
