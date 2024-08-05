function isEmptyObject(o: any | Record<string, any>) {
  if (!o) return true;

  return Object.keys(o).length === 0;
}

export { isEmptyObject };
