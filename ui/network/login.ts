const login = async (username: string, password: string) => {
  const response = await fetch("/api/account/login?useCookies=true", {
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
  return response;
};

export { login };
