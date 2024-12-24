import { getConfiguration } from "./util";

const fetchPizzas = async () => {
  const networkConfig = getConfiguration("GET");
  const result = await fetch("/api/pizzas", networkConfig);

  return result.json();
};

export { fetchPizzas };
