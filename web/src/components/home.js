import React from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";

import TaskSummary, { TASK_SUMMARY_FRAGMENT } from "./task-summary";
import Search from "./search";

const TASK_LIST = gql`
  query taskList {
    taskList {
      id
      ...TaskSummary
    }
  }

  ${TASK_SUMMARY_FRAGMENT}
`;

const TASK_LIST_CHANGED = gql`
  subscription taskListChanged {
    taskListChanged {
      id
      ...TaskSummary
    }
  }

  ${TASK_SUMMARY_FRAGMENT}
`;

export default function Home() {
  const { error, loading, data } = useQuery(TASK_LIST);

  const { data: subscriptionData } = useSubscription(
    TASK_LIST_CHANGED
  );

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const newTask = subscriptionData
    ? subscriptionData.taskListChanged
    : null;

  return (
    <div>
      <Search />
      <div>
        <h1>Latest</h1>
        {newTask && (
          <TaskSummary
            key={newTask.id}
            task={newTask}
            link={true}
            isHighlighted={true}
          />
        )}
        {data.taskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
