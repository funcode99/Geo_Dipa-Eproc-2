import { Card, CardContent, Divider } from "@material-ui/core";
import React from "react";
import FormBuilder from "../../../../../../../components/builder/FormBuilder";
import ButtonContained from "../../../../../../../components/button/ButtonGlobal";
import ButtonSubmit from "../../../../../../../components/buttonAction/ButtonSubmit";
import CustomToolTip from "../../../../../../../components/tooltip/CustomToolTip/CustomToolTip";
import { formatDate } from "../../../../../../../libs/date";
import apiHelper from "../../../../../../../service/helper/apiHelper";
import { KEYS_TERMIN } from "../../../TerminPageNew/STATIC_DATA";
import { TerminPageContext } from "../../../TerminPageNew/TerminPageNew";
import CardOrderItem from "./comp/CardOrderItem";
import ModalPreviewDODoc from "./comp/ModalPreviewDODoc";
import ModalUploadDO from "./comp/ModalUploadDO";
import { formData } from "./formDataOItem";

const UploadButton = ({ title, onClick, desc, disabled, ...other }) => {
  return (
    <CustomToolTip title={desc} placement={"bottom"}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="btn-label-brand btn btn-sm btn-bold mr-5"
      >
        {title}
      </button>
    </CustomToolTip>
  );
};

const DevOrderItem = ({ data, isVendor, onRefresh, ...other }) => {
  const { func, loadings, authStatus } = React.useContext(TerminPageContext);

  const { handleAction } = other;
  const [visible, setVisible] = React.useState(false);
  const uploadRef = React.useRef();
  const previewRef = React.useRef();
  // const [itemForm, setItemForm] = React.useState({});

  // const usedBtn = btnData[authStatus];
  const fileReady = Boolean(data?.file);
  const isRejected =
    data?.file_approve_status_id === "f11b1105-c234-45f9-a2e8-2b2f12e5ac8f";
  const isApproved =
    data?.file_approve_status_id === "5d28463c-a435-4ec3-b0dc-e8dcb85aa800";

  React.useEffect(() => {
    if (Object.keys(data).length) setVisible(true);
    else setVisible(false);
  }, [data]);

  const values = React.useMemo(
    () => ({
      deliv_status: data?.approve_status?.name,
      deliv_status_remarks: data?.reject_text,
    }),
    [data]
  );
  const openModal = (type) => {
    console.log(`data`, data);
    switch (type) {
      case "review":
        previewRef.current.open();
        break;
      case "upload":
        uploadRef.current.open();
        break;
      default:
        break;
    }
  };

  const handleSubmit = (params) => {
    console.log(`params get`, params);
    func.handleApi({
      key: KEYS_TERMIN.p_t_upload_do,
      params: { file: params.data },
      url_id: data.id,
      onSuccess: (res) => {
        uploadRef.current.close();
        onRefresh();
      },
    });
  };
  const handleSubmitPreview = ({ remarks, action, clean }) => {
    let params = {};
    switch (action) {
      case "approve":
        params.file_approve_status_id = apiHelper.approveId;
        break;
      case "reject":
        params.file_approve_status_id = apiHelper.rejectId;
        params.file_reject_text = remarks;
        break;
      default:
        break;
    }
    console.log(`params`, params);
    func.handleApi({
      key: KEYS_TERMIN.p_t_approve_do_doc,
      params,
      url_id: data.id,
      onSuccess: (res) => {
        previewRef.current.close();
        onRefresh();
        clean();
      },
    });
  };
  const getPropsDeliv = () => {
    let params = {};
    if (!isVendor) {
      if (fileReady) {
        params = {
          children: "Review Document",
          desc: "Tinjau kembali Delivery Order yang sudah ditandatangani.",
          type: "review",
        };
      } else {
        params = {
          children: "Unavailable",
          desc: "File belum tersedia",
          disabled: true,
        };
      }
    } else {
      if (fileReady) {
        if (isRejected) {
          params = {
            children: "Re-Upload Delivery Order",
            desc: "Alasan penolakan : " + data.file_reject_text,
            type: "upload",
          };
        } else if (isApproved) {
          params = {
            children: "Done",
            type: "review",
          };
        } else {
          params = {
            children: "Waiting Review",
            type: "review",
            desc: "Menunggu persetujuan dokumen",
          };
        }
      } else {
        params = {
          children: "Upload Delivery Order",
          desc: "Unggah Delivery Order yang sudah ditandatangani.",
          type: "upload",
          disabled: Boolean(data?.percentage < 100),
        };
      }
    }
    return { ...params, onClick: () => openModal(params.type) };
  };

  console.log(`data devorderitem`, data);

  return (
    <React.Fragment>
      <ModalUploadDO
        innerRef={uploadRef}
        handleSubmit={handleSubmit}
        loading={loadings[KEYS_TERMIN.p_t_upload_do]}
      />
      <ModalPreviewDODoc
        innerRef={previewRef}
        handleSubmit={handleSubmitPreview}
        loading={loadings[KEYS_TERMIN.p_t_upload_do]}
        file={data.file}
        isClient={authStatus === "client"}
      />
      {visible && Object.keys(data).length && (
        <Card style={{ marginTop: 21 }}>
          <div className="kt-widget31 my-5">
            <div className="kt-widget31__item">
              <div className="kt-widget31__content">
                <div className="kt-widget31__info">
                  <p className="kt-widget31__username mb-0 ">{data?.name}</p>
                  <p className="kt-widget31__text">
                    {data?.date !== null
                      ? formatDate(new Date(data?.date))
                      : null}
                  </p>
                </div>
              </div>
              <div style={{ width: "50%" }} className="kt-widget31__content">
                <div className="kt-widget31__progress">
                  <p className="kt-widget31__stats">
                    <span>Progress</span>
                    <span>{`${data?.percentage}%`}</span>
                  </p>
                  <div className="progress progress-sm">
                    <div
                      className="progress-bar bg-brand"
                      role="progressbar"
                      style={{ width: `${data?.percentage}%` }}
                      aria-valuenow={`${data?.percentage}%`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                {/* <ButtonContained
                  className={"mr-5"}
                  onClick={() =>
                    openModal(fileReady ? usedBtn.type : usedBtn.type2)
                  }
                  {...usedBtn}
                >
                  {!isVendor
                    ? fileReady
                      ? usedBtn.children
                      : "Unavailable"
                    : !fileReady
                    ? usedBtn.children
                    : isRejected
                    ? usedBtn.children4
                    : isApproved
                    ? usedBtn.children3
                    : usedBtn.children2}
                </ButtonContained> */}
                <ButtonContained className={"mr-5"} {...getPropsDeliv()} />
                {!isVendor && (
                  <ButtonSubmit
                    classBtn={"mr-5"}
                    handleSubmit={() => handleAction("confirm", data)}
                  />
                )}
              </div>
            </div>
          </div>
          <Divider />
          <CardContent>
            <FormBuilder
              withSubmit={false}
              initial={values}
              formData={formData}
            />
            {/* <Row> */}
            {data?.task_delivery_items.map((el, id) => (
              <CardOrderItem
                key={id}
                data={el}
                isVendor={isVendor}
                {...other}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default DevOrderItem;
