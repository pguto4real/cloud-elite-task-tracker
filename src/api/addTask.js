// src/api/addTask.js
import { post } from "aws-amplify/api";
import { getAuthHeaders } from "./getAuthHeaders";

export async function addTask(newTaskTitle, userId) {
  if (!newTaskTitle.trim()) return;

  try {
    const headers = await getAuthHeaders();

    await post({
      apiName: "TaskAPI",
      path: "/tasks",
      options: {
        headers,
        body: { title: newTaskTitle, owner: userId, done: false },
      },
    }).response;

    return true; // success
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
}
