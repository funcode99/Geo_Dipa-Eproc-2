import React from "react";
import { FormattedMessage } from "react-intl";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";

const ModalDelete = ({ innerRef, visible, onClose, onSubmit, loading }) => {
  return (
    <DialogGlobal
      ref={innerRef}
      title={<FormattedMessage id="CONTRACT_DETAIL.TABLE_ACTION.DELETE" />}
      textYes={<FormattedMessage id="BUTTON.DELETE" />}
      textNo={<FormattedMessage id="BUTTON.CANCEL" />}
      onYes={onSubmit}
      onNo={onClose}
      onClose={onClose}
      loading={loading}
      btnYesProps={{
        className: "bg-danger text-light",
      }}
      btnNoProps={{
        className: "bg-secondary text-black",
      }}
    >
      <div className="text-center">
        <h4>
          <FormattedMessage id="CONTRACT_DETAIL.MODAL_DELETE.TITLE" />
        </h4>
        <h6>
          <FormattedMessage id="CONTRACT_DETAIL.MODAL_DELETE.SUBTITLE" />
        </h6>
      </div>
    </DialogGlobal>
  );
};

export default ModalDelete;
