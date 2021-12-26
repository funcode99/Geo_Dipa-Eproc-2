import React from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData1, formData2, formData3 } from "./fieldData";
import TableBuilder from "../../../../../../components/builder/TableBuilder";
import TitleField from "../../../../../../components/input/TitleField";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import { connect, useSelector } from "react-redux";
import { StyledTableRow } from "../../../../../../components/builder/TableBuilder/styledComponent";
import { Button, ButtonGroup, TableCell } from "@material-ui/core";
import * as deliveryMonitoring from "../../../../service/DeliveryMonitoringCrud";
import useToast from "../../../../../../components/toast";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import { formatDate } from "../../../../../../libs/date";
import { FormattedMessage } from "react-intl";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import urlHelper, {
  openLinkTab,
} from "../../../../../../service/helper/urlHelper";
import StepperDoc from "../../../Termin/BAPP/components/StepperDoc";
import ModalUploadSigned from "../../../Termin/BAPP/components/ModalUploadSigned";
import ModalPreview from "../../../Termin/BAPP/components/ModalPreview";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../../redux/globalReducer";
import { TerminPageContext } from "../../../Termin/TerminPageNew/TerminPageNew";
import _ from "lodash";

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
  // hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
  nomor_bast: validation.require("Nomor BAPP"),
  tanggal_bast: validation.require("Tanggal BAPP"),
});

const validationVendor = object().shape({
  nomor_bast: validation.require("Nomor BAPP"),
  tanggal_bast: validation.require("Tanggal BAPP"),
});

