import { sendFetch } from "@/lib/common/util";
import { getConfiguration } from "./util";

const login = async (username: string, password: string) => {
  const requestParam = getConfiguration("POST");

  const response = await sendFetch("/api/login?useCookies=true", {
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

  const response = await sendFetch("/api/logout", {
    body: JSON.stringify({}),
    ...requestParam,
  });

  return response;
};

const fetchLoginStatus = async () => {
  const requestParam = getConfiguration("GET");

  try {
    const response = await sendFetch("/api/account/me", {
      ...requestParam,
    });

    return response.json();
  } catch (error) {
    return false;
  }
};

export { login, logout, fetchLoginStatus };
