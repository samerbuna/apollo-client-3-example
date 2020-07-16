import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { useActions } from "../store";
import Errors from "./errors";

const USER_LOGIN = gql`
  mutation userLogin($input: AuthInput!) {
    userLogin(input: $input) {
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

export default function Login({ embedded }) {
  const { setLocalAppState } = useActions();
  const [uiErrors, setUIErrors] = useState();

  const [loginUser, { error, loading }] = useMutation(USER_LOGIN);

  if (error) {
    return <div className="error">{error.message}</div>;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const input = event.target.elements;
    const { data, errors: rootErrors } = await loginUser({
      variables: {
        input: {
          username: input.username.value,
          password: input.password.value,
        },
      },
    });
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    const { errors, user, authToken } = data.userLogin;
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
      <form method="POST" onSubmit={handleLogin}>
        <div className="form-entry">
          <label>
            USERNAME
            <input type="text" name="username" required />
          </label>
        </div>
        <div className="form-entry">
          <label>
            PASSWORD
            <input type="password" name="password" required />
          </label>
        </div>
        <Errors errors={uiErrors} />
        <div className="spaced">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            Login {loading && <i className="spinner">...</i>}
          </button>
        </div>
      </form>
    </div>
  );
}
