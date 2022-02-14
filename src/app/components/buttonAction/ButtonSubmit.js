import { Button, CircularProgress } from "@material-ui/core";
import React from "react";
import { Send } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";

const ButtonSubmit = ({ handleSubmit, loading, disabled, classBtn }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      size="medium"
      className={classBtn}
      onClick={handleSubmit}
      disabled={loading || disabled}
    >
      <span className="mr-1">
        <FormattedMessage id="BUTTON.SUBMIT" />
      </span>
      {loading ? (
        <CircularProgress size="0.875rem" color="inherit" />
      ) : (
        <Send />
      )}
    </Button>
  );
};

export default ButtonSubmit;
