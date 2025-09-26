// src/api/markTaskDone.js
import { put } from "aws-amplify/api";
import { getAuthHeaders } from "./getAuthHeaders";

export async function markTaskDone(taskId) {
  try {
    const headers = await getAuthHeaders();

    await put({
      apiName: "TaskAPI",
      path: `/tasks/${taskId}`,
      options: { headers },
    }).response;

    return true; // success
  } catch (err) {
    console.error("Error marking task done:", err);
    throw err;
  }
}
