import React, { forwardRef, useEffect, useMemo } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { Form } from "react-bootstrap";
import BasicInput from "../../../../../../components/input/BasicInput";
import TextAreaInput from "../../../../../../components/input/TextAreaInput";
import UploadInput from "../../../../../../components/input/UploadInput";
import { isEmpty } from "lodash";

const ApproveRejectBtn = forwardRef(
  ({ isDisabled, initialValue, initialRemarks, urlBAK }, ref) => {
    const [action, setAction] = React.useState("approve");
    const [remarks, setRemarks] = React.useState();
    const [BAK, setBAK] = React.useState();
    const isReject = action === "reject";
    const isApprove = action === "approve";
    const isBAKAvailable = useMemo(() => !isEmpty(urlBAK), [urlBAK]);
    const _changeAction = (type) => {
      setAction(type);
    };
    const handleRemarksChange = (e) => {
      setRemarks(e);
    };
    const handleBAKChange = (e) => {
      setBAK(e);
    };
    React.useImperativeHandle(ref, () => ({ isApprove, remarks, BAK }));
    useEffect(() => {
      setAction(Boolean(initialValue) ? "approve" : "reject");
    }, [initialValue]);

    useEffect(() => {
      setRemarks(initialRemarks || "");
    }, [initialRemarks]);

    return (
      <div>
        <ButtonGroup
          aria-label="Pick Action"
          disabled={isDisabled}
          style={{
            height: 38,
            // marginTop: 103,
            marginBottom: 24,
          }}
        >
          <Button
            onClick={() => _changeAction("approve")}
            variant={isApprove ? "contained" : undefined}
            className={isApprove ? "bg-success text-light" : ""}
          >
            Tepat Waktu
          </Button>
          <Button
            onClick={() => _changeAction("reject")}
            variant={isReject ? "contained" : undefined}
            className={isReject ? "bg-danger text-light" : ""}
          >
            Terlambat
          </Button>
        </ButtonGroup>
        {isReject && (
          <>
            <div className="form-group row">
              <label className={`col-sm-4 col-form-label`}>
                Berkas Berita Acara Kesepakatan Terlambat Pekerjaan
              </label>
              <div className={`col-sm-8`}>
                <UploadInput
                  value={
                    isBAKAvailable && isEmpty(BAK)
                      ? { path_preview: urlBAK }
                      : BAK
                  }
                  onChange={(eve) => handleBAKChange(eve)}
                  isPreview={isBAKAvailable}
                  //   classLabel={Boolean(!active) && "d-none"}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className={`col-sm-4 col-form-label`}>Remarks</label>
              <div className={`col-sm-8`}>
                <TextAreaInput
                  name={"remarks"}
                  label={"Remarks"}
                  onChange={handleRemarksChange}
                  typeInput={"TextAreaInput"}
                  value={remarks}
                  // value={remarks}
                  // disabled
                  //   defaultValue={remarks}
                />
              </div>
            </div>
          </>
        )}
        {/* {isReject && (
        <Form.Group
          style={{ width: "100%" }}
          className="my-3 "
          controlId="formBasicEmail"
        >
          <Form.Label>Keterangan pendukung</Form.Label>
          <Form.Control
            type="input"
            onChange={handleRemarksChange}
            placeholder="Masukkan Keterangan"
          />
        </Form.Group>
      )} */}
      </div>
    );
  }
);

export default ApproveRejectBtn;
