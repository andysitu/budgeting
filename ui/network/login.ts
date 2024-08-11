import { getConfiguration } from "./util";

const login = async (username: string, password: string) => {
  const requestParam = getConfiguration("POST");

  const response = await fetch("/api/login?useCookies=true", {
    method: "POST",
    body: JSON.stringify({
      username,
      email: username,
      password,
    }),
    ...requestParam,
  });

  return response.ok;
};

const logout = async () => {
  const requestParam = getConfiguration("POST");

  const response = await fetch("/api/logout", {
    method: "POST",
    body: JSON.stringify({}),
    ...requestParam,
  });

  return response;
};

const fetchLoginStatus = async () => {
  const requestParam = getConfiguration("GET");

  try {
    const response = await fetch("/api/account/me", {
      method: "GET",
      ...requestParam,
    });

    return response.json();
  } catch (error) {
    return false;
  }
};

export { login, logout, fetchLoginStatus };
