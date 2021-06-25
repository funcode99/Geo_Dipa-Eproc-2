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
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "./style";
import { getSla, updateSla } from "../service/MasterCrud";
import useToast from "../../../components/toast";
import ButtonAction from "../../../components/buttonAction/ButtonAction";
import { Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import StyledSelect from "../../../components/select-multiple";
import { useHistory } from "react-router-dom";

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
const Email = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [filterTable, setFilterTable] = useState({});
  const [nameStateFilter, setNameStateFilter] = useState("");
  const [filterData] = useState([
    {
      title: intl.formatMessage({
        id: "TITLE.NAME",
      }),
      name: "name",
      type: "text",
    },
  ]);
  const [sortData, setSortData] = useState({
    name: "name",
    order: true,
  });
  const [dialogState, setDialogState] = useState(false);
  const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [Toast, setToast] = useToast();
  const [err, setErr] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [onSubmit, setOnSubmit] = useState(false);
  const [statusSubmit, setStatusSubmit] = useState(false);
  const [errOnSubmit, setErrOnSubmit] = useState(false);
  const [paginations, setPaginations] = useState({
    numberColum: 0,
    page: 0,
    count: 0,
    rowsPerPage: 10,
  });
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );
  const history = useHistory();

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  //   const requestFilterSort = useCallback(
  //     (updateFilterTable, updateSortTable) => {
  //       setLoading(true);
  //       setData([]);
  //       let pagination = Object.assign({}, paginations);
  //       let filterSorts = filterSort;
  //       filterSorts.filter = JSON.stringify(
  //         updateFilterTable ? updateFilterTable : filterTable
  //       );
  //       filterSorts.sort = JSON.stringify(
  //         updateSortTable ? updateSortTable : sortData
  //       );
  //       pagination.page = pagination.page + 1;
  //       filterSorts = Object.assign({}, filterSorts, pagination);
  //       setFilterSort({ ...filterSorts });
  //       let params = new URLSearchParams(filterSorts).toString();
  //         getSla(params)
  //           .then((result) => {
  //             setLoading(false);
  //             setData(result.data.data);
  //             setPaginations({ ...paginations, count: result.data.count || 0 });
  //           })
  //           .catch((err) => {
  //             setErr(true);
  //             setLoading(false);
  //             setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
  //           });
  //     },
  //     [filterTable, sortData, filterSort, intl, setToast, paginations]
  //   );

  //   useEffect(requestFilterSort, []);

  const openFilterTable = (name, index) => {
    let idFilter = "filter-" + index;
    let idInputFilter = "filter-" + name;
    let status = document.getElementById(idFilter).getAttribute("status");
    if (nameStateFilter === "") {
      setNameStateFilter(idFilter);
      document.getElementById(idFilter).setAttribute("status", "open");
      document.getElementById(idFilter).classList.add("open");
    } else if (nameStateFilter === idFilter) {
      if (status === "closed") {
        document.getElementById(idFilter).setAttribute("status", "open");
        document.getElementById(idFilter).classList.add("open");
      } else {
        document.getElementById(idFilter).setAttribute("status", "closed");
        document.getElementById(idFilter).classList.remove("open");
        document.getElementById(idInputFilter).value =
          filterTable[idInputFilter] || "";
      }
    } else {
      document.getElementById(nameStateFilter).setAttribute("status", "closed");
      document.getElementById(nameStateFilter).classList.remove("open");
      setNameStateFilter(idFilter);
      document.getElementById(idFilter).setAttribute("status", "open");
      document.getElementById(idFilter).classList.add("open");
    }
  };

  const updateValueFilter = (property, index) => {
    let filterTables = filterTable;
    filterTables["filter-" + property] = document.getElementById(
      "filter-" + property
    ).value;
    setFilterTable({ ...filterTables });
    openFilterTable(property, index);
    // requestFilterSort();
  };

  const resetValueFilter = (property) => {
    let filterTables = filterTable;
    filterTables[property] = "";
    document.getElementById(property).value = "";
    setFilterTable({ ...filterTables });
    // requestFilterSort();
  };

  const resetFilter = () => {
    setFilterTable({});
    document.getElementById("filter-form-all").reset();
    // requestFilterSort({});
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

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    let pagination = paginations;
    pagination.numberColum =
      newPage > pagination.page
        ? pagination.numberColum + pagination.rowsPerPage
        : pagination.numberColum - pagination.rowsPerPage;
    pagination.page = newPage;
    setPaginations({
      ...pagination,
    });
    // requestFilterSort();
  };

  const handleChangeRowsPerPage = (event) => {
    let pagination = paginations;
    pagination.page = 0;
    pagination.rowsPerPage = parseInt(event.target.value, 10);
    pagination.numberColum = 0;
    setPaginations({
      ...pagination,
    });
    // requestFilterSort();
  };

  const handleAction = (type, data) => {
    history.push(`/client/master/email/item`);
    // setDataEdit(data);
    // setDialogState(true);
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log("html:", html);
  };

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={dialogState}
        keepMounted
        maxWidth={"md"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.EMAIL" />
        </DialogTitle>
        <Form id="emailData" onSubmit={sendUpdate}>
          <DialogContent>
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
                      <select className="custom-select" defaultValue={0}>
                        <option value="0" hidden>
                          Pilih
                        </option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
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
            {errOnSubmit && !onSubmit && (
              <div>
                <p className="text-danger font-italic" style={{ fontSize: 11 }}>
                  Error: <FormattedMessage id="REQ.UPDATE_FAILED" />
                </p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={onSubmit}
              className={`btn btn-primary font-weight-bold btn-sm`}
              onClick={() => {
                //   sendUpdate();
              }}
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
            <button
              onClick={() => {
                setDialogState(false);
              }}
              disabled={onSubmit}
              className="btn btn-sm btn-danger"
            >
              <FormattedMessage id="TITLE.CANCEL" />
            </button>
          </DialogActions>
        </Form>
      </Dialog>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Master <FormattedMessage id="TITLE.EMAIL" />
          </h2>
        </div>
      </div>
      <Card className={classes.paper}>
        <CardBody>
          {/* begin: Filter Table */}
          <form id="filter-form-all" className="panel-filter-table mb-1">
            <span className="mr-2 mt-2 float-left">
              <FormattedMessage id="TITLE.FILTER.TABLE" />
            </span>
            <div className="d-block">
              <div className="">
                {filterData.map((item, index) => {
                  return (
                    <div
                      key={index.toString()}
                      className="btn-group hover-filter-table"
                      status="closed"
                      id={"filter-" + index}
                    >
                      <div
                        className="btn btn-sm dropdown-toggle"
                        data-toggle="dropdown"
                        aria-expanded="false"
                        onClick={() => {
                          openFilterTable(item.name, index);
                        }}
                      >
                        <span>{item.title}:</span>
                        <strong style={{ paddingRight: 1, paddingLeft: 1 }}>
                          <span
                            className="filter-label"
                            id={"filter-span-" + index}
                          >
                            {filterTable["filter-" + item.name]}
                          </span>
                        </strong>
                        {filterTable["filter-" + item.name] ? null : (
                          <span style={{ color: "#777777" }}>
                            <FormattedMessage id="TITLE.ALL" />
                          </span>
                        )}
                      </div>
                      <ul
                        role="menu"
                        className="dropdown-menu"
                        style={{ zIndex: 90 }}
                      >
                        <li style={{ width: 360, padding: 5 }}>
                          <div className="clearfix">
                            <div className="float-left">
                              <input
                                type={item.type}
                                className="form-control form-control-sm"
                                min="0"
                                name={"filter-" + item.name}
                                id={"filter-" + item.name}
                                defaultValue={
                                  filterTable["filter-" + item.name] || ""
                                }
                                placeholder={intl.formatMessage({
                                  id: "TITLE.ALL",
                                })}
                              />
                            </div>
                            <button
                              type="button"
                              className="ml-2 float-left btn btn-sm btn-primary"
                              onClick={() => {
                                updateValueFilter(item.name, index);
                              }}
                            >
                              <FormattedMessage id="TITLE.UPDATE" />
                            </button>
                            <button
                              type="button"
                              className="float-right btn btn-sm btn-light"
                              onClick={() => {
                                resetValueFilter("filter-" + item.name);
                              }}
                            >
                              <i className="fas fa-redo fa-right"></i>
                              <span>
                                <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                              </span>
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-sm btn-danger ml-2 mt-2 button-filter-submit"
                  onClick={() => {
                    resetFilter();
                  }}
                >
                  <FormattedMessage id="TITLE.FILTER.RESET.TABLE" />
                </button>
              </div>
            </div>
          </form>
          {/* end: Filter Table */}
          <div className="table-wrapper-scroll-y my-custom-scrollbar">
            <div className="segment-table">
              <div className="hecto-8">
                <table className="table-bordered overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white align-middle td-2">
                        <FormattedMessage id="TITLE.NO" />
                      </th>
                      <th
                        className="bg-primary text-white align-middle td-46 pointer"
                        id="name"
                        onClick={(e) => {
                          let sortDatas = sortData;
                          sortDatas.name = e.target.id;
                          sortDatas.order = sortDatas.order ? false : true;
                          setSortData({ ...sortDatas });
                          //   requestFilterSort();
                        }}
                      >
                        {sortData.name === "name" && (
                          <span
                            id="iconSort"
                            className="svg-icon svg-icon-sm svg-icon-white ml-1"
                          >
                            {sortData.order ? (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Up-2.svg"
                                )}
                              />
                            ) : (
                              <SVG
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Navigation/Down-2.svg"
                                )}
                              />
                            )}
                          </span>
                        )}

                        <FormattedMessage id="TITLE.NAME" />
                      </th>
                      <th className="bg-primary text-white align-middle td-10">
                        <FormattedMessage id="TITLE.SCHEDULED" />
                      </th>
                      <th className="bg-primary text-white align-middle td-27">
                        <FormattedMessage id="TITLE.UPDATED_DATE" />
                      </th>
                      <th className="bg-primary text-white align-middle td-15">
                        <FormattedMessage id="MENU.ACTIONS" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        approved softcopy by verification staff and tax
                        administration staff
                      </td>
                      <td>NO</td>
                      <td>{window.moment(new Date()).format("DD MMM YYYY")}</td>
                      <td>
                        <ButtonAction
                          data={[]}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>SA/GR has been published</td>
                      <td>YES</td>
                      <td>{window.moment(new Date()).format("DD MMM YYYY")}</td>
                      <td>
                        <ButtonAction
                          data={[]}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>direject softcopy by verification staff</td>
                      <td>NO</td>
                      <td>{window.moment(new Date()).format("DD MMM YYYY")}</td>
                      <td>
                        <ButtonAction
                          data={[]}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>approved hardcopy by verification staff</td>
                      <td>NO</td>
                      <td>{window.moment(new Date()).format("DD MMM YYYY")}</td>
                      <td>
                        <ButtonAction
                          data={[]}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>SPT has been published</td>
                      <td>NO</td>
                      <td>{window.moment(new Date()).format("DD MMM YYYY")}</td>
                      <td>
                        <ButtonAction
                          data={[]}
                          handleAction={handleAction}
                          ops={data_ops}
                        />
                      </td>
                    </tr>
                    {/* {data.map((item, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{index + 1 + paginations.numberColum}</td>
                          <td>{item.name}</td>
                          <td>{item.days}</td>
                          <td>
                            <ButtonAction
                              data={item}
                              handleAction={handleAction}
                              ops={data_ops}
                            />
                          </td>
                        </tr>
                      );
                    })} */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="table-loading-data">
              <div className="text-center font-weight-bold">
                <div className="table-loading-data-potition">
                  {loading && (
                    <span>
                      <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                      <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
                    </span>
                  )}
                  {err && (
                    <span className="text-danger">
                      <i className="far fa-frown text-danger mr-1"></i>
                      <FormattedMessage id="TITLE.ERROR_REQUEST" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* begin: Pagination Table */}
          <TablePagination
            component="div"
            count={paginations.count}
            page={paginations.page}
            onChangePage={handleChangePage}
            rowsPerPage={paginations.rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          {/* end: Pagination Table */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(Email));
