import React from "react";
import { gql, useQuery } from "@apollo/client";

import TaskSummary, { TASK_SUMMARY_FRAGMENT } from "./task-summary";

const MY_TASK_LIST = gql`
  query myTaskList {
    me {
      taskList {
        id
        ...TaskSummary
      }
    }
  }

  ${TASK_SUMMARY_FRAGMENT}
`;

export default function MyTasks() {
  const { error, loading, data } = useQuery(MY_TASK_LIST);

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>My Tasks</h1>

        {data.me.taskList.length === 0 && (
          <div className="box box-primary">
            You have not created any Task entries yet
          </div>
        )}

        {data.me.taskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
