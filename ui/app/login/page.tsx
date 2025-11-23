"use client";

import {
  handleLogin,
  handleLogout,
} from "@/lib/features/userAccount/userAccountSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchPizzas } from "@/network/pizzas";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import UrlLibrary from "../library/UrlLibrary";

function Login() {
  const { loggedIn } = useAppSelector((state) => state.userAccount);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasErrorLogin, setHaserrorLogin] = useState(false);

  return (
    <div>
      <div>Login</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const result = await dispatch(handleLogin({ username, password }));

            const success = result?.payload == true;

            if (success) {
              router.push(searchParams.get("ref") ?? UrlLibrary.HOME);
            } else {
              setHaserrorLogin(true);
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
        <button
          onClick={async () => {
            const response = await dispatch(handleLogout());
            console.log(response);
          }}
        >
          Logout
        </button>
      </div>

      {hasErrorLogin && (
        <div style={{ marginTop: "10px", color: "red" }}>
          There was an error logging in. Please make sure the username and
          password are correct.
        </div>
      )}
    </div>
  );
}

export default Login;
