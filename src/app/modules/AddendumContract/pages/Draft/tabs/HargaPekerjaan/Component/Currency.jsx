import Icon from "../Asset/Icon";
import React from "react";
import CurrencyInput from "react-currency-input-field";

const CustomCurrencyInput = ({ prefix, ...props }) => {
  return (
    <div style={{ position: "relative" }}>
      {prefix && (
        <div
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {prefix}
        </div>
      )}
      <CurrencyInput {...props} style={{ paddingLeft: "30px" }} />
    </div>
  );
};

const Currency = ({ title, value, currencyCode }) => {
  const currencies = {
    count: [{ code: "IDR" }, { code: "USD" }, { code: "EUR" }],
  };

  const headerData = {
    currency: currencyCode,
  };

  return (
    <div className="mt-2">
      <label>
        <p style={{ marginBottom: 14, fontSize: 16, fontWeight: 600 }}>
          {title}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={{ borderRadius: 4, padding: "10px 12px" }} disabled>
            {currencies?.count?.map((item) => (
              <option
                key={item.code}
                selected={item.code === headerData?.currency}
              >
                {item.code}
              </option>
            ))}
          </select>
          <CustomCurrencyInput
            className="form-control"
            prefix={<Icon />}
            style={{
              width: "100%",
              border: 1,
              borderStyle: "solid",
              borderColor: "#d1d1d1",
              backgroundColor: "#e8f4fb",
            }}
            placeholder="Please enter a number"
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            value={value}
            disabled
          />
        </div>
      </label>
    </div>
  );
};

export default Currency;
