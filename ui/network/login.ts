import { sendRequest } from "./util";

const login = async (username: string, password: string) => {
  const response = await sendRequest("/api/login?useCookies=true", "POST", {
    body: JSON.stringify({
      username,
      email: username,
      password,
    }),
  });
  return response.ok;
};

const logout = async () => {
  const response = await sendRequest("/api/logout", "POST", {
    body: JSON.stringify({}),
  });
  return response;
};

const fetchLoginStatus = async () => {
  try {
    const response = await sendRequest("/api/user/me", "GET", {});
    return response;
  } catch (error) {
    return false;
  }
};

export { login, logout, fetchLoginStatus };
