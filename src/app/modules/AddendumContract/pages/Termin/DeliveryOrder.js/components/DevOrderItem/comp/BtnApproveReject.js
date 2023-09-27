import { Button } from "react-bootstrap";
import React from "react";
import { FormattedMessage } from "react-intl";

const BtnApproveReject = ({ onChange, isActive, readOnly }) => {
  const [active, setActive] = React.useState(null);
  const handleActive = React.useCallback(
    (state) => {
      setActive(state);
      if (typeof onChange === "function") onChange(state);
    },
    [setActive, onChange]
  );

  const valueUsed = isActive !== undefined ? isActive : active;

  return (
    <div className={`d-flex justify-content-end mt-3`}>
      <Button
        onClick={() => handleActive(true)}
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          minWidth: 100,
        }}
        variant={`${
          valueUsed === false || valueUsed === null ? "outline-" : ""
        }success`}
        disabled={readOnly}
      >
        <FormattedMessage id="TITLE.APPROVE" />
      </Button>
      <Button
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          minWidth: 100,
        }}
        onClick={() => handleActive(false)}
        variant={`${
          valueUsed === true || valueUsed === null ? "outline-" : ""
        }danger`}
        disabled={readOnly}
      >
        <FormattedMessage id="TITLE.REJECT" />
      </Button>
    </div>
  );
};

export default BtnApproveReject;
