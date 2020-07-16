import React, { useState, useEffect } from "react";

import { useActions } from "../store";
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from "./task-summary";
import Search from "./search";

const TASK_LIST = `
  query taskList {
    taskList {
      id
      ...TaskSummary
    }
  }

  ${TASK_SUMMARY_FRAGMENT}
`;

export default function Home() {
  const { request } = useActions();
  const [taskList, setTaskList] = useState(null);

  useEffect(() => {
    request(TASK_LIST).then(({ data }) => {
      setTaskList(data.taskList);
    });
  }, [request]);

  if (!taskList) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Search />
      <div>
        <h1>Latest</h1>
        {taskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
