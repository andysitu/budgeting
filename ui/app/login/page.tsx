"use client";

import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div>Login</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          console.log(
            JSON.stringify({
              username,
              email: username,
              password,
            })
          );

          const response = await fetch("/api/account/login", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              username,
              email: username,
              password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("response", response);
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username-input">Username</label>
          <input
            type="text"
            id="username-input"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="password-input">Password</label>
          <input
            type="password"
            id="password-input"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
