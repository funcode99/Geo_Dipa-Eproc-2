import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
import { MODAL } from "../../../../../../service/modalSession/ModalService";
import DialogGlobal from "../../../../../components/modals/DialogGlobal";

const keys = "fetch_sync_sa";

const ModalAsyncSA = ({ innerRef }) => {
  const dispatch = useDispatch();
  const [entrysheet, setEntrysheet] = useState(false);
  const [terminId, setTerminId] = useState(false);
  const loading = useSelector((state) => getLoading(state, keys));
  const onSubmit = () => {
    if (!entrysheet) {
      MODAL.showSnackbar("Entry sheet is required.", "warning");
      return;
    }
    if (!terminId) {
      MODAL.showSnackbar("Entry termin ID is required.", "warning");
      return;
    }

    dispatch(
      fetch_api_sg({
        key: keys,
        url: `delivery/sap/get-sa-with-entrysheet`,
        alertAppear: "both",
        type: "post",
        params: {
          entrysheet: entrysheet,
          task_id: terminId,
        },
        onSuccess: () => {
          innerRef.current.close();
        },
      })
    );
  };
  const handleEntrysheetChange = (e) => {
    setEntrysheet(e.target.value);
  };
  const handleTeminIdChange = (e) => {
    setTerminId(e.target.value);
  };
  return (
    <DialogGlobal
      ref={innerRef}
      title={<FormattedMessage id="TITLE.SYNCHRONIZE" />}
      onYes={onSubmit}
      textYes={<FormattedMessage id={"TITLE.START_SYNC"} />}
      loading={loading}
      maxWidth={"xs"}
    >
      <div>
        <Form.Group style={{ width: "100%" }} className="mb-3 ">
          <Form.Label>Entrysheet</Form.Label>
          <Form.Control
            type="input"
            onChange={handleEntrysheetChange}
            placeholder="Masukkan entrysheet"
          />
        </Form.Group>
        <Form.Group style={{ width: "100%" }} className="mb-3 ">
          <Form.Label>Termin ID</Form.Label>
          <Form.Control
            type="input"
            onChange={handleTeminIdChange}
            placeholder="Masukkan Termin ID"
          />
        </Form.Group>
      </div>
    </DialogGlobal>
  );
};

ModalAsyncSA.defaultProps = {
  innerRef: null,
};

export default ModalAsyncSA;
