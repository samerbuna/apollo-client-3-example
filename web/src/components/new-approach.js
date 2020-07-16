import React, { useState } from "react";
import { gql } from "@apollo/client";

import { useActions } from "../store";
import Errors from "./errors";
import LoginOrSignup from "./login-or-signup";
import { APPROACH_FRAGMENT } from "./approach";

const APPROACH_CREATE = gql`
  mutation approachCreate($taskId: ID!, $input: ApproachInput!) {
    approachCreate(taskId: $taskId, input: $input) {
      errors {
        message
        field
      }
      approach {
        id
        ...ApproachFragment
      }
    }
  }

  ${APPROACH_FRAGMENT}
`;

export default function NewApproach({ taskId, onSuccess }) {
  const { getLocalAppState, mutate } = useActions();
  const [uiErrors, setUIErrors] = useState([]);

  const user = getLocalAppState("user");

  const handleNewApproachSubmit = async (event) => {
    event.preventDefault();
    setUIErrors([]);
    const input = event.target.elements;
    const { data, errors: rootErrors } = await mutate(
      APPROACH_CREATE,
      {
        variables: {
          taskId,
          input: {
            content: input.content.value,
          },
        },
      }
    );
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }

    const { errors, approach } = data.approachCreate;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
    onSuccess(approach);
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

  return (
    <div className="main-container">
      <div className="box box-primary">
        <form method="POST" onSubmit={handleNewApproachSubmit}>
          <div className="form-entry">
            <label>
              APPROACH
              <textarea name="content" placeholder="Be brief!" />
            </label>
          </div>
          <Errors errors={uiErrors} />
          <div className="spaced">
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
