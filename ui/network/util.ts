const getConfiguration = (
  method: "POST" | "GET" | "PATCH" | "PUT" | "DELETE" = "GET"
) => {
  const requestParam: RequestInit = {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    method,
  };

  return requestParam;
};

export { getConfiguration };
