import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../components/builder/FormBuilder";
import formData from "./fieldData";
import validation from "../../../../../service/helper/validationHelper";
import { object } from "yup";
import { Row, Col } from "react-bootstrap";
import TitleField from "../../../../../components/input/TitleField";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import { connect } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import {
  formatDate,
  formatDateWTime,
  formatInitialDate,
} from "../../../../../libs/date";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import useToast from "../../../../../components/toast";
import ButtonAction from "../../../../../components/buttonAction/ButtonAction";
import { RowNormal } from "./components";
import { Button, ButtonGroup } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import urlHelper, {
  openLinkTab,
} from "../../../../../service/helper/urlHelper";
import ModalUploadSigned from "./components/ModalUploadSigned";
import ModalPreview from "./components/ModalPreview";
import StepperDoc from "./components/StepperDoc";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../redux/globalReducer";
// import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";

const tableHeader = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "user",
    label: <FormattedMessage id="TITLE.USER" />,
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
  {
    id: "activity",
    label: <FormattedMessage id="TITLE.ACTIVITY" />,
  },
];

const validationClient = object().shape({
  hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
});

const validationVendor = object().shape({
  nomor_bapp: validation.require("Nomor BAPP"),
  tanggal_bapp: validation.require("Tanggal BAPP"),
});

