import { makeStyles, CircularProgress } from '@material-ui/core';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { StyledModal } from '../../../../components/modals';
import { SelectStyled, CheckBoxStyled } from './style';

import { Checkbox } from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';

import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  navLink: {
    fontWeight: 600,
  },
}));

const docOptions = [
  {
    id: 1,
    name: 'Laporan Pekerjaan',
    document: [
      {
        id: 1,
        name: 'Harian',
      },
      {
        id: 2,
        name: 'Mingguan',
      },
      {
        id: 3,
        name: 'Bulanan',
      },
    ],
  },
  {
    id: 2,
    name: 'Dokumen Pendukung',
    document: [
      {
        id: 1,
        name: 'MSDS',
      },
      {
        id: 2,
        name: 'Manual Book',
      },
      {
        id: 3,
        name: 'Sertifika Kalibrasi',
      },
    ],
  },
  {
    id: 3,
    name: 'BAPP/BAST',
    document: [
      {
        id: 1,
        name: 'BAPP',
      },
      {
        id: 2,
        name: 'BAST',
      },
    ],
  },
  {
    id: 4,
    name: 'Dokumen Lain-lain',
  },
];

const rowDoc = [
  {
    id: 1,
    type: 'Laporan Pekerjaan',
    show: false,
    child: [
      {
        id: '1',
        nama: 'Minggu 1',
        due_date: '01 Jan 2021',
        mo: 'M',
      },
      {
        id: '2',
        nama: 'Minggu 2',
        due_date: '07 Jan 2021',
        mo: 'M',
      },
    ],
  },
  {
    id: 2,
    type: 'Dokumen Pendukung',
    show: false,
    child: [
      {
        id: '5',
        nama: 'FAT',
        due_date: '31 Jan 2021',
        mo: 'M',
      },
      {
        id: '6',
        nama: 'SAT',
        due_date: '31 Jan 2021',
        mo: 'M',
      },
    ],
  },
];

const theadItems = [
  { id: 'action', label: '' },
  { id: 'keterangan', label: 'Keterangan' },
  { id: 'due-date', label: 'Due Date' },
  { id: 'qty', label: 'Qty' },
  { id: 'uom', label: 'Uom' },
  { id: 'cost-center', label: 'Cost Center' },
  { id: 'wbs', label: 'WBS' },
];

const theadDocuments = [
  { id: 'action', label: '' },
  { id: 'scope-of-work', label: 'Scope of Work' },
  { id: 'delivery-date', label: 'Delivery Date' },
  { id: 'bobot', label: 'Bobot(%)' },
  { id: 'harga-pekerjaan', label: 'Harga Pekerjaan' },
  { id: 'progress', label: 'Project Progress(%)' },
  { id: 'dokumen-progress', label: 'Dokumen Progress' },
  { id: 'deliv-dokumen', label: 'Deliverable Dokumen' },
  { id: 'aksi', label: 'aksi' },
];

