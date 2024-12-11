import { sendFetch } from "@/lib/common/util";
import { getConfiguration } from "./util";

const fetchPizzas = async () => {
  const networkConfig = getConfiguration("GET");
  const result = await sendFetch("/api/pizzas", networkConfig);

  return result.json();
};

export { fetchPizzas };
