import {
  TableCell,
  makeStyles,
  CircularProgress,
  Button,
  TableBody,
} from '@material-ui/core';
import React from 'react';
import { Nav } from 'react-bootstrap';
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

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  navLink: {
    fontWeight: 600,
  },
}));

const theadItems = [
  { id: 'action', label: '' },
  { id: 'keterangan', label: 'Keterangan' },
  { id: 'due-date', label: 'Due Date' },
  { id: 'qty', label: 'Qty' },
  { id: 'uom', label: 'Uom' },
  { id: 'cost-center', label: 'Cost Center' },
  { id: 'wbs', label: 'WBS' },
];

export default function Summary() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [Toast, setToast] = useToast();
  const [navActive, setNavActive] = React.useState('Jasa');
  const { dataJasa, dataBarang } = useSelector(
    (state) => state.deliveryMonitoring
  );
  const dispatch = useDispatch();

  const getAllItems = async (isService) => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getAllItems(isService);

      if (isService) {
        data.forEach((item) => {
          item.show = false;
        });

        dispatch({
          type: actionTypes.SetDataJasa,
          payload: data,
        });
      } else {
        dispatch({
          type: actionTypes.SetDataBarang,
          payload: data,
        });
      }
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllItems(true);
    getAllItems(false);
    // eslint-disable-next-line
  }, []);

  const handleExpand = (event, itemId) => {
    let tempJasa = dataJasa;

    tempJasa.forEach((item) => {
      if (item.id === parseInt(itemId)) {
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
          <Nav variant="pills" defaultActiveKey="link-jasa">
            <Nav.Item onClick={() => setNavActive('Jasa')}>
              <Nav.Link eventKey="link-jasa" className={classes.navLink}>
                Jasa
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => setNavActive('Barang')}>
              <Nav.Link eventKey="link-barang" className={classes.navLink}>
                Barang
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {navActive === 'Jasa' && (
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
                                {item.name}
                              </TableCell>
                              <TableCell className="align-middle">
                                31/01/2021
                              </TableCell>
                              <TableCell className="align-middle">
                                {item.qty}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle">
                                {rupiah(item.price)}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                            </StyledTableRow>

                            {item.services.length !== 0 && item.show
                              ? item.services.map((service) => (
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
                                      {service.name}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      31/01/2021
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {service.qty}
                                    </TableCell>
                                    <TableCell className="align-middle"></TableCell>
                                    <TableCell className="align-middle">
                                      {rupiah(service.price)}
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

          {navActive === 'Barang' && (
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
                                {item.name}
                              </TableCell>
                              <TableCell className="align-middle">
                                31/01/2021
                              </TableCell>
                              <TableCell className="align-middle">
                                {item.qty}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle">
                                {rupiah(item.price)}
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
