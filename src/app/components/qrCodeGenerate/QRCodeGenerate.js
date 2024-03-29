import React from "react";
import QRCode from "qrcode.react";

export const QRCodeG = ({ value, size = 72, onClick }) => {
  const [dataQr] = React.useState({
    value: value,
    size: Number(size) < 57 ? 57 : Number(size),
    bgColor: "#ffffff",
    fgColor: "#000000",
    level: "L",
    includeMargin: false,
    renderAs: "svg",
    imageSettings: {
      src: "https://www.geodipa.co.id/wp-content/uploads/2016/09/favicon.png",
      x: null,
      y: null,
      height: size < 70 ? 25 : 35,
      width: size < 70 ? 25 : 35,
      excavate: false,
    },
  });
  return (
    <QRCode
      value={dataQr.value}
      size={dataQr.size}
      bgColor={dataQr.bgColor}
      fgColor={dataQr.fgColor}
      level={dataQr.level}
      includeMargin={dataQr.includeMargin}
      renderAs={dataQr.renderAs}
      imageSettings={dataQr.imageSettings}
      className="pointer"
      onClick={() => {
        if (typeof onClick === "function") {
          onClick(dataQr.value);
          return;
        }
        var string = dataQr.value;
        if (string.indexOf("http") === 0) {
          window.open(dataQr.value, "_blank");
        }
      }}
    />
  );
};
