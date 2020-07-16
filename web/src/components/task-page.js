import React, { useState } from "react";
import { gql, useApolloClient, useQuery } from "@apollo/client";

import { useActions } from "../store";
import Approach, { APPROACH_FRAGMENT } from "./approach";
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from "./task-summary";
import NewApproach from "./new-approach";

export const FULL_QUESTINO_FRAGMENT = gql`
  fragment FullTaskData on Task {
    id
    ...TaskSummary
    approachList {
      id
      ...ApproachFragment
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
  ${APPROACH_FRAGMENT}
`;

const TASK_INFO = gql`
  query taskInfo($taskId: ID!) {
    taskInfo(id: $taskId) {
      ...FullTaskData
    }
  }
  ${FULL_QUESTINO_FRAGMENT}
`;

export default function TaskPage({ taskId }) {
  const { AppLink } = useActions();
  const [showAddApproach, setShowAddApproach] = useState(false);
  const [
    highlightedApproachId,
    setHighlightedApproachId,
  ] = useState();

  const { error, loading, data } = useQuery(TASK_INFO, {
    variables: { taskId },
  });

  const client = useApolloClient();

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const { taskInfo } = data;

  const handleAppendNewApproach = (newApproach) => {
    client.writeQuery({
      query: TASK_INFO,
      variables: { taskId },
      data: {
        taskInfo: {
          ...taskInfo,
          approachList: [newApproach, ...taskInfo.approachList],
        },
      },
    });
    setHighlightedApproachId(newApproach.id);
    setShowAddApproach(false);
  };

  if (!taskInfo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <AppLink to="Home">{"<"} Home</AppLink>
      <TaskSummary task={taskInfo} />
      <div>
        <div>
          {showAddApproach ? (
            <NewApproach
              taskId={taskId}
              onSuccess={handleAppendNewApproach}
            />
          ) : (
            <div className="center y-spaced">
              <button
                onClick={() => setShowAddApproach(true)}
                className="btn btn-secondary"
              >
                + Add New Approach
              </button>
            </div>
          )}
        </div>
        <h2>Approaches ({taskInfo.approachList.length})</h2>
        {taskInfo.approachList.map((approach) => (
          <div key={approach.id} id={approach.id}>
            <Approach
              approach={approach}
              isHighlighted={highlightedApproachId === approach.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
