import React, { useState } from "react";
import { gql } from "@apollo/client";

import { useActions } from "../store";
import Errors from "./errors";

const USER_CREATE = gql`
  mutation userCreate($input: UserInput!) {
    userCreate(input: $input) {
      errors {
        message
        field
      }
      user {
        id
        name
      }
      authToken
    }
  }
`;

export default function Signup({ embedded }) {
  const { mutate, setLocalAppState } = useActions();
  const [uiErrors, setUIErrors] = useState();
  const handleSignup = async (event) => {
    event.preventDefault();
    const input = event.target.elements;
    if (input.password.value !== input.confirmPassword.value) {
      return setUIErrors([{ message: "Password mismatch" }]);
    }
    const { data, errors: rootErrors } = await mutate(USER_CREATE, {
      variables: {
        input: {
          firstName: input.firstName.value,
          lastName: input.lastName.value,
          username: input.username.value,
          password: input.password.value,
        },
      },
    });
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    const { errors, user, authToken } = data.userCreate;
    if (errors.length > 0) {
      return setUIErrors(errors);
    }
    user.authToken = authToken;
    window.localStorage.setItem("azdev:user", JSON.stringify(user));
    const newState = { user };
    if (!embedded) {
      newState.component = { name: "Home" };
    }
    setLocalAppState(newState);
  };
  return (
    <div className="sm-container">
      <form method="POST" onSubmit={handleSignup}>
        <div>
          <div className="form-entry">
            <label>
              FIRST NAME
              <input type="text" name="firstName" required />
            </label>
          </div>
          <div className="form-entry">
            <label>
              LAST NAME
              <input type="text" name="lastName" required />
            </label>
          </div>
          <div className="form-entry">
            <label>
              USERNAME
              <input type="username" name="username" required />
            </label>
          </div>
        </div>
        <div>
          <div className="form-entry">
            <label>
              PASSWORD
              <input type="password" name="password" required />
            </label>
          </div>
          <div>
            <div className="form-entry">
              <label>
                CONFIRM PASSWORD
                <input
                  type="password"
                  name="confirmPassword"
                  required
                />
              </label>
            </div>
          </div>
        </div>
        <Errors errors={uiErrors} />
        <div className="spaced">
          <button className="btn btn-primary" type="submit">
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}