const BappPage = ({
  status,
  taskId,
  fetchApi,
  contract,
  taskNews,
  saveTask,
  loadings,
}) => {
  const [Toast, setToast] = useToast();
  const isReject = taskNews?.approve_status?.code === "rejected";
  const uploadRef = React.useRef();
  const approveRef = React.useRef();
  const rejectRef = React.useRef();
  const [stepActive, setStepActive] = React.useState(null);
  const [loading, setLoading] = React.useState({
    get: false,
    submit: false,
  });
  const [open, setOpen] = React.useState({
    uploadSign: false,
  });
  const [exclude, setExclude] = React.useState([]);
  // const [open, setOpen] = React.useState({
  //   submit: false,
  //   tempParams: {},
  // });
  const [content, setContent] = React.useState([]);
  const isClient = status === "client";

  const initialValues = React.useMemo(
    () => ({
      nomor_bapp: taskNews?.no || "",
      tanggal_bapp: taskNews?.date || formatInitialDate(),
      jenis: contract?.contract_name,
      pelaksana: contract?.vendor?.party?.full_name,
      nomor_contract: contract?.contract_no,
      nomor_po: contract?.purch_order_no,
      hasil_pekerjaan: taskNews?.review_text || "",
    }),
    [taskNews, contract]
  );

  const clientMenu = React.useMemo(
    () => [
      {
        label: "TITLE.PREVIEW",
        icon: "far fa-file-pdf text-danger pointer",
        type: "preview",
        params: "",
      },
      {
        label: "TITLE.UPLOAD",
        icon: "fas fa-file-upload text-primary pointer",
        type: "upload",
        params: "",
      },
      {
        label: "TITLE.APPROVE",
        icon: "fas fa-check-circle text-success pointer",
        type: "approve",
        params: "",
      },
    ],
    []
  );

  const vendorMenu = React.useMemo(
    () => [
      {
        label: "TITLE.PREVIEW",
        icon: "far fa-file-pdf text-danger pointer",
        type: "preview",
        params: "",
      },
      {
        label: "TITLE.UPLOAD",
        icon: "fas fa-file-upload text-primary pointer",
        type: "upload",
        params: "",
      },
    ],
    []
  );

  const listUsed = status === "client" ? clientMenu : vendorMenu;
  const isDisabled = React.useMemo(() => isClient && !taskNews, [
    taskNews,
    isClient,
  ]);

  const handleError = React.useCallback(
    (err) => {
      if (
        err.response?.code !== 400 &&
        err.response?.data.message !== "TokenExpiredError"
      ) {
        console.log("handle error");
        setToast(err.response?.data.message, 5000);
      }
    },
    [setToast]
  );

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const updateExclude = () => {
    if (taskNews && taskNews?.review_text !== null) {
      // console.log(`review ada isinya`);
      setExclude([""]);
    } else if (taskNews && taskNews?.review_text === null) {
      // console.log(`review kosong`);
      setExclude(["approve"]);
    }
  };

  const generateTableContent = (data) => {
    // console.log(`data`, data);
    let dataArr = data.map((item, id) => ({
      no: (id += 1),
      user: item?.vendor?.username || item?.user?.username,
      date: formatDateWTime(new Date(item?.createdAt)),
      activity: item?.description,
    }));
    setContent(dataArr);
  };

  const fetchData = React.useCallback(
    (toast = { visible: false, message: "" }) => {
      handleLoading("get", true);
      // console.log();
      deliveryMonitoring
        .getTaskById(taskId)
        .then((res) => {
          // console.log(`res`, res);
          handleLoading("get", false);
          if (res.data.status === true) {
            saveTask(res?.data?.data);
            generateTableContent(res?.data?.data?.news?.news_histories);

            updateExclude();

            if (toast.visible === true) {
              setToast(toast.message, 5000);
            }
          }
        })
        .catch((err) => console.log("err", err));
    },
    [taskId, handleLoading, saveTask, setToast]
  );

  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        fetchData({ visible: true, message: res?.data?.message });
        // updateExclude();
      }
    },
    [fetchData]
  );

  const _handleSubmit = (data) => {
    handleLoading("submit", true);

    let params = {};
    switch (status) {
      case "vendor":
        params = {
          url: `delivery/task-news/${taskId}`,
          no: data.nomor_bapp,
          date: data.tanggal_bapp,
        };
        break;
      case "client":
        params = {
          url: `delivery/task-news/${taskNews?.id}/review`,
          review_text: data.hasil_pekerjaan,
        };
        break;
      default:
        break;
    }

    deliveryMonitoring
      .postCreateBAPP(params)
      .then((res) => handleSuccess(res))
      .catch((err) => handleError(err))
      .finally(handleLoading("submit", false));
  };

  React.useEffect(() => {
    if (taskId !== "") {
      // console.log(`masuk sini`);
      fetchData();
    }
  }, [taskId, fetchData]);

  // buat ganti state step
  React.useEffect(() => {
    const isApproved = taskNews?.approve_status?.code === "approved";

    if (taskNews?.approve_status) {
      if (isApproved) setStepActive(3);
      else if (taskNews?.file_upload) {
        if (isReject) setStepActive(1);
        else setStepActive(2);
      } else if (taskNews?.file) {
        if (taskNews?.review_text !== null) setStepActive(1);
        else setStepActive(0);
      }
    }
  }, [taskNews]);
  // console.log(`taskNews`, taskNews, loadings);

  let disabledInput = Object.keys(initialValues);
  let allowedClient = ["hasil_pekerjaan"];
  let allowedVendor = ["nomor_bapp", "tanggal_bapp"];

  // const handleVisible = (key, tempParams = {}) => {
  //   setOpen((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //     tempParams: { ...prev.tempParams, ...tempParams },
  //   }));
  // };

  const handleAction = (type, params) => {
    // console.log(`type`, type);
    // console.log(`params`, params);

    switch (type) {
      case "preview":
        openLinkTab(params?.file);
        // window.open(urlHelper.addBaseURL(params?.file), "_blank");
        break;
      case "skip":
        setStepActive(1);
        // window.open(urlHelper.addBaseURL(params?.file), "_blank");
        break;
      case "uploadSign":
        // console.log(`type`, type);
        // handleVisible(type);
        uploadRef.current.open();
        break;
      case "upload":
        // console.log(`type`, type);
        break;
      case "approve":
        // console.log(`type`, type);
        approveRef.current.open();
        break;
      case "reject":
        // console.log(`type`, type);
        rejectRef.current.open();
        break;
      default:
        break;
    }
  };

  const handleApi = (type, params) => {
    console.log(`type`, type, params);
    switch (type) {
      case "upload_s":
        fetchApi({
          key: keys.upload_s,
          type: "postForm",
          alertAppear: "both",
          url: `/delivery/task-news/${taskNews.id}/upload`,
          params: { file: params.data },
          onSuccess: () => {
            uploadRef.current.close();
            fetchData({ visible: false, message: "" });
          },
        });
        break;
      case "approve":
        fetchApi({
          key: keys.approve_s,
          type: "post",
          alertAppear: "both",
          url: `delivery/task-news/${taskNews.id}/status`,
          params: {
            approve_status_id: "5d28463c-a435-4ec3-b0dc-e8dcb85aa800",
          },
          onSuccess: (res) => {
            // this.handleRefresh();
            fetchData({ visible: false, message: "" });

            approveRef.current.close();
          },
        });
        break;
      case "reject":
        fetchApi({
          key: keys.approve_s,
          type: "post",
          alertAppear: "both",
          url: `delivery/task-news/${taskNews.id}/status`,
          params: {
            approve_status_id: "f11b1105-c234-45f9-a2e8-2b2f12e5ac8f",
            reject_text: params?.remarks,
          },
          onSuccess: (res) => {
            // this.handleRefresh();
            fetchData({ visible: false, message: "" });

            rejectRef.current.close();
          },
        });
        break;

      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Toast />
      <ModalUploadSigned
        innerRef={uploadRef}
        handleSubmit={(e) => handleApi("upload_s", e)}
        loading={loadings.upload_s}
        file={taskNews?.file_upload}
      />
      <ModalPreview
        innerRef={approveRef}
        handleSubmit={(e) => handleApi("approve", e)}
        loading={loadings.approve_s}
        file={taskNews?.file_upload}
      />
      <ModalPreview
        innerRef={rejectRef}
        handleSubmit={(e) => handleApi("reject", e)}
        loading={loadings.approve_s}
        withRemarks
        title={"Reject Signed Document"}
        file={taskNews?.file_upload}
      />

      {/* <ModalConfirmation
        visible={open.submit}
        onClose={() => handleVisible("submit")}
        onSubmit={(params) => handleApi(type, params)}
        {...other}
      /> */}

      <Card>
        <CardBody>
          {/* <div className="d-flex justify-content-between align-items-center w-100">
            <h2 className="mb-0">Berita Acara Pelaksanaan Pekerjaan</h2>
            {taskNews && (
              <ButtonAction
                label="TITLE.MORE"
                data={taskNews}
                ops={listUsed}
                handleAction={handleAction}
                exclude={exclude}
              />
            )}
          </div> */}

          <FormBuilder
            onSubmit={_handleSubmit}
            formData={formData}
            initial={initialValues}
            validation={isClient ? validationClient : validationVendor}
            fieldProps={{
              readOnly: false,
              disabledFields: disabledInput.filter((item) =>
                isClient
                  ? !allowedClient.includes(item)
                  : !allowedVendor.includes(item)
              ),
            }}
            loading={loading.submit}
            disabledButton={isDisabled}
          />
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <StepperDoc
            taskNews={taskNews}
            active={stepActive}
            isReject={isReject}
            renderBtns={(idx) => {
              switch (idx) {
                case 0:
                  return (
                    <div className="mt-2">
                      <Button
                        variant="contained"
                        color="secondary"
                        className={"mr-2"}
                        onClick={() => handleAction("preview", taskNews)}
                        disabled={taskNews ? false : true}
                      >
                        <FormattedMessage id="TITLE.PREVIEW" />
                      </Button>
                      {/* <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleAction("skip", taskNews)}
                        disabled={taskNews ? false : true}
                      >
                        <FormattedMessage id="TITLE.SKIP" />
                      </Button> */}
                    </div>
                  );
                case 1:
                  return (
                    <div className="mt-2">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleAction("uploadSign")}
                      >
                        <FormattedMessage id="TITLE.UPLOAD_SIGNED_DOCUMENT" />
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={"ml-2"}
                        onClick={() => handleAction("preview", taskNews)}
                        disabled={taskNews ? false : true}
                      >
                        <FormattedMessage id="TITLE.PREVIEW" />
                      </Button>
                    </div>
                  );
                case 2:
                  return (
                    <div className="mt-2">
                      <Button
                        variant="contained"
                        color="secondary"
                        className={"mr-3"}
                        onClick={() => handleAction("approve")}
                      >
                        <FormattedMessage id="TITLE.APPROVE" />
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={"bg-danger text-white"}
                        onClick={() => handleAction("reject")}
                      >
                        <FormattedMessage id="TITLE.REJECT" />
                      </Button>
                    </div>
                  );

                default:
                  return "Unknown step";
              }
            }}
          />
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          {/* <Row className="mb-5">
            <Col md={12}>
              <ButtonGroup size="medium" color="secondary" variant="contained">
                <Button
                  onClick={() => handleAction("preview", taskNews)}
                  disabled={taskNews ? false : true}
                >
                  <FormattedMessage id="TITLE.PREVIEW" />
                </Button>
                <Button onClick={() => handleAction("uploadSign")}>
                  <FormattedMessage id="TITLE.UPLOAD_SIGNED_DOCUMENT" />
                </Button>
                <Button onClick={() => handleAction("approve")}>
                  <FormattedMessage id="TITLE.APPROVE" />
                </Button>
              </ButtonGroup>
            </Col>
          </Row> */}
          <Row>
            <Col md={12}>
              <TitleField title={"History"} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <TablePaginationCustom
                headerRows={tableHeader}
                rows={content}
                loading={loading.get}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const keys = {
  upload_s: "upload-signed",
  approve_s: "approve-signed",
};

const mapState = (state) => {
  const { auth, deliveryMonitoring } = state;
  return {
    status: auth.user.data.status,
    contract: deliveryMonitoring.dataContractById,
    taskNews: deliveryMonitoring.dataTask?.news,
    taskId: deliveryMonitoring.dataTask?.id,
    loadings: {
      upload_s: getLoading(state, keys.upload_s),
      approve_s: getLoading(state, keys.approve_s),
    },
  };
};

const mapDispatch = (dispatch) => ({
  saveTask: (payload) => {
    dispatch({
      type: actionTypes.SetDataTask,
      payload: payload,
    });
  },
  fetchApi: (payload) => dispatch(fetch_api_sg(payload)),
});

export default connect(mapState, mapDispatch)(BappPage);
