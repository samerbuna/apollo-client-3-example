import React from "react";
import { gql, useQuery } from "@apollo/client";

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

export default function Home() {
  const { error, loading, data } = useQuery(TASK_LIST);

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Search />
      <div>
        <h1>Latest</h1>
        {data.taskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
