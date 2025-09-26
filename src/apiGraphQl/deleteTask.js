import { generateClient } from "aws-amplify/api";

const client = generateClient();

export async function deleteTask(taskId) {
  try {
    const res = await client.graphql({
      query: `
        mutation DeleteTask($input: DeleteTasksInput!) {
          deleteTasks(input: $input) {
            taskId
          }
        }
      `,
      variables: {
        input: { taskId },
      },
      authMode: "userPool",
    });

    return res.data.deleteTasks;
  } catch (err) {
    console.error("Error deleting task:", err);
    return null;
  }
}
