import {
  TableCell,
  CircularProgress,
  Button,
  TableBody,
  Checkbox,
} from '@material-ui/core';
import React from 'react';
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  Send,
} from '@material-ui/icons';
import { Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import { Card, CardBody } from '../../../../../_metronic/_partials/controls';
import { StyledTableHead } from '../../../../components/tables/style';
import { StyledHead, StyledTable, StyledTableRow } from './style';
import { rupiah } from '../../../../libs/currency';
import Navs from '../../../../components/navs';
import { StyledModal } from '../../../../components/modals';

const theadItems = [
  { id: 'action', label: '' },
  { id: 'keterangan', label: 'Keterangan' },
  { id: 'due-date', label: 'Due Date' },
  { id: 'qty', label: 'Qty' },
  { id: 'uom', label: 'Uom' },
  { id: 'cost-center', label: 'Cost Center' },
  { id: 'wbs', label: 'WBS' },
];

const navLists = [
  { id: 'link-jasa', label: 'Jasa' },
  { id: 'link-barang', label: 'Barang' },
];

export default function Summary({ taskId = '' }) {
  const [loading, setLoading] = React.useState(false);
  const [navActive, setNavActive] = React.useState(navLists[0].id);
  const [itemBarang, setItemBarang] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [Toast, setToast] = useToast();
  const { dataJasa, dataBarang } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();

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

  const addCheckedField = (data, type) => {
    if (type === 'barang') {
      data.forEach((item) => {
        if (!item.item) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      });
    }

    if (type === 'jasa') {
      data.forEach((item) => {
        item.item_services.forEach((service) => {
          if (!service.service) {
            service.checked = false;
          } else {
            service.checked = true;
          }
        });
      });
    }
  };

  const getAllItems = async (taskId) => {
    try {
      enableLoading();

      const {
        data: { data },
      } = await deliveryMonitoring.getTaskById(taskId);

      const tempDataJasa = data.task_item_services;
      const tempDataBarang = data.task_items;

      addShowField(tempDataJasa);
      addCheckedField(tempDataJasa, 'jasa');
      addCheckedField(tempDataBarang, 'barang');

      dispatch({
        type: actionTypes.SetDataJasa,
        payload: tempDataJasa,
      });

      dispatch({
        type: actionTypes.SetDataBarang,
        payload: tempDataBarang,
      });
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      disableLoading();
    }
  };

  React.useEffect(() => {
    getAllItems(taskId);
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

  const removeFromSubmitItem = (itemId) => {
    const tempBarang = dataBarang;
    let tempSubmitBarang = itemBarang;

    tempBarang.forEach((item) => {
      if (item.id === itemId && !item.checked) {
        tempSubmitBarang = tempSubmitBarang.filter(
          (item) => item.item_id !== itemId
        );
      }
    });

    setItemBarang(tempSubmitBarang);
  };

  const handleChecklistBarang = (qtyValue, itemId, desc) => {
    addSubmitItem(qtyValue, itemId, desc);

    let tempBarang = dataBarang;

    tempBarang.forEach((item) => {
      // Check if already submit
      if (item.item === undefined) {
        if (item.id === itemId) {
          item.checked = !item.checked;
        }
      } else {
        if (item.item_id === itemId) {
          item.checked = !item.checked;
        }
      }
    });

    dispatch({
      type: actionTypes.SetDataBarang,
      payload: tempBarang,
    });

    if (itemBarang.length > 0) {
      removeFromSubmitItem(itemId);
    }
  };

  const handleChecklistJasa = (itemId, serviceId) => {
    let tempJasa = dataJasa;

    tempJasa.forEach((item) => {
      if (item.id === itemId) {
        item.item_services.forEach((service) => {
          // Check if already submit
          if (service.service === undefined) {
            if (service.id === serviceId) {
              service.checked = !service.checked;
            }
          } else {
            if (service.service_id === serviceId) {
              service.checked = !service.checked;
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

  const addSubmitItem = (qtyValue, itemId, desc) => {
    const tempSubmitItems = itemBarang;

    const submitItem = {
      item_id: itemId,
      qty: qtyValue,
      desc: desc,
    };

    if (tempSubmitItems.length === 0) {
      tempSubmitItems.push(submitItem);
    }

    if (tempSubmitItems.length > 0) {
      const findItem = tempSubmitItems.find((item) => item.item_id === itemId);

      if (findItem) {
        tempSubmitItems.forEach((item) => {
          if (item.item_id === itemId) {
            item.qty = qtyValue;
          }
        });
      }

      if (!findItem) {
        tempSubmitItems.push(submitItem);
      }
    }

    setItemBarang(tempSubmitItems);
  };

  const handleSubmit = async () => {
    try {
      enableLoading();

      const requestData = {
        task_items: itemBarang,
        task_services: [],
      };

      // console.log(requestData);

      const {
        data: { status },
      } = await deliveryMonitoring.submitItems(requestData, taskId);

      if (status) {
        getAllItems(taskId);
        setShowModal(false);
      }
    } catch (error) {
      setToast('Error API, Please contact developer!');
    } finally {
      disableLoading();
    }
  };

  return (
    <div>
      <Toast />

      <StyledModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        minWidth="70vw"
      >
        {itemBarang.length > 0 && (
          <div>
            <h4>Barang</h4>
            <table className="table table-bordered table-hover">
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

        {itemBarang.length > 0 ? (
          <div>
            <p>Anda yakin ingin submit data tersebut?</p>
            <div className="d-flex justify-content-end w-100">
              <Button
                className="btn btn-secondary border-success mr-3"
                onClick={() => setShowModal(false)}
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
          <p>Tidak ada data yang dipilih</p>
        )}
      </StyledModal>

      <Card>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          {navActive === 'link-jasa' && (
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
                      {dataJasa.length < 1 ? (
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
                      {dataJasa.map((item) => {
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
                              <TableCell className="align-middle">
                                {/* 31/01/2021 */}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                            </StyledTableRow>

                            {item.item_services.length !== 0 && item.show
                              ? item.item_services.map((service) => {
                                  // Check if already submit
                                  if (service.service === undefined) {
                                    return (
                                      <StyledTableRow key={service.id}>
                                        <TableCell className="align-middle">
                                          <Checkbox
                                            name={`checkbox-${service.id}`}
                                            color="secondary"
                                            onChange={() =>
                                              handleChecklistJasa(
                                                item.id,
                                                service.id
                                              )
                                            }
                                            size="small"
                                            checked={service.checked}
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
                                            min={0}
                                            max={service.qty_available}
                                            disabled={!service.checked}
                                            defaultValue={service.quantity}
                                          />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {service.base_uom}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {rupiah(service.net_value)}
                                        </TableCell>
                                        <TableCell className="align-middle"></TableCell>
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
                                                item.id,
                                                service.service.id
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
                                            min={0}
                                            max={service.service.qty_available}
                                            disabled={!service.checked}
                                            defaultValue={
                                              service.service.quantity
                                            }
                                          />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {service.service.base_uom}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                          {rupiah(service.service.net_value)}
                                        </TableCell>
                                        <TableCell className="align-middle"></TableCell>
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

          {navActive === 'link-barang' && (
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
                      {dataBarang.length < 1 ? (
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
                              <StyledTableRow key={item.id}>
                                <TableCell className="align-middle">
                                  <Checkbox
                                    name={`checkbox-${item.id}`}
                                    color="secondary"
                                    onChange={() =>
                                      handleChecklistBarang(
                                        item.qty_available,
                                        item.id,
                                        item.desc
                                      )
                                    }
                                    size="small"
                                    width={50}
                                    variant="body"
                                    checked={item.checked}
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
                                    min={0}
                                    max={item.qty_available}
                                    disabled={!item.checked}
                                    defaultValue={item.qty}
                                    onChange={(e) =>
                                      addSubmitItem(
                                        e.target.value,
                                        item.id,
                                        item.desc
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="align-middle"></TableCell>
                                <TableCell className="align-middle">
                                  {rupiah(item.unit_price)}
                                </TableCell>
                                <TableCell className="align-middle"></TableCell>
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
                                      handleChecklistBarang(item.item.id)
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
                                    min={0}
                                    max={item.item.qty_available}
                                    disabled={!item.checked}
                                    defaultValue={item.item.qty}
                                  />
                                </TableCell>
                                <TableCell className="align-middle"></TableCell>
                                <TableCell className="align-middle">
                                  {rupiah(item.unit_price)}
                                </TableCell>
                                <TableCell className="align-middle"></TableCell>
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
              onClick={() => setShowModal(true)}
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
