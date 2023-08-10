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
  let locale;
  const options = {};

  options["currency"] = code;
  options["style"] = "currency";
  options["currencyDisplay"] = "symbol";

  amounts.forEach((amount) => {
    if(typeof(amount) === "undefined") amount = 0;
    if(typeof(amount) === "string") amount = amount * 1;
    total += amount;
  });

  switch(code) {
    case "IDR":
      locale = "id-ID"; 
      break;
    case "USD":
      locale = "en-US"; 
      break;
    default: 
      locale = "en-US"; 
      break;
  }

  return new Intl.NumberFormat(locale, options).format(total);
}

export const currencySign = (code) => {
  if(!code || code.isEmpty) return;
  const regex = /[0-9]+([,.][0-9]+)?/;
  const options = {};
  let locale;

  options["currency"] = code;
  options["style"] = "currency";
  options["currencyDisplay"] = "symbol";

  switch(code) {
    case "IDR":
      locale = "id-ID"; 
      break;
    case "USD":
      locale = "en-US"; 
      break;
    default: 
      locale = "en-US"; 
      break;
  }

  const result = new Intl.NumberFormat(locale, options).format(0);

  return result.replace(regex, "");
}

export const extractAmount = (value) => {
  if(!value || value.isEmpty) return;
  const regex = /^\D+/g;
  return value.replace(regex, "");
}

// export const extractAmount = (value) => {
//   const regex = /[0-9]+([,.][0-9]+)?/;
//   return value.replace(regex, "");
// }

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
