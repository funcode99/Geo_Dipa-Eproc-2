import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { object } from "yup";
import {
  fetch_api_sg,
  getAuthorizedUser,
  getLoading,
} from "../../../../../../redux/globalReducer";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../components/builder/FormBuilder";
import TitleField from "../../../../../components/input/TitleField";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import useToast from "../../../../../components/toast";
import { formatDate, formatInitialDate } from "../../../../../libs/date";
import { openLinkTab } from "../../../../../service/helper/urlHelper";
import validation from "../../../../../service/helper/validationHelper";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import AlertFormGR from "../DeliveryOrder.js/components/AlertFormGR";
import { TerminPageContext } from "../TerminPageNew/TerminPageNew";
import ModalPreview from "./components/ModalPreview";
import ModalUploadSigned from "./components/ModalUploadSigned";
import StepperDoc from "./components/StepperDoc";
import formData, { formData1, formData2 } from "./fieldData";
import _, { isEmpty } from "lodash";
import FieldBuilder from "../../../../../components/builder/FieldBuilder";
import ApproveRejectBtn from "./components/ApproveRejectBtn";
import AlertLate from "./components/AlertLate";
import apiHelper from "../../../../../service/helper/apiHelper";
import AdendumInput from "./components/AdendumInput";
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
  nomor_contract: validation.require("Dasar Pelaksanaan"),
  jenis: validation.require("Jenis Pekerjaan"),
  party1_name: validation.require("Direksi Pekerjaan"),
  party2_name: validation.require("Pejabat Berwenang"),
  party1_jabatan: validation.require("Pihak 1 Jabatan"),
  party2_jabatan: validation.require("Pihak 2 Jabatan"),
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
  handleChangeTab,
  userAuth,
  dataTask,
}) => {
  const { func, task_id, task_sa, task_gr } = React.useContext(
    TerminPageContext
  );
  const [Toast, setToast] = useToast();
  // const [taskNews, settaskNews] = React.useState({});
  const isReject = taskNews?.approve_status?.code === "rejected";
  const uploadRef = React.useRef();
  const approveRef = React.useRef();
  const rejectRef = React.useRef();
  const onTimeRef = React.useRef();
  const postGRRef = React.useRef();
  const adendumRef = React.useRef();
  const [lateData, setLateData] = React.useState([]);
  const [stepActive, setStepActive] = React.useState(null);
  const [loading, setLoading] = React.useState({
    get: false,
    submit: false,
  });
  const [dataSAGR, setDataSAGR] = React.useState({});
  const [taskNewsId, setTaskNewsId] = useState(null);
  const [exclude, setExclude] = React.useState([]);
  // const [open, setOpen] = React.useState({
  //   submit: false,
  //   tempParams: {},
  // });
  const [content, setContent] = React.useState([]);
  const isClient = status === "client";
  const isApproved = taskNews?.approve_status?.code === "approved";
  const initialValues = React.useMemo(
    () => ({
      nomor_bapp: taskNews?.no || "",
      tanggal_bapp: taskNews?.date || formatInitialDate(),
      jenis: contract?.contract_name,
      pelaksana:
        contract?.vendor_legal?.name + " " + contract?.vendor?.party?.full_name,
      nomor_contract: contract?.contract_no,
      nomor_po: contract?.purch_order_no,
      hasil_pekerjaan: taskNews?.review_text || "",
      party1_name: taskNews?.bapp_authorize_officer || "",
      party1_jabatan: taskNews?.bapp_authorize_position || "",
      party2_name:
        taskNews?.bapp_authorize_official_name ||
        contract?.contract_party?.party_2_autorize_name,
      party2_jabatan:
        taskNews?.bapp_authorize_official_position ||
        contract?.contract_party?.party_2_position,
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
  const dataExist = React.useMemo(
    () => ({
      sa: !_.isEmpty(dataSAGR?.sa),
      gr: !_.isEmpty(dataSAGR?.gr),
    }),
    [dataSAGR]
  );
  // const saExist = _.isEmpty(dataSAGR?.sa);
  // const grExist = _.isEmpty(dataSAGR?.gr);

  const isDisabled = React.useMemo(() => !isClient, [isClient]);

  const getDataSAGRForm = () => {
    fetchApi({
      key: keys.fetch_sagr,
      type: "get",
      url: `delivery/task-sa-gr/${task_id}`,
      onSuccess: (res) => {
        setDataSAGR(res.data);
      },
    });
  };

  const handleError = React.useCallback(
    (err) => {
      if (
        err.response?.code !== 400 &&
        err.response?.data.message !== "TokenExpiredError"
      ) {
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
      setExclude([""]);
    } else if (taskNews && taskNews?.review_text === null) {
      setExclude(["approve"]);
    }
  };

  const generateTableContent = (data) => {
    let dataArr = data?.map((item, id) => ({
      no: (id += 1),
      user: item?.user ? item?.user?.party?.full_name : item?.vendor?.full_name,
      date: formatDate(new Date(item?.createdAt)),
      // date: formatDateWTime(new Date(item?.createdAt)),
      activity: item?.description,
    }));
    setContent(dataArr);
  };

  const fetchData = React.useCallback(
    (toast = { visible: false, message: "" }) => {
      // handleLoading("get", true);
      // saveTask({});
      fetchApi({
        key: keys.fetch,
        type: "get",
        url: `/delivery/task/${taskId}/news`,
        onSuccess: (res) => {
          // handleLoading("get", false);
          setTaskNewsId(res.data?.news?.id);
          saveTask({ task_gr, task_sa, ...res.data });
          generateTableContent(res?.data?.news?.news_histories);
          updateExclude();
        },
      });
    },
    [taskId, saveTask, setTaskNewsId, task_gr, task_sa]
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
    // handleLoading("submit", true);
    const { isApprove, remarks, BAK } = onTimeRef.current;
    const { dataAdendum } = adendumRef.current;
    let params = {};
    let url = ``;
    // switch (status) {
    //   case "vendor":
    url = `delivery/task-news/${taskId}`;
    params = {
      // url: `delivery/task-news/${taskId}`,
      no: data.nomor_bapp,
      date: data.tanggal_bapp,
      review_text: data.hasil_pekerjaan,
      is_on_time: isApprove,
      remarks,
      contract_no: data.nomor_contract,
      party_1_director_position_full_name: data?.party1_name,
      party_1_director_position: data?.party1_jabatan,
      party_2_autorize_name: data?.party2_name,
      party_2_position: data?.party2_jabatan,
      bak: _.isEmpty(BAK) ? undefined : BAK.data,
      addendum_no: dataAdendum,
    };

    fetchApi({
      key: keys.submit,
      type: "postForm",
      params,
      url,
      alertAppear: "both",
      onSuccess: (res) => {
        // handleLoading("get", false);
        fetchData({ visible: true, message: res?.data?.message });
      },
      onFail: (err) => console.log("err baru", err),
    });
  };

  React.useEffect(() => {
    if (_.isEmpty(dataSAGR)) getDataSAGRForm();
    if (taskId !== "") {
      fetchData();
      handleApi("late_deliverable");
    }
  }, [taskId, fetchData]);

  // buat ganti state step
  React.useEffect(() => {
    // const isApproved = taskNews?.approve_status?.code === "approved";
    // setStepActive(1);
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
  }, [taskNews, isApproved]);

  let disabledInput = Object.keys(initialValues);
  let allowedClient = [
    "hasil_pekerjaan",
    "nomor_bapp",
    "tanggal_bapp",
    "jenis",
    "nomor_contract",
    "party1_name",
    "party1_jabatan",
    "party2_name",
    "party2_jabatan",
  ];
  let allowedVendor = [];

  // const handleVisible = (key, tempParams = {}) => {
  //   setOpen((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //     tempParams: { ...prev.tempParams, ...tempParams },
  //   }));
  // };

  const handleAction = (type, params) => {
    switch (type) {
      case "preview":
        openLinkTab(params?.file);
        // window.open(urlHelper.addBaseURL(params?.file), "_blank");
        break;
      case "preview_signed":
        openLinkTab(params?.file_upload);
        break;
      case "skip":
        setStepActive(1);
        // window.open(urlHelper.addBaseURL(params?.file), "_blank");
        break;
      case "uploadSign":
        // handleVisible(type);
        uploadRef.current.open();
        break;
      case "upload":
        break;
      case "approve":
        approveRef.current.open();
        break;
      case "reject":
        rejectRef.current.open();
        break;
      default:
        break;
    }
  };

  const handleApi = (type, params) => {
    switch (type) {
      case "upload_s":
        fetchApi({
          key: keys.upload_s,
          type: "postForm",
          alertAppear: "both",
          url: `/delivery/task-news/${taskNews?.id || taskNewsId}/upload`,
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
          url: `delivery/task-news/${taskNews?.id || taskNewsId}/status`,
          params: {
            approve_status_id: apiHelper.approveId,
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
          url: `delivery/task-news/${taskNews?.id || taskNewsId}/status`,
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
      case "late_deliverable":
        fetchApi({
          key: keys.late_deliv,
          type: "get",
          url: `delivery/task/${taskId}/document-late`,
          onSuccess: (res) => {
            const mappedData = res.data.map(
              (el) =>
                `${el?.document?.name} (${formatDate(new Date(el?.due_date))})`
            );
            setLateData(mappedData);
          },
        });
        break;

      default:
        break;
    }
  };

  const _fetchToSAP = (type) => {
    fetchApi({
      key: keys.post_to_sap,
      type: "post",
      alertAppear: "both",
      url: `delivery/sap/${type}/${task_id}`,
      onSuccess: (res) => {
        postGRRef.current.close();
      },
    });
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
          {!loadings.fetch ? (
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
              loading={loadings.submit}
              disabledButton={isDisabled}
              withSubmit={isClient}
              btnChildren={
                <React.Fragment>
                  {isClient && isApproved && (
                    <Dropdown
                      className="dropdown-inline mr-2"
                      drop="down"
                      alignRight
                    >
                      <Dropdown.Toggle
                        id="dropdown-toggle-top2"
                        variant="transparent"
                        className="btn btn-light-success btn-sm font-weight-bolder dropdown-toggle"
                      >
                        Post to SAP
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu dropdown-menu-md dropdown-menu-right">
                        <ul className="navi navi-hover">
                          <li className="navi-item">
                            <Dropdown.Item
                              // href="#"
                              className="navi-link"
                              onClick={() => _fetchToSAP("gr-101")}
                            >
                              <span className="navi-text">GR 101</span>
                            </Dropdown.Item>
                          </li>
                          <li className="navi-item">
                            <Dropdown.Item
                              // href="#"
                              className="navi-link"
                              onClick={() => _fetchToSAP("gr-103")}
                            >
                              <span className="navi-text">GR 103</span>
                            </Dropdown.Item>
                          </li>
                          <li className="navi-item">
                            <Dropdown.Item
                              // href="#"
                              className="navi-link"
                              onClick={() => _fetchToSAP("gr-105")}
                            >
                              <span className="navi-text">GR 105</span>
                            </Dropdown.Item>
                          </li>
                          <li className="navi-item">
                            <Dropdown.Item
                              // href="#"
                              className="navi-link"
                              onClick={() => _fetchToSAP("sa")}
                            >
                              <span className="navi-text">SA</span>
                            </Dropdown.Item>
                          </li>
                        </ul>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {(taskNews?.file_upload || taskNews?.file) && (
                    <Dropdown
                      className="dropdown-inline mr-2"
                      drop="down"
                      alignRight
                    >
                      <Dropdown.Toggle
                        id="dropdown-toggle-top2"
                        variant="transparent"
                        className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle"
                      >
                        <FormattedMessage id="TITLE.PREVIEW" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu dropdown-menu-md dropdown-menu-right">
                        <ul className="navi navi-hover">
                          <li className="navi-item">
                            <Dropdown.Item
                              // href="#"
                              className="navi-link"
                              onClick={() => handleAction("preview", taskNews)}
                            >
                              <span className="navi-icon">
                                <i className="flaticon2-graph-1"></i>
                              </span>
                              <span className="navi-text">Document</span>
                            </Dropdown.Item>
                          </li>
                          <li className="navi-item">
                            <Dropdown.Item
                              // href="#"
                              className="navi-link"
                              onClick={() =>
                                handleAction("preview_signed", taskNews)
                              }
                            >
                              <span className="navi-icon">
                                <i className="flaticon2-writing"></i>
                              </span>
                              <span className="navi-text">Signed Document</span>
                            </Dropdown.Item>
                          </li>
                        </ul>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </React.Fragment>
              }
            >
              {({ fieldProps }) => (
                <div>
                  <Row>
                    <Col>
                      <FieldBuilder formData={formData1} {...fieldProps} />
                      <AdendumInput
                        ref={adendumRef}
                        initAdendum={taskNews?.news_addendums}
                      />
                    </Col>
                    <Col>
                      <FieldBuilder formData={formData2} {...fieldProps} />
                      <ApproveRejectBtn
                        ref={onTimeRef}
                        isDisabled={isDisabled}
                        initialValue={dataTask?.is_on_time}
                        initialRemarks={dataTask?.remarks}
                        urlBAK={taskNews?.bak_file}
                      />
                      <AlertLate dataLate={lateData} />
                    </Col>
                  </Row>
                </div>
              )}
            </FormBuilder>
          ) : (
            <div />
          )}
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
                      {/* {!isClient  && */}
                      {
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleAction("uploadSign")}
                        >
                          <FormattedMessage id="TITLE.UPLOAD_SIGNED_DOCUMENT" />
                        </Button>
                      }
                      {/* <Button
                        variant="outlined"
                        color="secondary"
                        className={"ml-2"}
                        onClick={() => handleAction("preview", taskNews)}
                        disabled={taskNews ? false : true}
                      >
                        <FormattedMessage id="TITLE.PREVIEW" />
                      </Button> */}
                      <Dropdown
                        className="dropdown-inline ml-2"
                        drop="down"
                        alignRight
                      >
                        <Dropdown.Toggle
                          id="dropdown-toggle-top2"
                          variant="transparent"
                          className="btn btn-light-primary btn-sm font-weight-bolder dropdown-toggle"
                        >
                          <FormattedMessage id="TITLE.PREVIEW" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-md dropdown-menu-right">
                          <ul className="navi navi-hover">
                            <li className="navi-item">
                              <Dropdown.Item
                                // href="#"
                                className="navi-link"
                                onClick={() =>
                                  handleAction("preview", taskNews)
                                }
                              >
                                <span className="navi-icon">
                                  <i className="flaticon2-graph-1"></i>
                                </span>
                                <span className="navi-text">Document</span>
                              </Dropdown.Item>
                            </li>
                            <li className="navi-item">
                              <Dropdown.Item
                                // href="#"
                                className="navi-link"
                                onClick={() =>
                                  handleAction("preview_signed", taskNews)
                                }
                              >
                                <span className="navi-icon">
                                  <i className="flaticon2-writing"></i>
                                </span>
                                <span className="navi-text">
                                  Signed Document
                                </span>
                              </Dropdown.Item>
                            </li>
                          </ul>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  );
                case 2:
                  return (
                    <div className="mt-2">
                      {isClient && (
                        <React.Fragment>
                          {!dataExist.sa && !dataExist.gr && (
                            <AlertFormGR onClick={handleChangeTab} />
                          )}
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
                        </React.Fragment>
                      )}
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
                loading={loadings.fetch}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {/* <ModalApproveGR
        innerRef={postGRRef}
        gr={"GR 101"}
        onSubmit={() => _fetchToSAP("gr-101")}
      /> */}
    </React.Fragment>
  );
};

const keys = {
  upload_s: "upload-signed",
  approve_s: "approve-signed",
  fetch: "fetch_news_bapp",
  fetch_sagr: "fetch-sa-gr",
  submit: "submit_news_bapp",
  late_deliv: "late-deliverable-fetch",
  post_to_sap: "post_to_sap",
};

const mapState = (state) => {
  const { auth, deliveryMonitoring } = state;
  return {
    userAuth: getAuthorizedUser(state),
    status: auth.user.data.status,
    contract: deliveryMonitoring.dataContractById,
    taskNews: deliveryMonitoring.dataTask?.news,
    taskId: deliveryMonitoring.dataTask?.id,
    loadings: {
      upload_s: getLoading(state, keys.upload_s),
      approve_s: getLoading(state, keys.approve_s),
      fetch: getLoading(state, keys.fetch),
      submit: getLoading(state, keys.submit),
    },
    dataTask: deliveryMonitoring.dataTask,
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
