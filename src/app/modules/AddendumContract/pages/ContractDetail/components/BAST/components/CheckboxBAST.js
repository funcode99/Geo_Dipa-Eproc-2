import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const CheckboxBAST = ({ checked, onCheck }) => {
  const handleCheck = React.useCallback(() => {
    if (typeof onCheck === "function") onCheck(!checked);
  }, [onCheck, checked]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleCheck}
          name="checkedB"
          color="primary"
        />
      }
      label={<FormattedMessage id="TITLE.BAST_APPROVED" />}
      //   label={"Dengan ini saya menyatakan kontrak telah selesai."}
    />
  );
};

export default CheckboxBAST;
