import React from "react";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { FormattedMessage } from "react-intl";

const ModalDelete = ({ onClose, onSubmit, loading, data, innerRef }) => {
  return (
    <DialogGlobal
      ref={innerRef}
      onNo={onClose}
      title={<FormattedMessage id="TITLE.DELETE_DELIVERY_ORDER" />}
      textYes={<FormattedMessage id="BUTTON.DELETE" />}
      textNo={<FormattedMessage id="BUTTON.CANCEL" />}
      onYes={onSubmit}
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
          <FormattedMessage id="TITLE.MODAL_DELETE.TITLE" />
        </h4>
        <h6>
          <FormattedMessage id="TITLE.MODAL_DELETE.SUBTITLE" />
        </h6>
      </div>
    </DialogGlobal>
  );
};

export default ModalDelete;
