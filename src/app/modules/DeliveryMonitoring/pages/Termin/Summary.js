import {
  TableCell,
  CircularProgress,
  Button,
  TableBody,
} from '@material-ui/core';
import React from 'react';
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  Send,
} from '@material-ui/icons';
import { Checkbox } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import { Card, CardBody } from '../../../../../_metronic/_partials/controls';
import { StyledTableHead } from '../../../../components/tables/style';
import { StyledHead, StyledTable, StyledTableRow } from './style';
import { rupiah } from '../../../../libs/currency';
import Navs from '../../../../components/navs';

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
  const [Toast, setToast] = useToast();
  const { dataJasa, dataBarang } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();

  const getAllItems = async (taskId) => {
    try {
      setLoading(true);

      const {
        data: { data },
      } = await deliveryMonitoring.getTaskById(taskId);

      dispatch({
        type: actionTypes.SetDataJasa,
        payload: data.task_item_services,
      });

      dispatch({
        type: actionTypes.SetDataBarang,
        payload: data.task_items,
      });
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
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

  return (
    <div>
      <Toast />

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
                              <TableCell className="align-middle">
                                {item.qty}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                            </StyledTableRow>

                            {item.item_services.length !== 0 && item.show
                              ? item.item_services.map((service) => (
                                  <StyledTableRow key={service.id}>
                                    <TableCell className="align-middle">
                                      <Checkbox
                                        name={`checkbox-${service.id}`}
                                        color="secondary"
                                        onChange={(e) => console.log(e)}
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {service.short_text}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {/* 31/01/2021 */}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {service.quantity}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {item.base_uom}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {rupiah(service.price_unit)}
                                    </TableCell>
                                    <TableCell className="align-middle"></TableCell>
                                  </StyledTableRow>
                                ))
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
                          return (
                            <StyledTableRow key={item.id}>
                              <TableCell className="align-middle">
                                <Checkbox
                                  name={`checkbox-${item.id}`}
                                  color="secondary"
                                  onChange={(e) => console.log(e)}
                                  size="small"
                                  width={50}
                                  variant="body"
                                />
                              </TableCell>
                              <TableCell className="align-middle">
                                {item.desc}
                              </TableCell>
                              <TableCell className="align-middle">
                                {/* 31/01/2021 */}
                              </TableCell>
                              <TableCell className="align-middle">
                                {item.qty}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle">
                                {rupiah(item.unit_price)}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                            </StyledTableRow>
                          );
                        })}
                    </TableBody>
                  </StyledTable>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end w-100">
            <Button variant="contained" color="secondary" size="medium">
              <span className="mr-1">Submit</span>
              <Send />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
