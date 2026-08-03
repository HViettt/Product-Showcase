const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount);
};