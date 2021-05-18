import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import Jasa from './Jasa';
import Barang from './Barang';

import { Table as BsTable } from 'react-bootstrap';
import { StyledModal } from '../../../../components/modals';
import { SelectStyled, CheckBoxStyled } from './style';

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

export default function Summary(props) {
  const [showChild, setShowChild] = React.useState({ show: false, data: {} });
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [showEditDoc, setShowEditDoc] = React.useState(false);
  const [showAddDelivModal, setShowAddDelivModal] = React.useState(false);
  const [docId, setDocId] = React.useState(0);

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
            <tr>
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

  const { item } = props;
  const classes = useStyles();
  const [navActive, setNavActive] = useState('Jasa');
  const [dataJasa, setDataJasa] = useState();
  const [dataBarang, setDataBarang] = useState();

  const addShowField = (data) => {
    if (data) {
      data.map((item) => {
        item.show = false;
      });
    }
  };

  const getItem = async (isService) => {
    try {
      const {
        data: { data },
      } = await deliveryMonitoring.getItem(isService);
      addShowField(data);

      // setDataJasa(data);
      if (isService) {
        setDataJasa(data);
      } else {
        setDataBarang(data);
      }
    } catch (error) {
      window.console.error(error);
    }
  };

  useEffect(() => {
    getItem(true);
  }, []);

  const handleNavClick = (type, isService) => {
    setNavActive(type);
    getItem(isService);
  };

  return (
    <div className={classes.root}>
      <Nav variant="pills" defaultActiveKey="link-jasa">
        <Nav.Item onClick={() => handleNavClick('Jasa', true)}>
          <Nav.Link eventKey="link-jasa" className={classes.navLink}>
            Jasa
          </Nav.Link>
        </Nav.Item>
        <Nav.Item onClick={() => handleNavClick('Barang', false)}>
          <Nav.Link eventKey="link-barang" className={classes.navLink}>
            Barang
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {navActive === 'Jasa' && <Jasa dataJasa={dataJasa} />}
      {navActive === 'Barang' && <Barang dataBarang={dataBarang} />}

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
          className="btn btn-success btn-sm mt-3 mb-2"
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
            <div className="hecto-10">
              <BsTable className="table-bordered overflow-auto">
                <thead>
                  <tr>
                    <th className="bg-primary text-white align-middle">No</th>
                    <th className="bg-primary text-white align-middle">
                      Scope of Work(Term)
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Delivery Date
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Bobot(%)
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Harga Pekerjaan
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Project Progress(%)
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Dokumen Progress
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Deliverable Dokumen
                    </th>
                    <th className="bg-primary text-white align-middle">Aksi</th>
                  </tr>
                </thead>
                {rowDoc.map((item, index) => {
                  return (
                    <>
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
                    </>
                  );
                })}
              </BsTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
