import React from "react";
import { FormattedMessage } from "react-intl";
import DialogGlobal from "../../../../../components/modals/DialogGlobal";

const ModalAsyncSAInfo = ({ innerRef }) => {
  const onUnderstand = () => innerRef.current.close();
  return (
    <DialogGlobal
      ref={innerRef}
      title={<FormattedMessage id="TITLE.FEATURES" />}
      onYes={onUnderstand}
      textYes={<FormattedMessage id="TITLE.UNDERSTAND" />}
      loading={false}
      isCancel={false}
      maxWidth={"xs"}
    >
      <div>
        <ul>
          <li>
            Melakukan Sinkronisasi Data berdasarkan nomor entrysheet dan id
            termin.
          </li>
        </ul>
      </div>
    </DialogGlobal>
  );
};

ModalAsyncSAInfo.defaultProps = {
  innerRef: null,
};

export default ModalAsyncSAInfo;
