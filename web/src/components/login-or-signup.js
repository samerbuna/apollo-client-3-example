import React, { useState } from "react";

import Login from "./login";
import Signup from "./signup";

export default function LoginOrSignup() {
  const [page, setPage] = useState("login");

  return (
    <div>
      <div className="tab-headers">
        <button
          onClick={() => setPage("login")}
          className={`btn btn-tab-header active-${page === "login"}`}
        >
          Login
        </button>
        <button
          onClick={() => setPage("signup")}
          className={`btn btn-tab-header active-${page === "signup"}`}
        >
          Create Account
        </button>
      </div>
      <div className="y-spaced">
        {page === "login" ? <Login embedded /> : <Signup embedded />}
      </div>
    </div>
  );
}
