import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  makeStyles,
  TablePagination,
} from "@material-ui/core";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "../style";
import { getEmail, getListSchedule, updateSla } from "../../service/MasterCrud";
import useToast from "../../../../components/toast";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import StyledSelect from "../../../../components/select-multiple";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import Select from "react-select";
import { useHistory, useParams } from "react-router-dom";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import TextEditor from "../../../../components/textEditor/TextEditor";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const data_ops = [
  {
    label: "TITLE.OPEN_DATA",
    icon: "fas fa-envelope-open text-success",
    type: "open",
  },
];

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));
const contohSchedule = [
  { label: "Hari H", value: "0" },
  { label: "3 Hari Sebelum Jatuh Tempo", value: "3" },
  { label: "1 Minggu Sebelum Jatuh Tempo", value: "7" },
  { label: "30 Hari Sebelum Jatuh Tempo", value: "30" },
];
const ItemEmail = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [valueText, setValueText] = useState("");
  const [optionSchedule, setOptionSchedule] = useState([]);

  const sendUpdate = useCallback(
    (e) => {
      e.preventDefault();
      console.log("valueText", valueText);
      //   setOnSubmit(true);
      //   setErrOnSubmit(false);
      //   var data = {
      //     id: dataEdit.id,
      //     request: {
      //       days: Number(dataEdit.days),
      //       user_id: user_id,
      //     },
      //   };
      //   updateSla(data.id, data.request)
      //     .then((result) => {
      //       setStatusSubmit(true);
      //       setTimeout(() => {
      //         setDialogState(false);
      //         setOnSubmit(false);
      //         setStatusSubmit(false);
      //         //   requestFilterSort();
      //       }, 2000);
      //     })
      //     .catch((err) => {
      //       setOnSubmit(false);
      //       setErrOnSubmit(true);
      //     });
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
        if (result.data.data.schedule) {
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
  }, []);

  useEffect(callAPI, []);

  const handleTextArea = (value) => {
    setValueText(value);
  };
  // useEffect(handleTextArea, [data]);

  return (
    <React.Fragment>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            approved softcopy by verification staff and tax administration staff
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
                        value={[]}
                        options={[
                          { label: "Nomor Invoice", value: "{Invoice_Number}" },
                          { label: "Total tagihan", value: " {Total_Bill}" },
                          {
                            label: "Nomor Kontrak",
                            value: "{Number_Contract}",
                          },
                        ]}
                        isDisabled={false}
                        className="form-control border-0 p-0 h-100"
                        classNamePrefix="react-select"
                        styles={customStyles}
                      />
                      {/* <select className="custom-select" defaultValue={0}>
                        <option value="0" hidden>
                          Pilih
                        </option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select> */}
                      <InputGroup.Append>
                        <InputGroup.Text className="pointer">
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
                      options={[
                        { label: "Vendor Tekait", value: "0" },
                        { label: "User Terkait(Email Divisi)", value: "1" },
                        { label: "Pusat(Email Pusat)", value: "1" },
                      ]}
                      value={[]}
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
                      onChange={(e) => {}}
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
                        value={data.schedule}
                        onChange={(value) => {
                          setData({ ...data, schedule: value });
                        }}
                        id="notFit"
                      />
                    </Col>
                  </Form.Group>
                )}
              </Col>
            </Row>
            <button
              id="kt_login_signin_submit"
              type="submit"
              className={`btn btn-primary font-weight-bold btn-sm`}
              onClick={() => {
                //   sendUpdate();
              }}
            >
              kirim
            </button>
            <button className="btn btn-sm btn-danger">
              <FormattedMessage id="TITLE.CANCEL" />
            </button>
          </Form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(ItemEmail));
