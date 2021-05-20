import { makeStyles, CircularProgress } from '@material-ui/core';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { Checkbox } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import { Card, CardBody } from '../../../../../_metronic/_partials/controls';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
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

  const handleNavClick = (type) => {
    setNavActive(type);
  };

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
    <div className={classes.root}>
      <Toast />

      <Card>
        <CardBody>
          <Nav variant="pills" defaultActiveKey="link-jasa">
            <Nav.Item onClick={() => handleNavClick('Jasa')}>
              <Nav.Link eventKey="link-jasa" className={classes.navLink}>
                Jasa
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={() => handleNavClick('Barang')}>
              <Nav.Link eventKey="link-barang" className={classes.navLink}>
                Barang
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {navActive === 'Jasa' && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5">
              <div className="segment-table">
                <div className="hecto-10">
                  <table className="table-bordered overflow-auto">
                    <thead>
                      <tr>
                        {theadItems.map((item) => (
                          <th
                            className="bg-primary text-white align-middle"
                            key={item.id}
                          >
                            {item.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {loading ? (
                      <tbdody>
                        <tr hover>
                          <td colSpan={4} className="align-middle">
                            <CircularProgress />
                          </td>
                        </tr>
                      </tbdody>
                    ) : null}
                    {dataJasa.length !== 0 &&
                      dataJasa.map((item) => {
                        return (
                          <React.Fragment key={item.id}>
                            <tbody>
                              <tr>
                                <td className="align-middle">
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
                                </td>
                                <td className="align-middle">{item.name}</td>
                                <td className="align-middle">31/01/2021</td>
                                <td className="align-middle">{item.qty}</td>
                                <td className="align-middle"></td>
                                <td className="align-middle">{item.price}</td>
                                <td className="align-middle"></td>
                              </tr>
                            </tbody>
                            {item.services.length !== 0 && item.show ? (
                              <tbody>
                                {item.services.map((service) => (
                                  <tr key={service.id}>
                                    <td className="align-middle">
                                      <Checkbox
                                        name={`checkbox-${service.id}`}
                                        color="secondary"
                                        onChange={(e) => console.log(e)}
                                        size="small"
                                      />
                                    </td>
                                    <td className="align-middle">
                                      {service.name}
                                    </td>
                                    <td className="align-middle">31/01/2021</td>
                                    <td className="align-middle">
                                      {service.qty}
                                    </td>
                                    <td className="align-middle"></td>
                                    <td className="align-middle">
                                      {service.price}
                                    </td>
                                    <td className="align-middle"></td>
                                  </tr>
                                ))}
                              </tbody>
                            ) : null}
                          </React.Fragment>
                        );
                      })}
                  </table>
                </div>
              </div>
            </div>
          )}

          {navActive === 'Barang' && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5">
              <div className="segment-table">
                <div className="hecto-10">
                  <table className="table-bordered overflow-auto">
                    <thead>
                      <tr>
                        {theadItems.map((item) => (
                          <th
                            className="bg-primary text-white align-middle"
                            key={item.id}
                          >
                            {item.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {loading ? (
                      <tbdody>
                        <tr hover>
                          <td colSpan={4} className="align-middle">
                            <CircularProgress />
                          </td>
                        </tr>
                      </tbdody>
                    ) : null}
                    <tbody>
                      {dataBarang.length !== 0 &&
                        dataBarang.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td className="align-middle">
                                <Checkbox
                                  name={`checkbox-${item.id}`}
                                  color="secondary"
                                  onChange={(e) => console.log(e)}
                                  size="small"
                                  width={50}
                                  variant="body"
                                />
                              </td>
                              <td className="align-middle">{item.name}</td>
                              <td className="align-middle">31/01/2021</td>
                              <td className="align-middle">{item.qty}</td>
                              <td className="align-middle"></td>
                              <td className="align-middle">{item.price}</td>
                              <td className="align-middle"></td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
