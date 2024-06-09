"use client";

import { login } from "@/network/login";
import { fetchPizzas } from "@/network/pizzas";
import { useEffect, useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchPizzas();
  }, []);

  return (
    <div>
      <div>Login</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const response = await login(username, password);

            console.log(await response.json());
            console.log("response", response.body);

            const keys = response.headers.keys();
            const values = response.headers.values();

            for (const k in keys) {
              console.log(k);
            }

            for (const v in values) {
              console.log(v);
            }
          } catch (error) {
            console.error(error);
          }
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

      <div>
        <button
          onClick={async () => {
            const pizzas = await fetchPizzas();
            console.log(pizzas);
          }}
        >
          Pizza
        </button>
      </div>
    </div>
  );
}

export default Login;
