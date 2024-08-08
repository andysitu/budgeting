import { getConfiguration } from "./util";

const fetchPizzas = async () => {
  const networkConfig = getConfiguration();
  const result = await fetch("/api/pizzas", networkConfig);

  return result.json();
};

export { fetchPizzas };
