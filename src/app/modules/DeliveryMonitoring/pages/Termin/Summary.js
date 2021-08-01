import {
  TableCell,
  TableRow,
  Button,
  TableBody,
  Checkbox,
  Table,
  TableHead,
  IconButton,
} from "@material-ui/core";
import React from "react";
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  Send,
} from "@material-ui/icons";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { actionTypes } from "../../_redux/deliveryMonitoringAction";
import useToast from "../../../../components/toast";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { rupiah } from "../../../../libs/currency";
import Navs from "../../../../components/navs";
import { FormattedMessage } from "react-intl";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import DialogGlobal from "../../../../components/modals/DialogGlobal";
import { connect } from "react-redux";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import { TerminPageContext } from "./TerminPageNew/TerminPageNew";
import { KEYS_TERMIN } from "./TerminPageNew/STATIC_DATA";

const tHeadSubmitItems = [
  "No",
  <FormattedMessage id="TITLE.NAME" />,
  <FormattedMessage id="TITLE.QUANTITY" />,
];

const theadItems = [
  { id: "action", label: "" },
  { id: "keterangan", label: "Keterangan" },
  { id: "due-date", label: "Due Date" },
  { id: "qty", label: "Qty" },
  { id: "qty_avail", label: "Qty Available" },
  { id: "uom", label: "Uom" },
  { id: "net-value", label: "Net Value" },
  // { id: 'wbs', label: 'WBS' },
];

const navLists = [
  { id: "link-jasa", label: <FormattedMessage id="SUMMARY.NAV.SERVICE" /> },
  { id: "link-barang", label: <FormattedMessage id="SUMMARY.NAV.ITEM" /> },
];

