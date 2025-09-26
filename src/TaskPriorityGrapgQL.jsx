import React, { useState } from "react";
import { generateClient } from "aws-amplify/api";
// import { fetchTasks } from "./api/fetchTasx";

export default function PrioritizeDemo({ tasks }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const client = generateClient();

  function extractTitles(data) {
    if (!Array.isArray(data)) return [];
    return data.map((t) => t.title);
  }
async function handlePrioritize() {
  setLoading(true);
  setError(null);

  try {
    const titles = extractTitles(tasks);

    const res = await client.graphql({
      query: `
        query PrioritizeTasks($tasks: [String!]!) {
          prioritizeTasks(tasks: $tasks) {
            task
            priorityRank
            reason
          }
        }
      `,
      variables: { tasks: titles },
      authMode: "userPool",
    });

    setResults(res.data.prioritizeTasks || []);
    
  } catch (err) {
    console.error("Error prioritizing tasksffdfdfd:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ padding: "20px" }}>
      <h2>🤖 AI Task Prioritization</h2>

      <h3>Input Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.taskId}>{t.title}</li>
        ))}
      </ul>

      <button onClick={handlePrioritize} disabled={loading}>
        {loading ? "Prioritizing..." : "Get AI Prioritization"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h3>Results</h3>
      {results.length > 0 ? (
        <ol>
          {results.map((r, i) => (
            <li key={i}>
              {r.task} (Priority {r.priorityRank})
              <br />
              <small>Reason: {r.reason}</small>
            </li>
          ))}
        </ol>
      ) : (
        !loading && <p>No prioritization yet.</p>
      )}
    </div>
  );
}
