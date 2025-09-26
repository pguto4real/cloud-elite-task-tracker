import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";

const client = generateClient();

export async function addTask(newTaskTitle) {
  if (!newTaskTitle.trim()) return null;

  try {
    const user = await getCurrentUser();

    const res = await client.graphql({
      query: `
        mutation CreateTask($input: CreateTasksInput!) {
          createTasks(input: $input) {
            taskId
            title
            status
            owner
          }
        }
      `,
      variables: {
        input: {
          taskId: Date.now().toString(),
          title: newTaskTitle,
          status: "pending",
          owner: user.userId,
        },
      },
      authMode: "userPool",
    });

    return res.data.createTasks;
  } catch (err) {
    console.error("Error creating task:", err);
    return null;
  }
}
