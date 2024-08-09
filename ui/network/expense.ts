const fetchExpenses = async () => {
  const result = await fetch("/api/expenses");

  return result.json();
};

export { fetchExpenses };
