import React from "react";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const ModalApproveTermin = React.forwardRef(({}, ref) => {
  const [checked, setChecked] = React.useState(false);
  const [terminTitle, setTerminTitle] = React.useState("");
  const innerRef = React.useRef();

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };
  const _handleSubmit = () => {
    console.log(`submitted ====> NO FUNCTION`);
  };

  const _handleTerminTitle = (text) => {
    setTerminTitle(text);
    setTimeout(() => innerRef.current.open(), 50);
  };

  React.useImperativeHandle(ref, () => ({ open: _handleTerminTitle }));
  return (
    <DialogGlobal
      ref={innerRef}
      title={"Persetujuan Termin (UNDER DEVELOPMENT)"}
      textYes={"Terima"}
      textNo={"Batalkan"}
      onYes={_handleSubmit}
      btnYesProps={{
        className: checked ? "bg-primary text-light" : "bg-secondary",
        disabled: !checked,
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleCheck}
            name="checkedB"
            color="primary"
          />
        }
        label={`Dengan ini saya menyetujui termin \"${terminTitle}\" `}
      />
    </DialogGlobal>
  );
});

export default ModalApproveTermin;
