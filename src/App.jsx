// src/App.jsx
import React, { useState,useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { fetchTasks } from "./api/fetchTasx";
import { fetchTasksQl } from "./apiGraphQl/fetchTasks"
// import outputs from "./amplify_outputs.json";
import TaskManagerGraphQL from "./TaskManagerGraphQL";
import TaskManagerRest from "./TaskManagerRest";


// 👉 Configure Amplify with outputs.json
// Amplify.configure(outputs);

export default function App() {
  const [mode, setMode] = useState("graphql"); // "graphql" | "rest"
const [tasks, setTasks] = useState([]);
const [tasksQl, setTasksQl] = useState([]);



 async function loadTasks() {
    const data = await fetchTasks();
    console.log("i goth here")
    setTasks(data);
    console.log("i goth here")
  }
 async function loadTasksGraphQL() {
    const data = await fetchTasksQl();
    console.log(data)
    console.log("i goth here")
    setTasksQl(data);
    console.log("i goth here")
  }
  useEffect(() => {
    loadTasks();
    loadTasksGraphQL();
  }, []);
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: "1rem" }}>
          <h1>Hello {user?.signInDetails?.loginId} 👋</h1>

          {/* Toggle Backend */}
          <div style={{ marginBottom: "1rem" }}>
            <button onClick={() => setMode("graphql")}>
              Use GraphQL
            </button>
            <button onClick={() => setMode("rest")}>
              Use API Gateway
            </button>
          </div>

          {/* Render Task Manager depending on mode */}
          {mode === "graphql" && <TaskManagerGraphQL name="graphQl"  tasks={tasksQl} userId={user.userId} onTaskAddedQl={loadTasksGraphQL}/>}
          {mode === "rest" && <TaskManagerRest name="ApiGateway" tasks={tasks}  onTaskAdded={loadTasks} userId={user.userId}/>}
          

          <button onClick={signOut} style={{ marginTop: "1rem" }}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}
