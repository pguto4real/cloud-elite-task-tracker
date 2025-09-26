// src/api/getAuthHeaders.js
import { fetchAuthSession } from "aws-amplify/auth";

export async function getAuthHeaders() {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken.toString();

    if (!token) {
      throw new Error("No valid auth token found");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch (err) {
    console.error("Error getting auth headers:", err);
    throw err;
  }
}
