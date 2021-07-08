import { Button } from "react-bootstrap";
import React from "react";
import { FormattedMessage } from "react-intl";

const BtnApproveReject = ({ onChange }) => {
  const [active, setActive] = React.useState(null);
  const handleActive = React.useCallback(
    (state) => {
      setActive(state);
      if (typeof onChange === "function") onChange(state);
    },
    [setActive, onChange]
  );
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
          active === false || active === null ? "outline-" : ""
        }success`}
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
          active === true || active === null ? "outline-" : ""
        }danger`}
      >
        <FormattedMessage id="TITLE.REJECT" />
      </Button>
    </div>
  );
};

export default BtnApproveReject;