function Summary({}) {
  const {
    func,
    task_id,
    loadings,
    fetch_api_sg,
    authStatus,
  } = React.useContext(TerminPageContext);
  const taskId = task_id;
  const [navActive, setNavActive] = React.useState(navLists[0].id);
  const [itemBarang, setItemBarang] = React.useState([]);
  const [itemJasa, setItemJasa] = React.useState([]);
  const [Toast, setToast] = useToast();
  const { dataJasa, dataBarang } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();
  const submitRef = React.useRef();
  const [qtyErrors, setQtyErrors] = React.useState([]);

  const isClient = authStatus === "client";

  const setInitialSubmitItems = (data, type) => {
    if (type === "jasa") {
      const tempSubmitJasa = [];
      // console.log(data);

      data.forEach((item) => {
        item.item_services.forEach((service) => {
          if (service.service) {
            tempSubmitJasa.push({
              service_id: service.service.id,
              desc: service.service.short_text,
              qty: service.qty,
            });
          }
        });
      });

      setItemJasa(tempSubmitJasa);
    }

    if (type === "barang") {
      const tempSubmitBarang = [];
      // console.log(data);

      data.forEach((items) => {
        if (items.item) {
          tempSubmitBarang.push({
            item_id: items.item.id,
            desc: items.item.desc,
            qty: items.qty,
          });
        }
      });

      setItemBarang(tempSubmitBarang);
    }
  };

  const addShowField = (data) => {
    data.forEach((item) => {
      item.show = false;
    });
  };

  const addCheckedAndErrorField = (data, type) => {
    if (type === "barang") {
      data.forEach((item) => {
        if (!item.item) {
          item.checked = false;
          item.error = "";
        } else {
          item.checked = true;
          item.error = "";
        }
      });
    }

    if (type === "jasa") {
      data.forEach((item) => {
        item.item_services.forEach((service) => {
          if (!service.service) {
            service.checked = false;
            service.error = "";
          } else {
            service.checked = true;
            service.error = "";
          }
        });
      });
    }
  };

  const setInitialData = () => {
    dispatch({
      type: actionTypes.SetDataJasa,
      payload: [],
    });

    dispatch({
      type: actionTypes.SetDataBarang,
      payload: [],
    });
  };

  const setDataFromAPI = (dataJasa, dataBarang) => {
    dispatch({
      type: actionTypes.SetDataJasa,
      payload: dataJasa,
    });

    dispatch({
      type: actionTypes.SetDataBarang,
      payload: dataBarang,
    });
  };

  const getAllItems = async (taskId) => {
    setInitialData();

    func.handleApi({
      key: KEYS_TERMIN.f_termin,
      onSuccess: (res) => {
        console.log(`fetch_baru`, res);
        const tempDataJasa = res.data.task_item_services;
        const tempDataBarang = res.data.task_items;
        addShowField(tempDataJasa);
        addCheckedAndErrorField(tempDataJasa, "jasa");
        addCheckedAndErrorField(tempDataBarang, "barang");

        setInitialSubmitItems(tempDataJasa, "jasa");
        setInitialSubmitItems(tempDataBarang, "barang");

        setDataFromAPI(tempDataJasa, tempDataBarang);
      },
    });

    // fetch_api_sg({
    //   key: keys.fetch,
    //   type: "get",
    //   url: `/delivery/task/${taskId}/item-service`,
    //   onSuccess: (res) => {
    //     console.log(`fetch_lama`, res);

    //   },
    // });
  };

  React.useEffect(() => {
    if (taskId) {
      getAllItems(taskId);
    }
    // eslint-disable-next-line
  }, []);

  const handleExpand = (event, itemId) => {
    let tempJasa = dataJasa;

    tempJasa.forEach((item) => {
      if (item.id === itemId) {
        item.show = !item.show;
      }
    });

    dispatch({
      type: actionTypes.SetDataJasa,
      payload: tempJasa,
    });
  };

  const removeFromSubmitItem = (itemId, type) => {
    if (type === "barang") {
      let tempSubmitBarang = itemBarang;

      tempSubmitBarang = tempSubmitBarang.filter(
        (item) => item.item_id !== itemId
      );

      setItemBarang(tempSubmitBarang);
    }

    if (type === "jasa") {
      let tempSubmitJasa = itemJasa;

      tempSubmitJasa = tempSubmitJasa.filter(
        (item) => item.service_id !== itemId
      );

      setItemJasa(tempSubmitJasa);
    }
  };

  const changeChecked = (item) => {
    item.checked = !item.checked;
  };

  const handleChecklistBarang = (qtyValue, qtyAvailable, itemId, desc) => {
    // addSubmitBarang(qtyValue, qtyAvailable, itemId, desc);

    console.log(`qtyValue`, qtyValue);
    console.log(`qtyAvailable`, qtyAvailable);

    let tempBarang = dataBarang;

    tempBarang.forEach((item) => {
      // Check if already submit then change checked
      if (item.item === undefined) {
        if (item.id === itemId) {
          changeChecked(item);
          if (item.checked === true) {
            addSubmitBarang(qtyValue, qtyAvailable, itemId, desc);
          }
        }
      } else {
        if (item.item_id === itemId) {
          changeChecked(item);
          if (item.checked === true) {
            addSubmitBarang(qtyValue, qtyAvailable, itemId, desc);
          }
        }
      }

      //remove from itemBarang if checked false
      if (item.item === undefined) {
        if (
          item.id === itemId &&
          item.checked === false &&
          itemBarang.length > 0
        ) {
          removeFromSubmitItem(item.id, "barang");
        }
      } else {
        if (
          item.item_id === itemId &&
          item.checked === false &&
          itemBarang.length > 0
        ) {
          removeFromSubmitItem(item.item_id, "barang");
        }
      }
    });

    dispatch({
      type: actionTypes.SetDataBarang,
      payload: tempBarang,
    });
  };

  const handleChecklistJasa = (
    qtyValue,
    qtyAvailable,
    itemId,
    serviceId,
    desc
  ) => {
    addSubmitJasa(qtyValue, qtyAvailable, serviceId, desc);

    let tempJasa = dataJasa;

    tempJasa.forEach((item) => {
      if (item.id === itemId) {
        item.item_services.forEach((service) => {
          // Check if already submit then change checked
          if (service.service === undefined) {
            if (service.id === serviceId) {
              changeChecked(service);
              if (service.checked === true) {
                addSubmitJasa(qtyValue, qtyAvailable, serviceId, desc);
              }
            }
          } else {
            if (service.service_id === serviceId) {
              changeChecked(service);
              if (service.checked === true) {
                addSubmitJasa(qtyValue, qtyAvailable, serviceId, desc);
              }
            }
          }

          //remove from itemJasa if checked false
          if (service.service === undefined) {
            if (
              service.id === serviceId &&
              service.checked === false &&
              itemJasa.length > 0
            ) {
              removeFromSubmitItem(service.id, "jasa");
            }
          } else {
            if (
              service.service_id === serviceId &&
              service.checked === false &&
              itemJasa.length > 0
            ) {
              removeFromSubmitItem(service.service_id, "jasa");
            }
          }
        });
      }
    });

    dispatch({
      type: actionTypes.SetDataJasa,
      payload: tempJasa,
    });
  };

  const addSubmitBarang = (qtyValue, qtyAvailable, itemId, desc) => {
    const isValidQty = parseFloat(qtyValue) ? true : false;
    const floatQty = parseFloat(qtyValue);
    const floatQtyAvailable = parseFloat(qtyAvailable).toFixed(1);
    const minValue = 0.1;

    //validate quantity number
    if (!isValidQty || floatQty < minValue || floatQty > floatQtyAvailable) {
      removeFromSubmitItem(itemId, "barang");
      let temp = [...qtyErrors];
      const find = temp.find((item) => item === itemId);
      if (!find) {
        setQtyErrors([...qtyErrors, itemId]);
      }
      // setToast(
      //   <FormattedMessage
      //     id="MESSAGE.VALIDATE_QTY"
      //     values={{ minValue, floatQtyAvailable }}
      //   />
      // );
    } else {
      let temp = [...qtyErrors];
      temp = temp.filter((item) => item !== itemId);
      setQtyErrors(temp);

      const tempSubmitItems = itemBarang;

      const submitItem = {
        item_id: itemId,
        qty: floatQty,
        desc: desc,
      };

      if (tempSubmitItems.length === 0) {
        tempSubmitItems.push(submitItem);
      }

      if (tempSubmitItems.length > 0) {
        const findItem = tempSubmitItems.find(
          (item) => item.item_id === itemId
        );

        if (findItem) {
          tempSubmitItems.forEach((item) => {
            if (item.item_id === itemId) {
              item.qty = floatQty;
            }
          });
        }

        if (!findItem) {
          tempSubmitItems.push(submitItem);
        }
      }

      setItemBarang(tempSubmitItems);
    }
  };

  const addSubmitJasa = (qtyValue, qtyAvailable, serviceId, desc) => {
    const isValidQty = parseFloat(qtyValue) ? true : false;
    const floatQtyValue = parseFloat(qtyValue);
    const floatQtyAvailable = parseFloat(qtyAvailable).toFixed(1);
    const minValue = 0.1;

    //validate quantity number
    if (
      !isValidQty ||
      floatQtyValue < minValue ||
      floatQtyValue > floatQtyAvailable
    ) {
      removeFromSubmitItem(serviceId, "jasa");
      let temp = [...qtyErrors];
      const find = temp.find((item) => item === serviceId);
      if (!find) {
        setQtyErrors([...qtyErrors, serviceId]);
      }
      // setToast(
      //   <FormattedMessage
      //     id="MESSAGE.VALIDATE_QTY"
      //     values={{ minValue, floatQtyAvailable }}
      //   />
      // );
    } else {
      let temp = [...qtyErrors];
      temp = temp.filter((item) => item !== serviceId);
      setQtyErrors(temp);

      const tempSubmitJasa = itemJasa;

      const submitItem = {
        service_id: serviceId,
        qty: floatQtyValue,
        desc: desc,
      };

      // jika masih kosong maka tambahkan
      if (tempSubmitJasa.length === 0) {
        tempSubmitJasa.push(submitItem);
      }

      // jika sudah ada isinya
      if (tempSubmitJasa.length > 0) {
        // cari berdasarkan id
        const findItem = tempSubmitJasa.find(
          (item) => item.service_id === serviceId
        );

        // jika ketemu ubah qty sesuai id
        if (findItem) {
          tempSubmitJasa.forEach((item) => {
            if (item.service_id === serviceId) {
              item.qty = floatQtyValue;
            }
          });
        }

        // jika tidak maka push
        if (!findItem) {
          tempSubmitJasa.push(submitItem);
        }
      }

      setItemJasa(tempSubmitJasa);
    }
  };

  const handleSubmit = async () => {
    func.handleApi({
      key: KEYS_TERMIN.p_t_summary,
      params: {
        task_items: itemBarang,
        task_services: itemJasa,
      },
      onSuccess: (res) => {
        getAllItems(taskId);
        submitRef.current.close();
      },
    });

    // fetch_api_sg({
    //   key: keys.submit,
    //   type: "post",
    //   url: `/delivery/task/${taskId}`,
    //   params: {
    //   task_items: itemBarang,
    //   task_services: itemJasa,
    //   },
    //   alertAppear: "both",
    //   onSuccess: (res) => {
    //     getAllItems(taskId);
    //     submitRef.current.close();
    //   },
    // });

    // try {
    //   enableLoading();

    //   const requestData = {
    //     task_items: itemBarang,
    //     task_services: itemJasa,
    //   };

    //   const {
    //     data: { status },
    //   } = await deliveryMonitoring.submitItems(requestData, taskId);

    //   if (status) {
    //     setToast(<FormattedMessage id="MESSAGE.SUCCESS_SUBMIT_ITEM" />, 5000);
    //     getAllItems(taskId);
    //     handleVisibleModal("submit");
    //   }
    // } catch (error) {
    //   if (
    //     error.response?.status !== 400 &&
    //     error.response?.data.message !== "TokenExpiredError"
    //   ) {
    //     setToast(error.response?.data.message, 5000);
    //   }
    // } finally {
    //   disableLoading();
    // }
  };

  return (
    <div>
      <Toast />

      {/* Modal ketika klik submit */}
      <DialogGlobal
        ref={submitRef}
        // visible={showModal.submit}
        // onClose={() => handleVisibleModal("submit")}
        onYes={handleSubmit}
        textYes={<FormattedMessage id="TITLE.YES" />}
        title={<FormattedMessage id="TITLE.SUBMIT_TERM_ITEMS" />}
        loading={loadings[KEYS_TERMIN.p_t_summary]}
        btnNoProps={{
          className: "bg-secondary text-black",
        }}
        // minWidth="40vw"
        // maxWidth="70vw"
      >
        {itemJasa.length > 0 && (
          <div className="mb-5">
            <h4>
              <FormattedMessage id="TITLE.SERVICE" />
            </h4>
            <Table size="small">
              {/* <colgroup>
                <col width="50px" />
                <col width="200px" />
                <col width="50px" />
              </colgroup> */}
              <TableHead>
                <TableRow>
                  {tHeadSubmitItems.map((item, index) => (
                    <TableCell key={index} align={index > 1 ? "right" : "left"}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {itemJasa.map((item, index) => (
                  <TableRow key={item.service_id}>
                    <TableCell>{(index += 1)}</TableCell>
                    <TableCell>{item.desc}</TableCell>
                    <TableCell align="right">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {itemBarang.length > 0 && (
          <div className="mb-5">
            <h4>
              <FormattedMessage id="TITLE.ITEM" />
            </h4>
            <Table size="small">
              {/* <colgroup>
                <col width="50px" />
                <col width="200px" />
                <col width="50px" />
              </colgroup> */}
              <TableHead>
                <TableRow>
                  {tHeadSubmitItems.map((item, index) => (
                    <TableCell key={index} align={index > 1 ? "right" : "left"}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {itemBarang.map((item, index) => (
                  <TableRow key={item.item_id}>
                    <TableCell>{(index += 1)}</TableCell>
                    <TableCell>{item.desc}</TableCell>
                    <TableCell align="right">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {itemBarang.length > 0 || itemJasa.length > 0 ? (
          <div>
            <h6 className="mb-5">
              <FormattedMessage id="MESSAGE.SUBMIT_ITEM" />
            </h6>
            {/* <div className="d-flex justify-content-end w-100">
              <Button
                className="btn btn-secondary border-success mr-3"
                onClick={() => handleVisibleModal("submit")}
              >
                <FormattedMessage id="TITLE.CANCEL" />
              </Button>
              <Button
                className="btn btn-success"
                onClick={() => handleSubmit()}
              >
                <FormattedMessage id="TITLE.YES" />
                {loading ? <CircularProgress /> : null}
              </Button>
            </div> */}
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <h6>
              <FormattedMessage id="MESSAGE.SUBMIT_ITEM" />
            </h6>
            <p className="mb-5">
              <FormattedMessage id="MESSAGE.NO_ITEMS" />
            </p>
            {/* <div className="d-flex justify-content-end">
              <Button
                className="btn btn-secondary border-success mr-3"
                onClick={() => handleVisibleModal("submit")}
              >
                <FormattedMessage id="TITLE.CANCEL" />
              </Button>
              <Button
                className="btn btn-success"
                onClick={() => handleSubmit()}
              >
                <FormattedMessage id="TITLE.YES" />
                {loading ? <CircularProgress /> : null}
              </Button>
            </div> */}
          </div>
        )}
      </DialogGlobal>

      <Card>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          {/* component table jasa */}
          {navActive === "link-jasa" && (
            <TablePaginationCustom
              headerRows={theadItems}
              rows={dataJasa}
              loading={loadings[KEYS_TERMIN.f_termin]}
              maxHeight={300}
              headerProps={{ sortable: false }}
              withSearch={false}
              withPagination={false}
              renderRows={({ item, index }) => {
                return (
                  <React.Fragment key={item.id}>
                    <TableRow hover onClick={() => handleExpand("e", item.id)}>
                      <TableCell className="align-middle">
                        <IconButton
                          size="small"
                          className="btn btn-primary btn-sm p-0 align-middle"
                          // onClick={(e) => handleExpand(e, item.id)}
                        >
                          {item.show ? (
                            <ExpandLessOutlined />
                          ) : (
                            <ExpandMoreOutlined />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell className="align-middle">
                        {item.desc}
                      </TableCell>
                      <TableCell className="align-middle"></TableCell>
                      <TableCell className="align-middle"></TableCell>
                      <TableCell className="align-middle"></TableCell>
                      <TableCell className="align-middle"></TableCell>
                      <TableCell className="align-middle"></TableCell>
                      {/* <TableCell className="align-middle"></TableCell> */}
                    </TableRow>

                    {item.item_services.length !== 0 && item.show
                      ? item.item_services.map((service) => {
                          // Check if already submit
                          if (service.service === undefined) {
                            return (
                              <TableRow
                                key={service.id}
                                className={
                                  service.qty_available === 0
                                    ? `bg-secondary`
                                    : null
                                }
                              >
                                <TableCell className="align-middle">
                                  <Checkbox
                                    name={`checkbox-${service.id}`}
                                    color="secondary"
                                    onChange={() =>
                                      handleChecklistJasa(
                                        service.qty_available,
                                        service.qty_available,
                                        item.id,
                                        service.id,
                                        service.short_text
                                      )
                                    }
                                    size="small"
                                    checked={service.checked}
                                    disabled={
                                      service.qty_available === 0 ? true : false
                                    }
                                  />
                                </TableCell>
                                <TableCell className="align-middle">
                                  {service.short_text}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {/* 31/01/2021 */}
                                </TableCell>
                                <TableCell>{service?.quantity}</TableCell>
                                <TableCell className="align-middle">
                                  {/* {service.quantity} */}
                                  {isClient ? (
                                    <React.Fragment>
                                      <Form.Control
                                        type="number"
                                        size="sm"
                                        min="0.1"
                                        step="0.1"
                                        // min="1"
                                        // step="1"
                                        style={{
                                          width: 80,
                                          flex: "none",
                                        }}
                                        max={service.qty_available}
                                        disabled={!service.checked}
                                        defaultValue={parseFloat(
                                          service.qty_available
                                        ).toFixed(1)}
                                        onChange={(e) =>
                                          addSubmitJasa(
                                            e.target.value,
                                            service.qty_available,
                                            service.id,
                                            service.short_text
                                          )
                                        }
                                      />
                                      {qtyErrors.find(
                                        (el) => el === service.id
                                      ) && (
                                        <span className="text-danger">
                                          Max qty{" "}
                                          {parseFloat(
                                            service.qty_available
                                          ).toFixed(1)}
                                        </span>
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    parseFloat(service.qty_available).toFixed(1)
                                  )}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {item?.measurement_unit?.ident_name}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {rupiah(service.net_value)}
                                </TableCell>
                              </TableRow>
                            );
                          } else {
                            return (
                              <TableRow key={service.service.id}>
                                <TableCell className="align-middle">
                                  <Checkbox
                                    name={`checkbox-${service.service.id}`}
                                    color="secondary"
                                    onChange={() =>
                                      handleChecklistJasa(
                                        service.qty,
                                        (
                                          parseFloat(
                                            service.service.qty_available
                                          ) + parseFloat(service.qty)
                                        ).toFixed(1),
                                        item.id,
                                        service.service.id,
                                        service.service.short_text
                                      )
                                    }
                                    size="small"
                                    checked={service.checked}
                                  />
                                </TableCell>
                                <TableCell className="align-middle">
                                  {service.service.short_text}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {/* 31/01/2021 */}
                                </TableCell>
                                <TableCell>{service?.qty}</TableCell>
                                <TableCell className="align-middle">
                                  {/* {service.quantity} */}
                                  {isClient ? (
                                    <React.Fragment>
                                      <Form.Control
                                        type="number"
                                        size="sm"
                                        min="0.1"
                                        step="0.1"
                                        style={{
                                          width: 80,
                                          flex: "none",
                                        }}
                                        max={(
                                          parseFloat(
                                            service.service.qty_available
                                          ) + parseFloat(service.qty)
                                        ).toFixed(1)}
                                        disabled={!service.checked}
                                        defaultValue={parseFloat(
                                          service.qty
                                        ).toFixed(1)}
                                        onChange={(e) =>
                                          addSubmitJasa(
                                            e.target.value,
                                            (
                                              parseFloat(
                                                service.service.qty_available
                                              ) + parseFloat(service.qty)
                                            ).toFixed(1),
                                            service.service.id,
                                            service.service.short_text
                                          )
                                        }
                                      />
                                      {qtyErrors.find(
                                        (el) => el === service.service.id
                                      ) && (
                                        <span className="text-danger">
                                          Max qty{" "}
                                          {(
                                            parseFloat(
                                              service.service.qty_available
                                            ) + parseFloat(service.qty)
                                          ).toFixed(1)}
                                        </span>
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    parseFloat(service.qty).toFixed(1)
                                  )}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {item?.measurement_unit?.ident_name}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {rupiah(service.service.net_value)}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })
                      : null}
                  </React.Fragment>
                );
              }}
            />
          )}

          {/* component table barang */}

          {navActive === "link-barang" && (
            <TablePaginationCustom
              headerRows={theadItems}
              rows={dataBarang}
              loading={loadings[KEYS_TERMIN.f_termin]}
              withSearch={false}
              withPagination={true}
              renderRows={({ item, index }) => {
                // Check if already submit
                if (item.item === undefined) {
                  return (
                    <TableRow
                      key={item.id}
                      className={
                        item.qty_available === 0 ? `bg-secondary` : null
                      }
                    >
                      <TableCell className="align-middle">
                        <Checkbox
                          name={`checkbox-${item.id}`}
                          color="secondary"
                          onChange={() =>
                            handleChecklistBarang(
                              item.qty_available,
                              item.qty_available,
                              item.id,
                              item.desc
                            )
                          }
                          size="small"
                          width={50}
                          variant="body"
                          checked={item.checked}
                          disabled={item.qty_available === 0 ? true : false}
                        />
                      </TableCell>
                      <TableCell className="align-middle">
                        {item.desc}
                      </TableCell>
                      <TableCell className="align-middle">
                        {/* 31/01/2021 */}
                      </TableCell>
                      <TableCell className="align-middle">{item.qty}</TableCell>
                      <TableCell className="align-middle">
                        {isClient ? (
                          <React.Fragment>
                            <Form.Control
                              type="number"
                              size="sm"
                              style={{
                                width: 80,
                                flex: "none",
                              }}
                              min={0.1}
                              step={0.1}
                              max={item.qty_available}
                              disabled={!item.checked}
                              defaultValue={parseFloat(
                                item.qty_available
                              ).toFixed(1)}
                              onChange={(e) =>
                                addSubmitBarang(
                                  e.target.value,
                                  item.qty_available,
                                  item.id,
                                  item.desc
                                )
                              }
                            />
                            {qtyErrors.find((el) => el === item.id) && (
                              <span className="text-danger">
                                Max qty{" "}
                                {parseFloat(item.qty_available).toFixed(1)}
                              </span>
                            )}
                          </React.Fragment>
                        ) : (
                          parseFloat(item.qty_available).toFixed(1)
                        )}
                      </TableCell>
                      <TableCell className="align-middle">
                        {item?.measurement_unit?.ident_name}
                      </TableCell>
                      <TableCell className="align-middle">
                        {rupiah(item.unit_price)}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={item.item.id}>
                      <TableCell className="align-middle">
                        <Checkbox
                          name={`checkbox-${item.item.id}`}
                          color="secondary"
                          onChange={() =>
                            handleChecklistBarang(
                              item.item.qty,
                              (
                                parseFloat(item.qty) +
                                parseFloat(item.item.qty_available)
                              ).toFixed(1),
                              item.item.id,
                              item.item.desc
                            )
                          }
                          size="small"
                          width={50}
                          variant="body"
                          checked={item.checked}
                        />
                      </TableCell>
                      <TableCell className="align-middle">
                        {item.item.desc}
                      </TableCell>
                      <TableCell className="align-middle">
                        {/* 31/01/2021 */}
                      </TableCell>
                      <TableCell className="align-middle">
                        {item.item.qty}
                      </TableCell>
                      <TableCell className="align-middle">
                        {isClient ? (
                          <React.Fragment>
                            <Form.Control
                              type="number"
                              size="sm"
                              min={0.1}
                              step={0.1}
                              style={{
                                width: 80,
                                flex: "none",
                              }}
                              max={(
                                parseFloat(item.qty) +
                                parseFloat(item.item.qty_available)
                              ).toFixed(1)}
                              disabled={!item.checked}
                              defaultValue={parseFloat(item.qty).toFixed(1)}
                              onChange={(e) =>
                                addSubmitBarang(
                                  e.target.value,
                                  (
                                    parseFloat(item.qty) +
                                    parseFloat(item.item.qty_available)
                                  ).toFixed(1),
                                  item.item.id,
                                  item.item.desc
                                )
                              }
                            />
                            {qtyErrors.find((el) => el === item.item.id) && (
                              <span className="text-danger">
                                Max qty{" "}
                                {(
                                  parseFloat(item.qty) +
                                  parseFloat(item.item.qty_available)
                                ).toFixed(1)}
                              </span>
                            )}
                          </React.Fragment>
                        ) : (
                          parseFloat(item.qty).toFixed(1)
                        )}
                      </TableCell>
                      <TableCell className="align-middle">
                        {item?.item?.measurement_unit?.ident_name}
                      </TableCell>
                      <TableCell className="align-middle">
                        {rupiah(item.item.unit_price)}
                      </TableCell>
                    </TableRow>
                  );
                }
              }}
            />
          )}

          {isClient && (
            <div className="mt-4 d-flex justify-content-end w-100">
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                // onClick={() => handleVisibleModal("submit")}
                onClick={() => submitRef.current.open()}
              >
                <span className="mr-1">
                  <FormattedMessage id="BUTTON.SUBMIT" />
                </span>
                <Send />
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

const keys = {
  submit: "submit-term-item",
  fetch: "get-task-by-id",
};

const mapState = (state) => ({
  loadings: {
    submit: getLoading(state, keys.submit),
    fetch: getLoading(state, keys.fetch),
  },
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
};

// export default connect(mapState, mapDispatch)(Summary);
export default Summary;
