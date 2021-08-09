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

  const btnData = {
    client: {
      children: "Review Document",
      children2: "Unavailable",
      desc: "Tinjau kembali Delivery Order yang sudah ditandatangani.",
      desc2: "Vendor belum mengunggah Delivery order yang sudah ditandatangani",
      type: "review",
    },
    vendor: {
      children: "Upload Delivery Order",
      children2: "Unavailable",
      desc: "Unggah Delivery Order yang sudah ditandatangani.",
      desc2: "Pastikan semua item sudah disetujui",
      type: "upload",
    },
  };

  const usedBtn = btnData[authStatus];

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
                    <span>63%</span>
                  </p>
                  <div className="progress progress-sm">
                    <div
                      className="progress-bar bg-brand"
                      role="progressbar"
                      style={{ width: "75%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <ButtonContained
                  className={"mr-5"}
                  onClick={() => openModal(usedBtn.type)}
                  {...usedBtn}
                >
                  {usedBtn.children}
                </ButtonContained>
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
