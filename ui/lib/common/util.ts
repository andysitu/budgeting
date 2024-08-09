import { useEffect } from "react";

function isEmptyObject(o: any | Record<string, any>) {
  if (!o) return true;

  return Object.keys(o).length === 0;
}

const useMount = (fn: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
};

export { isEmptyObject, useMount };
