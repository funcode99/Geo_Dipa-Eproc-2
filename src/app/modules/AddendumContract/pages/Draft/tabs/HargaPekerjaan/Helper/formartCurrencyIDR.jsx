export const formatCurrencyIDR = (number) => {
  if (isNaN(number)) {
    return "Invalid Number";
  }

  const integerAmount = Math.floor(number);
  return integerAmount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
