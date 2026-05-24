import { useEffect } from "react";
import { v7 as uuidv7 } from "uuid";

function isEmptyObject(o: any | Record<string, any>) {
  if (!o) return true;

  return Object.keys(o).length === 0;
}

const useMount = (fn: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
};

const generateUUID = () => {
  return uuidv7();
};

const stringSorter = (a?: string, b?: string) => {
  const nameA = a?.toUpperCase() ?? "";
  const nameB = b?.toUpperCase() ?? "";
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

export { isEmptyObject, useMount, generateUUID, stringSorter };