export default function Summary(props) {
  const classes = useStyles();

  const [showChild, setShowChild] = React.useState({ show: false, data: {} });
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [showEditDoc, setShowEditDoc] = React.useState(false);
  const [showAddDelivModal, setShowAddDelivModal] = React.useState(false);
  const [docId, setDocId] = React.useState(0);
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

  const handleShowAddDelivModal = () => setShowAddDelivModal(true);
  const handleShowModalDelete = () => setShowModalDelete(true);
  const handleShowEditDoc = () => setShowEditDoc(true);

  const showDocOption = (key) => {
    if (key === 4) {
      return (
        <div className="form-group">
          <label for="doc" className="h3">
            Document
          </label>
          <input
            type="text"
            className="form-control"
            id="doc"
            name="doc"
            placeholder="Ketikkan nama dokumen"
          />
        </div>
      );
    } else if (key !== 0) {
      return (
        <CheckBoxStyled label="Document" list={docOptions} keyId={docId} />
      );
    } else {
      return null;
    }
  };

  const handleSelectChange = (event) => {
    const docId = +event.target.value;
    setDocId(docId);
  };

  const handleChildDoc = (id) => {
    rowDoc.forEach((item) => {
      if (id === item.id) {
        setShowChild({ show: !showChild.show, data: item });
      }
    });
  };

  const childTables = (itemId) => {
    if (showChild.show && showChild.data.id === itemId) {
      return (
        <tbody>
          {showChild.data.child.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">
                <div className="d-flex justify-content-center">
                  <i className="fa fa-file"></i>
                </div>
              </td>
              <td className="align-middle">{item.nama}</td>
              <td className="align-middle">{item.due_date}</td>
              <td className="align-middle">{item.mo}</td>
              <td className="align-middle"></td>
              <td className="align-middle"></td>
              <td className="align-middle"></td>
              <td className="align-middle"></td>
              <td>
                <div className="d-flex justify-content-between flex-row">
                  <button
                    className="btn btn-sm p-1"
                    onClick={handleShowEditDoc}
                  >
                    <i className="fas fa-edit text-primary"></i>
                  </button>
                  <button
                    className="btn btn-sm p-1 mr-2"
                    onClick={handleShowModalDelete}
                  >
                    <i className="fas fa-trash text-danger"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      );
    }
  };

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
                                <td className="align-middle">{service.name}</td>
                                <td className="align-middle">31/01/2021</td>
                                <td className="align-middle">{service.qty}</td>
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
                  <tr hover>
                    <td colSpan={4} className="align-middle">
                      <CircularProgress />
                    </td>
                  </tr>
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

      <StyledModal
        visible={showEditDoc}
        onClose={() => setShowEditDoc(false)}
        minWidth="50vw"
      >
        <form>
          <div className="form-group">
            <label for="ktr">Keterangan</label>
            <input
              type="text"
              className="form-control"
              id="ktr"
              name="ktr"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="form-group">
            <label for="document">Dokumen</label>
            <input type="file" className="form-control" id="document" />
          </div>
          <div className="d-flex">
            <div></div>
            <button className="btn btn-primary ml-auto">Submit</button>
          </div>
        </form>
      </StyledModal>

      <StyledModal
        visible={showModalDelete}
        onClose={() => setShowModalDelete(false)}
        minWidth="50vw"
      >
        <div className="d-flex justify-content-center">
          <h3>Yakin ingin menghapus?</h3>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-danger">Hapus</button>
        </div>
      </StyledModal>

      <StyledModal
        visible={showAddDelivModal}
        onClose={() => setShowAddDelivModal(false)}
        minWidth="50vw"
      >
        <form>
          <div className="row">
            <div className="col-6">
              <SelectStyled
                label="Document Type"
                options={docOptions}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-6">{showDocOption(docId)}</div>
          </div>
          <div className="d-flex">
            <div></div>
            <button className="btn btn-primary ml-auto">Submit</button>
          </div>
        </form>
      </StyledModal>

      <div className="d-flex justify-content-end w-100">
        <button
          className="btn btn-outline-success btn-md mt-3 mb-2"
          onClick={handleShowAddDelivModal}
        >
          <span className="nav-icon">
            <i className="flaticon2-plus"></i>
          </span>
          <span className="nav-text">Deliverables</span>
        </button>
      </div>

      <div className="responsive">
        <div className="table-wrapper-scroll-y my-custom-scrollbar">
          <div className="segment-table">
            <div className="hecto-12">
              <table className="table-bordered overflow-auto">
                <thead>
                  <tr>
                    {theadDocuments.map((item) => (
                      <th
                        className="bg-primary text-white align-middle"
                        key={item.id}
                      >
                        {item.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                {rowDoc.map((item, index) => {
                  return (
                    <React.Fragment key={item.id}>
                      <tbody>
                        <tr>
                          <td className="align-middle">
                            <button
                              className="btn btn-sm d-flex justify-content-center p-1"
                              onClick={() => handleChildDoc(item.id)}
                            >
                              <i className="fa fa-folder-plus text-primary"></i>
                            </button>
                          </td>
                          <td className="align-middle">{item.type}</td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                        </tr>
                      </tbody>
                      {childTables(item.id)}
                    </React.Fragment>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
