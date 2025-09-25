// src/App.jsx
import React, { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

// import outputs from "./amplify_outputs.json";
import TaskManagerGraphQL from "./TaskManagerGraphQL";
import TaskManagerRest from "./TaskManagerRest";
import TaskPriority from "./TaskPriority";

// 👉 Configure Amplify with outputs.json
// Amplify.configure(outputs);

export default function App() {
  const [mode, setMode] = useState("graphql"); // "graphql" | "rest"

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
          {mode === "graphql" && <TaskManagerGraphQL name="graphQl" userId={user.userId}/>}
          {mode === "rest" && <TaskManagerRest name="ApiGateway"  userId={user.userId}/>}
          {/* <TaskPriority/> */}

          <button onClick={signOut} style={{ marginTop: "1rem" }}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}
