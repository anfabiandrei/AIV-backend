const filterByPlan = (plans, transactions) => {
  return transactions.filter(({ plans: items }) => {
    let includes = true;
    plans.forEach((plan) => {
      !items.includes(plan) && (includes = false);
    });
    return includes;
  });
};

module.exports = { filterByPlan };
