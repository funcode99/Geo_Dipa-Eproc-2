import React, { useState, useEffect, useCallback } from "react";
import {
  connect,
  // shallowEqual,
  // useSelector
} from "react-redux";
import { makeStyles } from "@material-ui/core";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "../style";
import {
  getEmail,
  getListSchedule,
  getListParameter,
  getListEmailCc,
  updateEmail,
} from "../../service/MasterCrud";
import useToast from "../../../../components/toast";
import { Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import StyledSelect from "../../../../components/select-multiple";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import Select from "react-select";
import {
  // useHistory,
  useParams,
} from "react-router-dom";
// import ReactHtmlParser, {
//   processNodes,
//   convertNodeToElement,
//   htmlparser2,
// } from "react-html-parser";
import TextEditor from "../../../../components/textEditor/TextEditor";
import copy from "clipboard-copy";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));
const ItemEmail = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [valueText, setValueText] = useState("");
  const [optionSchedule, setOptionSchedule] = useState([]);
  const [optionParameter, setOptionParameter] = useState([]);
  const [optionEmailCc, setOptionEmailCc] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState({});
  const [onSubmit, setOnSubmit] = useState(false);
  const [statusSubmit, setStatusSubmit] = useState(false);
  const [errOnSubmit, setErrOnSubmit] = useState(false);

  const sendUpdate = useCallback(
    (e) => {
      e.preventDefault();
      let dataRequest = Object.assign({}, data);
      dataRequest.body = valueText;
      dataRequest.updated_at = window
        .moment(new Date())
        .format("YYYY-MM-DD HH:mm:ss");
      setOnSubmit(true);
      setErrOnSubmit(false);
      updateEmail(dataRequest)
        .then((result) => {
          setStatusSubmit(true);
          setTimeout(() => {
            setOnSubmit(false);
            setStatusSubmit(false);
            //   requestFilterSort();
          }, 2000);
        })
        .catch((err) => {
          setOnSubmit(false);
          setErrOnSubmit(true);
        });
    },
    [data, valueText]
  );

  const customStyles = {
    control: (styles) => ({
      ...styles,
      border: "1px solid #EBEDF3 !important",
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    }),
  };

  const callAPI = useCallback(() => {
    getEmail(id)
      .then((result) => {
        if (result.data.data.schedules) {
          getListSchedule()
            .then((results) => {
              setOptionSchedule(results.data.data);
            })
            .catch((err) => {
              setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
            });
        }
        setData(result.data.data);
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
    getListParameter()
      .then((result) => {
        setOptionParameter(result.data.data);
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
    getListEmailCc()
      .then((result) => {
        setOptionEmailCc(result.data.data);
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, []);

  useEffect(callAPI, []);

  const handleTextArea = (value) => {
    setValueText(value);
  };

  const copyString = () => {
    if (selectedParameter.id) {
      copy(selectedParameter.value);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5 w-75">
          <h2 className="text-dark font-weight-bold my-2 mr-5 text-truncate">
            {data.name || "-"}
          </h2>
        </div>
      </div>

      <SubBreadcrumbs
        items={[
          {
            label: "List Email",
            to: `/client/master/email`,
          },
          {
            label: "Email",
            to: "/",
          },
        ]}
      />
      <Card>
        <CardBody>
          <Toast />
          <Form id="emailData" onSubmit={sendUpdate}>
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Form.Label column md="2">
                    <FormattedMessage id="TITLE.NAME" />
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      disabled={true}
                      defaultValue={data.name}
                      onChange={(e) => {}}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="2">
                    Parameter
                  </Form.Label>
                  <Col sm="10">
                    <InputGroup className="mb-3">
                      <Select
                        value={selectedParameter}
                        options={optionParameter}
                        isDisabled={false}
                        className="form-control border-0 p-0 h-100"
                        classNamePrefix="react-select"
                        styles={customStyles}
                        onChange={(value) => {
                          setSelectedParameter(value);
                        }}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text
                          className="pointer"
                          onClick={copyString}
                        >
                          <i className="far fa-copy mr-2"></i>Copy
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="2">
                    CC
                  </Form.Label>
                  <Col sm="10">
                    <StyledSelect
                      isDisabled={false}
                      options={optionEmailCc}
                      value={data.cc}
                      onChange={(value) => {
                        setData({ ...data, cc: value });
                      }}
                      id="notFit"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="2">
                    Subject Email
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      disabled={false}
                      defaultValue={data.subject}
                      onChange={(e) => {
                        setData({ ...data, subject: e.target.value });
                      }}
                      autoComplete="false"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="12">
                    Body Email
                  </Form.Label>
                  <Col sm="12">
                    <TextEditor
                      initialData={data.body}
                      getData={handleTextArea}
                    />
                  </Col>
                </Form.Group>
                {data.schedule && (
                  <Form.Group as={Row}>
                    <Form.Label column md="2">
                      Schedule
                    </Form.Label>
                    <Col sm="10">
                      <StyledSelect
                        isDisabled={false}
                        options={optionSchedule}
                        value={data.schedules}
                        onChange={(value) => {
                          setData({ ...data, schedules: value });
                        }}
                        id="notFit"
                      />
                    </Col>
                  </Form.Group>
                )}
                {errOnSubmit && !onSubmit && (
                  <div>
                    <p
                      className="text-danger font-italic"
                      style={{ fontSize: 11 }}
                    >
                      Error: <FormattedMessage id="REQ.UPDATE_FAILED" />
                    </p>
                  </div>
                )}
              </Col>
            </Row>
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={onSubmit}
              className={`btn btn-primary font-weight-bold btn-sm`}
            >
              {!onSubmit && (
                <span>
                  <FormattedMessage id="TITLE.SAVE" />
                </span>
              )}
              {onSubmit &&
                (statusSubmit && onSubmit ? (
                  <div>
                    <span>
                      <FormattedMessage id="TITLE.UPDATE_DATA_SUCCESS" />
                    </span>
                    <span className="ml-2 fas fa-check"></span>
                  </div>
                ) : (
                  <div>
                    <span>
                      <FormattedMessage id="TITLE.WAITING" />
                    </span>
                    <span className="ml-2 mr-4 spinner spinner-white"></span>
                  </div>
                ))}
            </button>
          </Form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(ItemEmail));
