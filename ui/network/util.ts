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

  const contentType = result.headers.get("content-type");
  if (result.ok) {
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }
    const jsonResponse = await result.json();
    return jsonResponse;
  } else {
    const resultText = await result.text();
    throw new Error(
      `Error: ${result.status}. Response: ${resultText.substring(0, 100)}...`
    );
  }
};

export { getConfiguration, sendRequest };
