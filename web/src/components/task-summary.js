import React from "react";

import { useActions } from "../store";

export const TASK_SUMMARY_FRAGMENT = `
  fragment TaskSummary on Task {
    content
    author { name }
    tags
  }
`;

export default function TaskSummary({ task, link = false }) {
  const { AppLink } = useActions();

  return (
    <div className="box box-primary">
      {link ? (
        <AppLink to="TaskPage" taskId={task.id}>
          {task.content}
        </AppLink>
      ) : (
        task.content
      )}
      <div className="box-footer">
        <div className="text-secondary">{task.author.name}</div>
        <div className="tags">
          {task.tags.map((tag) => (
            <span key={tag} className="box-label">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
