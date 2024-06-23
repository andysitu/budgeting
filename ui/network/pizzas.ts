const fetchPizzas = async () => {
  const result = await fetch("/api/pizzas", {
    credentials: "include",
    mode: "cors",
  });

  return result.json();
};

export { fetchPizzas };
