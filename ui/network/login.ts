const login = async (username: string, password: string) => {
  const response = await fetch("/api/login?useCookies=true", {
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
    credentials: "include",
  });

  return response.ok;
};

const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({}),
  });

  return response;
};

const fetchLoginStatus = async () => {
  try {
    const response = await fetch("/api/check_login_status", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

export { login, logout, fetchLoginStatus };
