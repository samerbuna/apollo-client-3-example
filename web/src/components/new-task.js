import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { useActions } from "../store";
import Errors from "./errors";
import LoginOrSignup from "./login-or-signup";

import { FULL_QUESTINO_FRAGMENT } from "./task-page";

const TASK_CREATE = gql`
  mutation taskCreate($input: TaskInput!) {
    taskCreate(input: $input) {
      errors {
        message
        field
      }
      task {
        id
        ...FullTaskData
      }
    }
  }

  ${FULL_QUESTINO_FRAGMENT}
`;

export default function NewTask() {
  const {
    getLocalAppState,
    setLocalAppState,
    AppLink,
  } = useActions();
  const [uiErrors, setUIErrors] = useState([]);

  const [createTask, { error, loading }] = useMutation(TASK_CREATE);

  const user = getLocalAppState("user");

  const handleNewTaskSubmit = async (event) => {
    event.preventDefault();
    const input = event.target.elements;
    const { data, errors: rootErrors } = await createTask({
      variables: {
        input: {
          content: input.content.value,
          tags: input.tags.value.split(","),
          isPrivate: input.isPrivate.checked,
        },
      },
    });
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    const { errors, task } = data.taskCreate;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
    setLocalAppState({
      component: {
        name: "TaskPage",
        props: { taskId: task.id },
      },
    });
  };

  if (!user) {
    return (
      <div>
        <h3>Please login or create account to continue</h3>
        <div className="box">
          <LoginOrSignup />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  return (
    <div className="main-container">
      <AppLink to="Home">{"<"} Cancel</AppLink>
      <div className="box box-primary">
        <form method="POST" onSubmit={handleNewTaskSubmit}>
          <div className="form-entry">
            <label>
              CONTENT
              <textarea
                name="content"
                placeholder="How to ____ or what is ____"
                required
              />
            </label>
          </div>
          <div className="form-entry">
            <label>
              TAGS
              <input
                type="text"
                name="tags"
                placeholder="Comma seperated words (JavaScript, git, react, ...)"
                required
              />
            </label>
          </div>

          <div className="form-entry">
            <label>
              <input type="checkbox" name="isPrivate" /> Make this a
              private entry (only for your account)
            </label>
          </div>
          <Errors errors={uiErrors} />
          <div className="spaced">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <i className="spinner">...</i>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
