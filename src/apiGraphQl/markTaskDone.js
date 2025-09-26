import { generateClient } from "aws-amplify/api";

const client = generateClient();

export async function markTaskDone(taskId) {
  try {
    const res = await client.graphql({
      query: `
        mutation UpdateTask($input: UpdateTasksInput!) {
          updateTasks(input: $input) {
            taskId
            status
          }
        }
      `,
      variables: {
        input: { taskId, status: "done" },
      },
      authMode: "userPool",
    });

    return res.data.updateTasks;
  } catch (err) {
    console.error("Error marking task done:", err);
    return null;
  }
}
