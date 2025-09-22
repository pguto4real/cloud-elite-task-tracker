import React, { useEffect, useState } from "react";
import { client } from "../services/graphql";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const result = await client.graphql({
          query: `query ListTasks {
            listTasks {
              items { id title status }
            }
          }`
        });
        setTasks(result.data.listTasks.items);
      } catch (err) {
        console.error("GraphQL error:", err);
      }
    }
    loadTasks();
  }, []);

  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id}>
          {t.title} — {t.status}
        </li>
      ))}
    </ul>
  );
}
