const fetchPizzas = async () => {
  const result = await fetch("/api/pizzas", {
    credentials: "include",
    mode: "cors",
  });

  console.log(result);
};

export { fetchPizzas };
