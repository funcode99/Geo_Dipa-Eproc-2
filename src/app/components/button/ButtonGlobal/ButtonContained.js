import React from "react";
import CustomToolTip from "../../tooltip/CustomToolTip/CustomToolTip";

const ButtonContained = ({
  children,
  onClick,
  desc,
  disabled,
  baseColor,
  ...other
}) => {
  return (
    <CustomToolTip title={desc} placement={"bottom"}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`btn-label-${baseColor} btn btn-sm btn-bold mr-5`}
      >
        {children}
      </button>
    </CustomToolTip>
  );
};

ButtonContained.defaultProps = {
  baseColor: "brand",
};

export default ButtonContained;
