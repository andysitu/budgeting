"use client";

import { login, logout } from "@/network/login";
import { fetchPizzas } from "@/network/pizzas";
import { useEffect, useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchPizzas().catch((err) => {
      console.error("error fetchign pizzas", err);
    });
  }, []);

  return (
    <div>
      <div>Login</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await login(username, password);
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
        <button
          onClick={async () => {
            const response = await logout();
            console.log(response);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Login;
