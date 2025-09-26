// src/api/deleteTask.js
import { del } from "aws-amplify/api";
import { getAuthHeaders } from "./getAuthHeaders";

export async function deleteTask(taskId) {
  try {
    const headers = await getAuthHeaders();

    await del({
      apiName: "TaskAPI",
      path: `/tasks/${taskId}`,
      options: { headers },
    }).response;

    return true; // success
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
}
