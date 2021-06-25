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
import { getSla, updateSla } from "../../service/MasterCrud";
import useToast from "../../../../components/toast";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import StyledSelect from "../../../../components/select-multiple";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import Select from "react-select";

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
const html = `<p>Kepada Yth. <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);">{PT_CV_ Nama_Perusahaan}</span></p>
<p>Dokumen Softcopy telah kami terima dengan rincian sebagai berikut:</p>
<p></p>
<p>Nomor Invoice      : <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, Helvetica, sans-serif;">{Invoice_Number}</span>&nbsp;</p>
<p>Total tagihan        : <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, Helvetica, sans-serif;">{Total_Bill}</span></p>
<p>Nomor Kontrak     : <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, Helvetica, sans-serif;">{Number_Contract}</span>&nbsp;</p>
<p>Judul Kontrak       : <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, Helvetica, sans-serif;">{Name_Contract}</span>&nbsp;</p>
<p>Nomor PO             : <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, Helvetica, sans-serif;">{Number_PO}</span></p>
<p>Denda                    :  <span style="color: rgb(226,80,65);">(Optional jika ada hasil Verifikasi)</span></p>
<p>Nomor Rekening : <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 13px;font-family: Poppins, Helvetica, sans-serif;">{Account_Number}</span>&nbsp;</p>
<p>Rencana Pembayaran : Tgl perkiraan pembayaran (by system)</p>
<p></p>
<p>Harap untuk mengirimkan dokument tagihan hardcopy kepada kami dalam waktu 5 Hari Kerja</p>
<p>Ada masukan apa lagi yang Perlu dikirimkan?</p>
<p>Untuk informasi lebih lanjut, silakan <a href="https://www.geodipa.co.id/" target="_blank">login</a>  ke dalam sistem&nbsp;</p>
<p>Invoice Monitoring PT. Geo Dipa Energi (Persero).&nbsp;</p>
<p> </p>
<p>Terima kasih,</p>
<p>E-Procurement - Invoice Monitoring PT. Geo Dipa Energi (Persero)&nbsp;</p>
<p></p>`;
const contentBlock = htmlToDraft(html);
const contentState = ContentState.createFromBlockArray(
  contentBlock.contentBlocks
);
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
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log("html:", html);
  };

  const sendUpdate = (e) => {
    e.preventDefault();
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
  };
  const customStyles = {
    control: (styles) => ({
      ...styles,
      border: "1px solid #EBEDF3 !important",
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    }),
  };

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
            label: "List EMail",
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
                      value="approved softcopy by verification staff and tax administration staff"
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
                    Subject Email
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      disabled={false}
                      defaultValue="Subject"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="12">
                    Body Email
                  </Form.Label>
                  <Col sm="12">
                    <Editor
                      editorState={editorState}
                      toolbarClassName="toolbar-class"
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      onEditorStateChange={onEditorStateChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="2">
                    Schedule
                  </Form.Label>
                  <Col sm="10">
                    <StyledSelect
                      isDisabled={false}
                      options={contohSchedule}
                      value={[]}
                      id="notFit"
                    />
                  </Col>
                </Form.Group>
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
