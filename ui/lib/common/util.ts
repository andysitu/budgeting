import { useEffect } from "react";

function isEmptyObject(o: any | Record<string, any>) {
  if (!o) return true;

  return Object.keys(o).length === 0;
}

const useMount = (fn: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
};

const generateUUID = () => {
  return crypto.randomUUID();
};

async function sendFetch(...args: Parameters<typeof fetch>): Promise<any> {
  const response = await fetch(...args);

  const data = await response.json();

  if (!response.ok) {
    if (data?.title) {
      throw new Error(data.title);
    } else {
      throw new Error("Error sending fetch request");
    }
  }

  return data;
}

export { isEmptyObject, useMount, generateUUID, sendFetch };
