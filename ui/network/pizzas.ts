import { sendRequest } from "./util";

const fetchPizzas = async () => {
  const result = await sendRequest("/api/pizzas", "GET");

  return result;
};

export { fetchPizzas };
