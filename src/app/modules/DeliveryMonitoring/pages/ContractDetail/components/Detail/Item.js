import React from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import { Form, Container } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../libs/currency";
import Navs from "../../../../../../components/navs";
import useToast from "../../../../../../components/toast";
// import TableItem from "./TableItem";
import TableItemNew from "./TableItemNew";
// import { StyledTableRow } from "../../../../../../components/tables/style";
import { TableCell, TableRow, Checkbox, Button } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import RowAccordion from "./RowAccordion";
import ExpansionBox from "../../../../../../components/boxes/ExpansionBox";
import { theadService, theadItem } from "./fieldData";

const navLists = [
  { id: "link-jasa", label: <FormattedMessage id="SUMMARY.NAV.SERVICE" /> },
  { id: "link-barang", label: <FormattedMessage id="SUMMARY.NAV.ITEM" /> },
];

const Item = ({ handleClick, status }) => {
  const { dataContractById, dataSubmitItems } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();
  const [Toast, setToast] = useToast();
  const [navActive, setNavActive] = React.useState(navLists[0].id);
  const [loading, setLoading] = React.useState(false);
  const [qtyErrors, setQtyErrors] = React.useState([]);
  const isClient = status === "client";

  const changeChecked = (item) => {
    item.checked = !item.checked;
  };

  const addSubmitItems = (items, type) => {
    const tempSubmitItems = dataSubmitItems;

    if (type === "jasa") {
      //cari di submitItems
      const findItem = tempSubmitItems.task_services.find(
        (item) => item.service_id === items.service_id
      );

      // jika gak ada maka push
      if (!findItem) {
        tempSubmitItems.task_services.push(items);
      }

      // jika ada maka update qty
      if (findItem) {
        tempSubmitItems.task_services.forEach((item) => {
          if (item.service_id === items.service_id) {
            item.qty = items.qty;
          }
        });
      }
    }

    if (type === "barang") {
      //cari di submitItems
      const findItem = tempSubmitItems.task_items.find(
        (item) => item.item_id === items.item_id
      );

      // jika gak ada maka push
      if (!findItem) {
        tempSubmitItems.task_items.push(items);
      }

      // jika ada maka update qty
      if (findItem) {
        tempSubmitItems.task_items.forEach((item) => {
          if (item.item_id === items.item_id) {
            item.qty = items.qty;
          }
        });
      }
    }

    // setSubmitItems(tempSubmitItems);
    dispatch({
      type: actionTypes.SetSubmitItemsByContractId,
      payload: tempSubmitItems,
    });
  };

  const handleChecklist = (e, items, item = { id: "", type: "" }) => {
    const tempContract = dataContractById;

    if (item.type === "jasa") {
      tempContract.services.forEach((tempService) => {
        if (tempService.id === item.id) {
          tempService.item_services.forEach((service) => {
            if (service.id === items.id) {
              changeChecked(service);

              if (service.checked === false) {
                removeFromSubmitItem(items, item.type);
              }

              if (service.checked === true) {
                addSubmitItems(
                  {
                    service_id: items.id,
                    qty: items.qty_available,
                    name: items.short_text,
                    price: items.net_value,
                  },
                  "jasa"
                );
              }
            }
          });
        }
      });
    }

    if (item.type === "barang") {
      tempContract.items.forEach((tempItem) => {
        if (tempItem.id === items.id) {
          changeChecked(tempItem);

          if (tempItem.checked === false) {
            removeFromSubmitItem(items, item.type);
          }

          if (tempItem.checked === true) {
            addSubmitItems(
              {
                item_id: items.id,
                qty: items.qty_available,
                name: items.desc,
                price: items.unit_price,
              },
              "barang"
            );
          }
        }
      });
    }

    // console.log(submitItems);
    dispatch({
      type: actionTypes.SetContractById,
      payload: tempContract,
    });
  };

  const removeFromSubmitItem = (items, type) => {
    const tempSubmitItems = dataSubmitItems;
    // console.log(items);
    // console.log(tempSubmitItems);

    if (type === "barang") {
      tempSubmitItems.task_items = tempSubmitItems.task_items.filter(
        (item) => item.item_id !== items.id
      );
      // console.log(tempSubmitItems.task_items);
    }

    if (type === "jasa") {
      tempSubmitItems.task_services = tempSubmitItems.task_services.filter(
        (item) => item.service_id !== items.id
      );
    }

    // setSubmitItems(tempSubmitItems);
    dispatch({
      type: actionTypes.SetSubmitItemsByContractId,
      payload: tempSubmitItems,
    });
  };

  const validateQty = (qtyValue, items, type) => {
    const isValidQty = parseFloat(qtyValue) ? true : false;
    const floatQtyValue = qtyValue;
    // const floatQtyAvailable = parseFloat(items.qty_available).toFixed(1);
    const floatQtyAvailable = parseFloat(items.qty_available);
    let minValue = 0.1;
    // console.log(items);

    // if (type === "jasa") {
    //   minValue = 0.1;
    // } else if (type === "barang") {
    //   minValue = 1;
    // }

    if (
      !isValidQty ||
      floatQtyValue < minValue ||
      floatQtyValue > floatQtyAvailable
    ) {
      // console.log('salah');
      removeFromSubmitItem(items, type);
      let temp = [...qtyErrors];
      const find = temp.find((item) => item === items.id);
      if (!find) {
        setQtyErrors([...qtyErrors, items.id]);
      }

      // setToast(
      //   <FormattedMessage
      //     id="MESSAGE.VALIDATE_QTY"
      //     values={{ minValue, floatQtyAvailable }}
      //   />
      // );
    } else {
      let temp = [...qtyErrors];
      temp = temp.filter((item) => item !== items.id);
      setQtyErrors(temp);
    }
  };

  const handleInputQty = (qtyValue, items, type) => {
    // console.log(qtyValue);
    // console.log(items);
    // console.log(type);

    if (type === "jasa") {
      addSubmitItems(
        {
          service_id: items.id,
          qty: qtyValue,
          name: items.short_text,
          price: items.net_value,
        },
        "jasa"
      );
    }

    if (type === "barang") {
      addSubmitItems(
        {
          item_id: items.id,
          qty: qtyValue,
          name: items.desc,
          price: items.unit_price,
        },
        "barang"
      );
    }

    validateQty(qtyValue, items, type);
  };

  return (
    <React.Fragment>
      <Toast />

      <Container>
        <ExpansionBox title={"TITLE.ITEM_TABLE"}>
          <div className="mb-5">
            <Navs
              navLists={navLists}
              handleSelect={(selectedKey) => setNavActive(selectedKey)}
            />
          </div>

          {navActive === "link-jasa" && (
            <TableItemNew
              withPagination={false}
              tableHeader={theadService}
              dataRows={dataContractById.services}
              loading={loading}
              renderRows={({ item, index }) => {
                let el = item;
                return (
                  <RowAccordion
                    key={el.id}
                    data={["accordIcon", el.desc, "", "", "", "", ""]}
                    dataAll={el.item_services}
                  >
                    {(item) => {
                      return item?.map((item2) => {
                        return (
                          <TableRow
                            hover
                            // onClick={
                            //   (e) =>
                            //     handleChecklist(e, item2, {
                            //       id: el.id,
                            //       type: "jasa",
                            //     })
                            //   // console.log(e)
                            // }
                            key={item2?.id}
                          >
                            <TableCell>
                              <Checkbox
                                name={`checkbox-${item2.id}`}
                                id={`checkbox-${item2.id}`}
                                color="secondary"
                                onChange={
                                  (e) =>
                                    handleChecklist(e, item2, {
                                      id: el.id,
                                      type: "jasa",
                                    })
                                  // console.log(e)
                                }
                                size="small"
                                checked={item2.checked}
                                disabled={
                                  item2.qty_available === 0 ? true : false
                                }
                              />
                            </TableCell>
                            <TableCell>{item2?.short_text}</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{item2?.quantity}</TableCell>
                            <TableCell>
                              {isClient ? (
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  min="0.1"
                                  step="0.1"
                                  style={{
                                    width: 80,
                                    flex: "none",
                                  }}
                                  max={item2?.qty_available}
                                  disabled={!item2.checked ? true : false}
                                  defaultValue={parseFloat(
                                    item2.qty_available
                                  ).toFixed(1)}
                                  onChange={(e) =>
                                    handleInputQty(
                                      e.target.value,
                                      item2,
                                      "jasa"
                                    )
                                  }
                                />
                              ) : (
                                parseFloat(item2.qty_available).toFixed(1)
                              )}
                              {qtyErrors.find((el) => el === item2.id) && (
                                <span className="text-danger">
                                  Max qty{" "}
                                  {parseFloat(item2.qty_available).toFixed(1)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {el?.measurement_unit?.ident_name}
                            </TableCell>
                            <TableCell>{rupiah(item2?.net_value)}</TableCell>
                          </TableRow>
                        );
                      });
                    }}
                  </RowAccordion>
                );
              }}
            />
          )}
          {navActive === "link-barang" && (
            <TableItemNew
              withPagination={true}
              tableHeader={theadItem}
              dataRows={dataContractById.items}
              loading={loading}
              renderRows={({ item, index }) => {
                return (
                  <TableRow hover key={item?.id}>
                    <TableCell>
                      <Checkbox
                        name={`checkbox-${item.id}`}
                        id={`checkbox-${item.id}`}
                        color="secondary"
                        onChange={(e) =>
                          handleChecklist(e, item, {
                            id: item.id,
                            type: "barang",
                          })
                        }
                        size="small"
                        checked={item.checked}
                        disabled={item.qty_available === 0 ? true : false}
                      />
                    </TableCell>
                    <TableCell>{item?.desc}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{item?.qty}</TableCell>
                    <TableCell>
                      {isClient ? (
                        <Form.Control
                          type="number"
                          size="sm"
                          min="0.1"
                          step="0.1"
                          style={{
                            width: 80,
                            flex: "none",
                          }}
                          max={item?.qty_available}
                          disabled={!item.checked ? true : false}
                          defaultValue={parseFloat(item.qty_available).toFixed(
                            1
                          )}
                          onChange={(e) =>
                            handleInputQty(e.target.value, item, "barang")
                          }
                        />
                      ) : (
                        parseFloat(item.qty_available).toFixed(1)
                      )}
                      {qtyErrors.find((el) => el === item.id) ? (
                        <span className="text-danger">
                          Max qty {parseFloat(item.qty_available).toFixed(1)}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>{item?.measurement_unit?.ident_name}</TableCell>
                    <TableCell>{rupiah(item?.unit_price)}</TableCell>
                  </TableRow>
                );
              }}
            />
          )}

          {/* {navActive === "link-jasa" && (
            <TableItem data={dataContractById.services} loading={loading}>
              {dataContractById.services?.map((el) => {
                return (
                  <RowAccordion
                    key={el.id}
                    data={["accordIcon", el.desc, "", "", "", ""]}
                    dataAll={el.item_services}
                  >
                    {(item) => {
                      return item?.map((item2) => {
                        return (
                          <StyledTableRow key={item2?.id}>
                            <TableCell>
                              <Checkbox
                                name={`checkbox-${item2.id}`}
                                id={`checkbox-${item2.id}`}
                                color="secondary"
                                onChange={
                                  (e) =>
                                    handleChecklist(e, item2, {
                                      id: el.id,
                                      type: "jasa",
                                    })
                                  // console.log(e)
                                }
                                size="small"
                                checked={item2.checked}
                                disabled={
                                  item2.qty_available === 0 ? true : false
                                }
                              />
                            </TableCell>
                            <TableCell>{item2?.short_text}</TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <Form.Control
                                type="number"
                                size="sm"
                                min="0.1"
                                step="0.1"
                                max={item2?.qty_available}
                                disabled={!item2.checked ? true : false}
                                defaultValue={item2.qty_available}
                                onChange={(e) =>
                                  handleInputQty(e.target.value, item2, "jasa")
                                }
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>{rupiah(item2?.net_value)}</TableCell>
                          </StyledTableRow>
                        );
                      });
                    }}
                  </RowAccordion>
                );
              })}
            </TableItem>
          )} */}

          {/* {navActive === "link-barang" && (
            <TableItem data={dataContractById.items} loading={loading}>
              {dataContractById.items?.map((item) => {
                return (
                  <StyledTableRow key={item?.id}>
                    <TableCell>
                      <Checkbox
                        name={`checkbox-${item.id}`}
                        id={`checkbox-${item.id}`}
                        color="secondary"
                        onChange={(e) =>
                          handleChecklist(e, item, {
                            id: item.id,
                            type: "barang",
                          })
                        }
                        size="small"
                        checked={item.checked}
                        disabled={item.qty_available === 0 ? true : false}
                      />
                    </TableCell>
                    <TableCell>{item?.desc}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Form.Control
                        type="number"
                        size="sm"
                        min="1"
                        step="1"
                        max={item?.qty_available}
                        disabled={!item.checked ? true : false}
                        defaultValue={item.qty_available}
                        onChange={(e) =>
                          handleInputQty(e.target.value, item, "barang")
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{rupiah(item?.unit_price)}</TableCell>
                  </StyledTableRow>
                );
              })}
            </TableItem>
          )} */}

          {isClient && (
            <div className="d-flex justify-content-end w-100 mt-4">
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                onClick={handleClick}
              >
                <span className="mr-1">
                  <FormattedMessage id="BUTTON.SUBMIT" />
                </span>
                <Send />
              </Button>
            </div>
          )}
        </ExpansionBox>
      </Container>
    </React.Fragment>
  );
};

const mapState = (state) => ({
  status: state.auth.user.data.status,
});

const mapDispatch = () => ({});

export default connect(mapState, mapDispatch)(Item);
