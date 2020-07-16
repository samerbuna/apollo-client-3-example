import React, { useState, useEffect } from "react";

import { useActions } from "../store";
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from "./task-summary";

const MY_TASK_LIST = `
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
  const { request } = useActions();

  const [myTaskList, setMyTaskList] = useState(null);

  useEffect(() => {
    request(MY_TASK_LIST).then((resp) => {
      console.log(resp);

      setMyTaskList(resp.data.me.taskList);
    });
  }, [request]);

  if (!myTaskList) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>My Tasks</h1>

        {myTaskList.length === 0 && (
          <div className="box box-primary">
            You have not created any Task entries yet
          </div>
        )}

        {myTaskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
