// src/api/fetchTasks.js
import { get } from "aws-amplify/api";
import { getAuthHeaders } from "./getAuthHeaders";

export async function fetchTasks() {
  try {
    const headers = await getAuthHeaders();

    const { body } = await get({
      apiName: "TaskAPI",
      path: "/tasks",
      options: { headers },
    }).response;

    return await body.json();
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
}
