import React from "react";

const TitleField = ({ title, subTitle }) => {
  return (
    <div className="d-flex align-items-center mb-2">
      <div>
        <p className="fs-14 font-weight-bolder color-primary mb-2">{title}</p>
        {subTitle && (
          <p className="fs-14 font-weight-light gray-5">{subTitle}</p>
        )}
      </div>
    </div>
  );
};

TitleField.defaultProps = {
  title: "Kirim Judul",
  //   subTitle: "Kirim subTitle",
};

export default TitleField;
