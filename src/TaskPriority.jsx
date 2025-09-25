import React, { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { post } from "aws-amplify/api";

export default function PrioritizeDemo() {
  const [tasks, setTasks] = useState([
    "Finish project report",
    "Buy groceries",
    "Prepare slides for Monday",
  ]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getAuthHeaders() {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async function handlePrioritize() {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();

      // 👇 Get the response object
      const response = await post({
        apiName: "TaskAPI", // must match your Amplify API config
        path: "/prioritize",
        options: { headers, body: { tasks } },
      }).response;

      // 👇 Parse JSON from response body
      const data = await response.body.json();

      console.log("Raw API data:", data);
      setResults(data.prioritization || []);
    } catch (err) {
      console.error("Error prioritizing tasksassasa:", err);
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
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
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
