const format = (countryCode, currency, number) => {
  const options = {
    currency,
    style: "currency",
    currencyDisplay: "symbol",
  };

  return new Intl.NumberFormat(countryCode, options).format(number);
};

export const rupiah = (number) => format("id-ID", "IDR", number);

export const printMoney = (value, currentType) => {
  let options = {};
  switch (currentType) {
    case "USD":
      options.countryCode = "en-US";
      options.currency = "USD";
      break;

    default:
      options.countryCode = "id-ID";
      options.currency = "IDR";
      break;
  }

  return format(options.countryCode, options.currency, value);
};

export default format;