const RowNormal = ({ data }) => {
  return (
    <StyledTableRow>
      {data.map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {el}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

const BastPage = ({
  status,
  contract,
  taskNews,
  fetchApi,
  loadings_sg,
  saveContract,
  saveTask,
}) => {
  const { func, task_id, task_sa, task_gr } = React.useContext(
    TerminPageContext
  );
  const formikRef = React.useRef();
  const [Toast, setToast] = useToast();
  const isClient = status === "client";
  const uploadRef = React.useRef();
  const approveRef = React.useRef();
  const rejectRef = React.useRef();
  const [loadings, setLoadings] = React.useState({
    fetch: false,
    post: false,
  });
  const [stepActive, setStepActive] = React.useState(null);
  const isReject = taskNews?.approve_status?.code === "rejected";

  const handleLoading = React.useCallback(
    (key, state) => setLoadings((prev) => ({ ...prev, [key]: state })),
    [setLoadings]
  );
  const [content, setContent] = React.useState([]);
  const { news, contract_name, vendor, contract_no, purch_order_no } = contract;
  const initialValues = React.useMemo(
    () => ({
      nomor_bast: taskNews?.no || "",
      tanggal_bast: taskNews?.date,
      jenis: contract_name,
      pelaksana: vendor?.party?.full_name,
      nomor_contract: contract_no,
      nomor_po: purch_order_no,
      hasil_pekerjaan: "",
      select_example: {
        label: "isi",
        value: "value",
      },
    }),
    [taskNews, contract_name, vendor, contract_no, purch_order_no]
  );

  const fetchData = React.useCallback(
    (toast = { visible: false, message: "" }) => {
      console.log(`aja`);
      fetchApi({
        key: keys.fetch,
        type: "get",
        url: `/delivery/task/${task_id}/news`,
        onSuccess: (res) => {
          // handleLoading("get", false);
          console.log(`res`, res);
          saveTask({ task_gr, task_sa, ...res.data });
          generateTableContent(res?.data?.news_bast?.news_histories);
          // updateExclude();

          // uploadRef.current.close();
          // fetchData({ visible: false, message: "" });
        },
      });
      // fetchApi({
      //   keys: keys.fetch,
      //   type: "get",
      //   url: `/delivery/contract/${contract.id}`,
      //   onSuccess: (res) => {
      //     saveContract(res?.data);
      //   },
      // });
    },
    []
  );

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

  const generateTableContent = (data) => {
    console.log(`data`, data);

    let dataArr = data?.map((item, id) => ({
      no: (id += 1),
      user: item?.vendor?.username || item?.user?.username,
      date: formatDate(new Date(item?.createdAt)),
      activity: item?.description,
    }));

    setContent(dataArr);
  };

  const handleSuccess = React.useCallback(
    async (res) => {
      if (res?.data?.status === true) {
        const {
          data: { data },
        } = await deliveryMonitoring.getContractById(contract?.id);
        saveContract(data);
      }
    },
    [setToast]
  );

  const _handleSubmit = (data) => {
    // console.log(`data`, data);
    let params = {};
    let url = "";
    // switch (status) {
    //   case "vendor":
    //     url = `delivery/task-news/${contract?.id}/bast`;
    url = `delivery/task-news/${task_id}/bast`;
    params = {
      // url: `delivery/task-news/${contract?.id}/bast`,
      no: data.nomor_bast,
      date: data.tanggal_bast,
    };
    //     break;
    //   case "client":
    //     url = `delivery/task-news/${contract?.news?.id}/review`;
    //     params = {
    //       // url: `delivery/task-news/${contract?.news?.id}/review`,
    //       review_text: data.hasil_pekerjaan,
    //     };
    //     break;
    //   default:
    //     break;
    // }

    fetchApi({
      key: keys.submit,
      type: "post",
      params,
      alertAppear: "both",
      url,
      onSuccess: (res) => {
        // handleLoading("get", false);
        // console.log(`res`, res);
        fetchData();
      },
      onFail: (err) => console.log("err baru", err),
    });
    // console.log(`params`, params);
    // handleLoading("post", true);

    // deliveryMonitoring
    //   .postCreateBAST(params)
    //   .then(handleSuccess)
    //   .catch(handleError)
    //   .finally(() => {
    //     // setTimeout(() => {
    //     handleLoading("post", false);
    //     // }, 3000);
    //   });
  };

  React.useEffect(() => {
    // if (news && Array.isArray(news?.news_histories)) {
    //   generateTableContent(news.news_histories);
    // }
    // if (_.isEmpty(taskNews)) {
    fetchData();
    // }
  }, []);

  // buat ganti state step
  React.useEffect(() => {
    const isApproved = taskNews?.approve_status?.code === "approved";

    if (taskNews?.approve_status) {
      if (isApproved) setStepActive(3);
      else if (taskNews?.file_upload) {
        if (isReject) setStepActive(1);
        else setStepActive(2);
      } else if (taskNews?.file) {
        // if (taskNews?.review_text !== null) setStepActive(1);
        // else setStepActive(0);
        setStepActive(1);
      }
    }
  }, [taskNews]);

  let disabledInput = Object.keys(initialValues);
  let allowedClient = ["hasil_pekerjaan", "nomor_bast", "tanggal_bast"];
  let allowedVendor = [];

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
          url: `delivery/task-news/${taskNews.id}/status-bast`,
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
        loading={loadings_sg.upload_s}
        file={taskNews?.file_upload}
      />
      <ModalPreview
        innerRef={approveRef}
        handleSubmit={(e) => handleApi("approve", e)}
        loading={loadings_sg.approve_s}
        file={taskNews?.file_upload}
      />
      <ModalPreview
        innerRef={rejectRef}
        handleSubmit={(e) => handleApi("reject", e)}
        loading={loadings_sg.approve_s}
        withRemarks
        title={"Reject Signed Document"}
        file={taskNews?.file_upload}
      />
      {/* <Card>
        <CardBody> */}
      <Card>
        <CardBody>
          {/* <FieldBuilder readOnly formData={formData3} /> */}
          {loadings.fetch ? (
            <div />
          ) : (
            <FormBuilder
              // ref={formikRef}
              onSubmit={_handleSubmit}
              // formData={formData3}
              loading={loadings_sg.submit}
              initial={initialValues}
              validation={isClient ? validationClient : validationVendor}
              fieldProps={{
                readOnly: false,
                // disabledFields: disabledInput,
                disabledFields: disabledInput.filter((el) =>
                  isClient
                    ? !allowedClient.includes(el)
                    : !allowedVendor.includes(el)
                ),
              }}
              withSubmit={isClient}
              btnChildren={
                (taskNews?.file_upload || taskNews?.file) && (
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
                )
              }
            >
              {({ fieldProps }) => (
                <Row>
                  <Col>
                    <FieldBuilder formData={formData1} {...fieldProps} />
                  </Col>
                  <Col>
                    <FieldBuilder formData={formData2} {...fieldProps} />
                  </Col>
                </Row>
              )}
            </FormBuilder>
          )}
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <StepperDoc
            docType={"BAST"}
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
                      {!isClient && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleAction("uploadSign")}
                        >
                          <FormattedMessage id="TITLE.UPLOAD_SIGNED_DOCUMENT" />
                        </Button>
                      )}
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
              {/* <TableBuilder
                    hecto={10}
                    dataHead={[
                      "No BAST",
                      "Tanggal",
                      "Status",
                      "Approved by",
                      "Dokumen",
                      "Aksi",
                    ]}
                    dataBody={news?.task_news_histories}
                    renderRowBody={({ item, index }) => (
                      <RowNormal
                        key={index}
                        data={[
                          item?.history?.no,
                          formatDate(new Date(item?.updatedAt)),
                          "",
                          "",
                          "",
                          "",
                        ]}
                      />
                    )}
                  /> */}
              <TablePaginationCustom
                headerRows={tableHeader}
                rows={content}
                loading={loadings_sg.fetch}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {/* </CardBody>
      </Card> */}
    </React.Fragment>
  );
};

const keys = {
  upload_s: "upload-signed",
  approve_s: "approve-signed",
  // fetch: "get-data-contract-by-id",
  fetch: "fetch_news_bast",

  submit: "submit_news_bast",
};
const mapState = (state) => {
  const { auth, deliveryMonitoring } = state;
  return {
    status: auth.user.data.status,
    contract: deliveryMonitoring.dataContractById,
    // taskNews: deliveryMonitoring.dataContractById?.news,
    taskNews: deliveryMonitoring.dataTask?.news_bast,

    loadings_sg: {
      upload_s: getLoading(state, keys.upload_s),
      approve_s: getLoading(state, keys.approve_s),
      fetch: getLoading(state, keys.fetch),
      submit: getLoading(state, keys.submit),
    },
  };
};

export default connect(mapState, {
  saveContract: (payload) => ({
    type: actionTypes.SetContractById,
    payload: payload,
  }),
  fetchApi: (payload) => fetch_api_sg(payload),
  saveTask: (payload) => ({
    type: actionTypes.SetDataTask,
    payload: payload,
  }),
})(BastPage);
