import { isEmptyObject } from "@/lib/common/util";

type FetchRequest = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";

const getConfiguration = (method: FetchRequest = "GET") => {
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

const sendRequest = async (
  url: string | URL,
  sendType: FetchRequest,
  additionalParams?: Object
) => {
  let requestParam = getConfiguration(sendType);

  if (!isEmptyObject(additionalParams))
    Object.assign(requestParam, additionalParams);

  const result = await fetch(url, requestParam);

  const jsonResponse = await result.json();

  if (result.ok) {
    return jsonResponse;
  } else {
    throw new Error(jsonResponse?.title ?? "Error in network request");
  }
};

export { getConfiguration, sendRequest };
