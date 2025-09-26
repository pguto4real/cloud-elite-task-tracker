import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";

const client = generateClient();

export async function fetchTasksQl() {
  try {
    const user = await getCurrentUser();
    const userId = user.userId;

    const res = await client.graphql({
      query: `
        query ListTasks($filter: TableTasksFilterInput) {
          listTasks(filter: $filter) {
            items {
              taskId
              title
              status
              owner
            }
          }
        }
      `,
      variables: {
        filter: { owner: { eq: userId } },
      },
      authMode: "userPool",
    });

    return res.data.listTasks.items || [];
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}
