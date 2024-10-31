import { getConfiguration } from "./util";

const fetchIncome = async () => {
  const requestParam = getConfiguration("GET");

  const result = await fetch("/api/income", requestParam);

  return result.json();
};

const deleteIncome = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/income/${id}`, requestParam);

  return result;
};

export { fetchIncome, deleteIncome };
