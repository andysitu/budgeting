const getConfiguration = () => {
  const requestParam: RequestInit = {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return requestParam;
};

export { getConfiguration };
