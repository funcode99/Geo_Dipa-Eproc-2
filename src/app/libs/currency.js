import { isEmpty } from "lodash";

const format = (countryCode, currency, number) => {
  const options = {
    currency,
    style: "currency",
    currencyDisplay: "symbol",
  };

  return new Intl.NumberFormat(countryCode, options).format(number);
};

export const rupiah = (number) => {
  // if (isEmpty(number)) return "";
  return format("id-ID", "IDR", number);
};

export const code_currency = (currency, number) => {
  // if (isEmpty(number)) return "";
  return format("id-ID", currency, number);
};

export const formatCurrency = (code, ...amounts) => {
  if(!code || code.isEmpty) return;
  let total = 0;
  const options = {};

  options["currency"] = code;
  options["style"] = "currency";
  options["currencyDisplay"] = "code";

  amounts.forEach((amount) => {
    if(typeof(amount) === "undefined") amount = 0;
    if(typeof(amount) === "string") amount = amount * 1;
    total += amount;
  });

  return new Intl.NumberFormat("id-ID", options).format(total);
}

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
