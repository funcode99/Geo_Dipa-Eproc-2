import {
  TableCell,
  CircularProgress,
  Button,
  TableBody,
  Checkbox,
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
import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";
import useToast from "../../../../components/toast";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { StyledTableHead } from "../../../../components/tables/style";
import { StyledHead, StyledTable, StyledTableRow } from "./style";
import { rupiah } from "../../../../libs/currency";
import Navs from "../../../../components/navs";
import { StyledModal } from "../../../../components/modals";
import { FormattedMessage } from "react-intl";

const theadItems = [
  { id: "action", label: "" },
  { id: "keterangan", label: "Keterangan" },
  { id: "due-date", label: "Due Date" },
  { id: "qty", label: "Qty" },
  { id: "uom", label: "Uom" },
  { id: "net-value", label: "Net Value" },
  // { id: 'wbs', label: 'WBS' },
];

const navLists = [
  { id: "link-jasa", label: <FormattedMessage id="SUMMARY.NAV.SERVICE" /> },
  { id: "link-barang", label: <FormattedMessage id="SUMMARY.NAV.ITEM" /> },
];

export default function Summary({ taskId = "" }) {
  const [loading, setLoading] = React.useState(false);
  const [navActive, setNavActive] = React.useState(navLists[0].id);
  const [itemBarang, setItemBarang] = React.useState([]);
  const [itemJasa, setItemJasa] = React.useState([]);
  const [showModal, setShowModal] = React.useState({
    submit: false,
    success: false,
  });
  const [Toast, setToast] = useToast();
  const { dataJasa, dataBarang } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();

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

  const handleVisibleModal = (key) => {
    setShowModal((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
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
    try {
      enableLoading();

      setInitialData();

      const {
        data: { data },
      } = await deliveryMonitoring.getTaskById(taskId);

      const tempDataJasa = data.task_item_services;
      const tempDataBarang = data.task_items;

      addShowField(tempDataJasa);
      addCheckedAndErrorField(tempDataJasa, "jasa");
      addCheckedAndErrorField(tempDataBarang, "barang");

      setInitialSubmitItems(tempDataJasa, "jasa");
      setInitialSubmitItems(tempDataBarang, "barang");

      setDataFromAPI(tempDataJasa, tempDataBarang);
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        setToast("Error, please contact developer!", 5000);
      }
      console.log(`error`, error);
    } finally {
      disableLoading();
    }
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
    const floatQtyAvailable = parseFloat(qtyAvailable);

    //validate quantity number
    if (!isValidQty || floatQty < 1 || floatQty > floatQtyAvailable) {
      removeFromSubmitItem(itemId, "barang");
      setToast(
        `Quantity should be greater than 0 and lower than ${qtyAvailable}`
      );
    } else {
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
    const floatQtyAvailable = parseFloat(qtyValue);

    //validate quantity number
    if (!isValidQty || floatQtyValue < 0 || floatQtyValue > floatQtyAvailable) {
      removeFromSubmitItem(serviceId, "jasa");
      setToast(
        `Quantity should be greater than 0 and lower than ${qtyAvailable}`
      );
    } else {
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
    try {
      enableLoading();

      const requestData = {
        task_items: itemBarang,
        task_services: itemJasa,
      };

      const {
        data: { status },
      } = await deliveryMonitoring.submitItems(requestData, taskId);

      if (status) {
        setToast("Successfully submit item", 5000);
        getAllItems(taskId);
        handleVisibleModal("submit");
      }
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        setToast("Error API, Please contact developer!", 5000);
      }
    } finally {
      disableLoading();
    }
  };

  return (
    <div>
      <Toast />

      {/* Modal ketika klik submit */}
      <StyledModal
        visible={showModal.submit}
        onClose={() => handleVisibleModal("submit")}
        minWidth="40vw"
        maxWidth="70vw"
      >
        {itemJasa.length > 0 && (
          <div>
            <h4>Jasa</h4>
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Keterangan</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {itemJasa.map((item, index) => (
                  <tr key={item.service_id}>
                    <td>{(index += 1)}</td>
                    <td>{item.desc}</td>
                    <td>{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {itemBarang.length > 0 && (
          <div>
            <h4>Barang</h4>
            <table className="table table-sm table-bordered table-hover">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Keterangan</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {itemBarang.map((item, index) => (
                  <tr key={item.item_id}>
                    <td>{(index += 1)}</td>
                    <td>{item.desc}</td>
                    <td>{item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {itemBarang.length > 0 || itemJasa.length > 0 ? (
          <div>
            <h6>Anda yakin ingin submit?</h6>
            <div className="d-flex justify-content-end w-100">
              <Button
                className="btn btn-secondary border-success mr-3"
                onClick={() => handleVisibleModal("submit")}
              >
                Batal
              </Button>
              <Button
                className="btn btn-success"
                onClick={() => handleSubmit()}
              >
                Ya
                {loading ? <CircularProgress /> : null}
              </Button>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <h6>Anda yakin ingin submit?</h6>
            <p>Tidak ada item yang dipilih untuk termin ini</p>
            <div className="d-flex justify-content-end">
              <Button
                className="btn btn-secondary border-success mr-3"
                onClick={() => handleVisibleModal("submit")}
              >
                Batal
              </Button>
              <Button
                className="btn btn-success"
                onClick={() => handleSubmit()}
              >
                Ya
                {loading ? <CircularProgress /> : null}
              </Button>
            </div>
          </div>
        )}
      </StyledModal>
      <Card>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          {/* component table jasa */}
          {navActive === "link-jasa" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5">
              <div className="segment-table">
                <div className="hecto-10">
                  <StyledTable className="table-bordered overflow-auto">
                    <StyledTableHead>
                      <StyledHead>
                        {theadItems.map((item) => (
                          <TableCell
                            className="text-white align-middle"
                            key={item.id}
                          >
                            {item.label}
                          </TableCell>
                        ))}
                      </StyledHead>
                    </StyledTableHead>
                    <TableBody>
                      {dataJasa?.length < 1 && !loading ? (
                        <StyledTableRow>
                          <TableCell
                            colSpan={theadItems.length}
                            className="text-center"
                          >
                            Empty Data
                          </TableCell>
                        </StyledTableRow>
                      ) : null}
                      {loading ? (
                        <StyledTableRow>
                          <TableCell
                            colSpan={theadItems.length}
                            className="text-center"
                          >
                            <CircularProgress />
                          </TableCell>
                        </StyledTableRow>
                      ) : null}
                      {dataJasa?.map((item) => {
                        return (
                          <React.Fragment key={item.id}>
                            <StyledTableRow>
                              <TableCell className="align-middle">
                                <button
                                  className="btn btn-primary btn-sm p-0 align-middle"
                                  onClick={(e) => handleExpand(e, item.id)}
                                >
                                  {item.show ? (
                                    <ExpandLessOutlined />
                                  ) : (
                                    <ExpandMoreOutlined />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="align-middle">
                                {item.desc}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              {/* <TableCell className="align-middle"></TableCell> */}
                            </StyledTableRow>

                            {item.item_services.length !== 0 && item.show
                              ? item.item_services.map((service) => {
                                  // Check if already submit
                                  if (service.service === undefined) {
                                    return (
                                      <StyledTableRow
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
                                              service.qty_available === 0
                                                ? true
                                                : false
                                            }
                                          />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {service.short_text}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {/* 31/01/2021 */}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {/* {service.quantity} */}
                                          <Form.Control
                                            type="number"
                                            size="sm"
                                            min="0.1"
                                            step="0.1"
                                            // min="1"
                                            // step="1"
                                            max={service.qty_available}
                                            disabled={!service.checked}
                                            defaultValue={service.qty_available}
                                            onChange={(e) =>
                                              addSubmitJasa(
                                                e.target.value,
                                                service.qty_available,
                                                service.id,
                                                service.short_text
                                              )
                                            }
                                            // onBlur={(e) =>
                                            //   addSubmitJasa(
                                            //     e.target.value,
                                            //     service.qty_available,
                                            //     service.id,
                                            //     service.short_text
                                            //   )
                                            // }
                                          />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {service.base_uom}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {rupiah(service.net_value)}
                                        </TableCell>
                                        {/* <TableCell className="align-middle"></TableCell> */}
                                      </StyledTableRow>
                                    );
                                  } else {
                                    return (
                                      <StyledTableRow key={service.service.id}>
                                        <TableCell className="align-middle">
                                          <Checkbox
                                            name={`checkbox-${service.service.id}`}
                                            color="secondary"
                                            onChange={() =>
                                              handleChecklistJasa(
                                                service.service.quantity,
                                                service.qty,
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
                                        <TableCell className="align-middle">
                                          {/* {service.quantity} */}
                                          <Form.Control
                                            type="number"
                                            size="sm"
                                            min="0.1"
                                            step="0.1"
                                            // min="1"
                                            // step="1"
                                            max={service.service.quantity}
                                            disabled={!service.checked}
                                            defaultValue={service.qty}
                                            onChange={(e) =>
                                              addSubmitJasa(
                                                e.target.value,
                                                service.service.quantity,
                                                service.service.id,
                                                service.service.short_text
                                              )
                                            }
                                            // onBlur={(e) =>
                                            //   addSubmitJasa(
                                            //     e.target.value,
                                            //     service.service.quantity,
                                            //     service.service.id,
                                            //     service.service.short_text
                                            //   )
                                            // }
                                          />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {service.service.base_uom}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {rupiah(service.service.net_value)}
                                        </TableCell>
                                        {/* <TableCell className="align-middle"></TableCell> */}
                                      </StyledTableRow>
                                    );
                                  }
                                })
                              : null}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </StyledTable>
                </div>
              </div>
            </div>
          )}

          {/* component table barang */}
          {navActive === "link-barang" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5">
              <div className="segment-table">
                <div className="hecto-10">
                  <StyledTable className="table-bordered overflow-auto">
                    <StyledTableHead>
                      <StyledHead>
                        {theadItems.map((item) => (
                          <TableCell
                            className="text-white align-middle"
                            key={item.id}
                          >
                            {item.label}
                          </TableCell>
                        ))}
                      </StyledHead>
                    </StyledTableHead>
                    <TableBody>
                      {dataBarang.length < 1 && !loading ? (
                        <StyledTableRow>
                          <TableCell
                            colSpan={theadItems.length}
                            className="text-center"
                          >
                            Empty Data
                          </TableCell>
                        </StyledTableRow>
                      ) : null}
                      {loading ? (
                        <StyledTableRow>
                          <TableCell
                            colSpan={theadItems.length}
                            className="text-center"
                          >
                            <CircularProgress />
                          </TableCell>
                        </StyledTableRow>
                      ) : null}
                      {dataBarang.length !== 0 &&
                        dataBarang.map((item) => {
                          // Check if already submit
                          if (item.item === undefined) {
                            return (
                              <StyledTableRow
                                key={item.id}
                                className={
                                  item.qty_available === 0
                                    ? `bg-secondary`
                                    : null
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
                                    disabled={
                                      item.qty_available === 0 ? true : false
                                    }
                                  />
                                </TableCell>
                                <TableCell className="align-middle">
                                  {item.desc}
                                </TableCell>
                                <TableCell className="align-middle">
                                  {/* 31/01/2021 */}
                                </TableCell>
                                <TableCell className="align-middle">
                                  <Form.Control
                                    type="number"
                                    size="sm"
                                    min={1}
                                    max={item.qty_available}
                                    disabled={!item.checked}
                                    defaultValue={item.qty_available}
                                    onChange={(e) =>
                                      addSubmitBarang(
                                        e.target.value,
                                        item.qty_available,
                                        item.id,
                                        item.desc
                                      )
                                    }
                                    // onBlur={(e) =>
                                    //   addSubmitBarang(
                                    //     e.target.value,
                                    //     item.qty_available,
                                    //     item.id,
                                    //     item.desc
                                    //   )
                                    // }
                                  />
                                </TableCell>
                                <TableCell className="align-middle"></TableCell>
                                <TableCell className="align-middle">
                                  {rupiah(item.unit_price)}
                                </TableCell>
                                {/* <TableCell className="align-middle"></TableCell> */}
                              </StyledTableRow>
                            );
                          } else {
                            return (
                              <StyledTableRow key={item.item.id}>
                                <TableCell className="align-middle">
                                  <Checkbox
                                    name={`checkbox-${item.item.id}`}
                                    color="secondary"
                                    onChange={() =>
                                      handleChecklistBarang(
                                        item.item.qty,
                                        item.item.qty_available,
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
                                  <Form.Control
                                    type="number"
                                    size="sm"
                                    min={1}
                                    max={item.item.qty_available}
                                    disabled={!item.checked}
                                    defaultValue={item.qty}
                                    onChange={(e) =>
                                      addSubmitBarang(
                                        e.target.value,
                                        item.item.qty_available,
                                        item.item.id,
                                        item.item.desc
                                      )
                                    }
                                    // onBlur={(e) =>
                                    //   addSubmitBarang(
                                    //     e.target.value,
                                    //     item.item.qty_available,
                                    //     item.item.id,
                                    //     item.item.desc
                                    //   )
                                    // }
                                  />
                                </TableCell>
                                <TableCell className="align-middle"></TableCell>
                                <TableCell className="align-middle">
                                  {rupiah(item.item.unit_price)}
                                </TableCell>
                                {/* <TableCell className="align-middle"></TableCell> */}
                              </StyledTableRow>
                            );
                          }
                        })}
                    </TableBody>
                  </StyledTable>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end w-100">
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => handleVisibleModal("submit")}
            >
              <span className="mr-1">Submit</span>
              <Send />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
