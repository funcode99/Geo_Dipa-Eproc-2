import React from 'react';
import { StyledModal } from '../../../../components/modals';
import {
  SelectStyled,
  CheckBoxStyled,
  StyledTable,
  StyledTableHead,
  StyledHead,
  StyledTableRow,
} from './style';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from '../../_redux/deliveryMonitoringAction';
import { Card, CardBody } from '../../../../../_metronic/_partials/controls';
import { TableCell, TableBody } from '@material-ui/core';

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
    childs: [
      {
        id: '1',
        name: 'Minggu 1',
        due_date: '01 Jan 2021',
        mo: 'M',
      },
      {
        id: '2',
        name: 'Minggu 2',
        due_date: '07 Jan 2021',
        mo: 'M',
      },
    ],
  },
  {
    id: 2,
    type: 'Dokumen Pendukung',
    show: false,
    childs: [
      {
        id: '5',
        name: 'FAT',
        due_date: '31 Jan 2021',
        mo: 'M',
      },
      {
        id: '6',
        name: 'SAT',
        due_date: '31 Jan 2021',
        mo: 'M',
      },
    ],
  },
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
  { id: 'aksi', label: 'Action' },
];

export default function Documents() {
  const [docId, setDocId] = React.useState(0);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [showEditDoc, setShowEditDoc] = React.useState(false);
  const [showAddDelivModal, setShowAddDelivModal] = React.useState(false);
  const { dataDocuments } = useSelector((state) => state.deliveryMonitoring);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({
      type: actionTypes.SetDataDocuments,
      payload: rowDoc,
    });
    // eslint-disable-next-line
  }, []);

  const handleShowAddDelivModal = () => setShowAddDelivModal(true);
  const handleShowModalDelete = () => setShowModalDelete(true);
  const handleShowEditDoc = () => setShowEditDoc(true);

  const handleExpand = (event, itemId) => {
    let tempDocuments = dataDocuments;

    tempDocuments.forEach((item) => {
      if (item.id === parseInt(itemId)) {
        item.show = !item.show;
      }
    });

    dispatch({
      type: actionTypes.SetDataDocuments,
      payload: tempDocuments,
    });
  };

  const showDocOption = (key) => {
    if (key === 4) {
      return (
        <div className="form-group">
          <label htmlFor="doc" className="h3">
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

  return (
    <React.Fragment>
      <Card className="mt-5">
        <CardBody>
          <StyledModal
            visible={showEditDoc}
            onClose={() => setShowEditDoc(false)}
            minWidth="50vw"
          >
            <form>
              <div className="form-group">
                <label htmlFor="ktr">Keterangan</label>
                <input
                  type="text"
                  className="form-control"
                  id="ktr"
                  name="ktr"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group">
                <label htmlFor="document">Dokumen</label>
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
              className="btn btn-outline-success btn-sm mt-3 mb-2"
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
                <div className="hecto-15">
                  <StyledTable className="table-bordered overflow-auto">
                    <StyledTableHead>
                      <StyledHead>
                        {theadDocuments.map((item) => (
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
                      {dataDocuments.length < 1 ? (
                        <tr>
                          <td
                            colSpan={theadDocuments.length}
                            className="text-center"
                          >
                            Empty Data
                          </td>
                        </tr>
                      ) : null}
                      {/* {loading ? (
                        <tr>
                          <td
                            colSpan={theadDocuments.length}
                            className="text-center"
                          >
                            <CircularProgress />
                          </td>
                        </tr>
                      ) : null} */}
                      {dataDocuments.map((item, index) => {
                        return (
                          <React.Fragment key={item.id}>
                            <StyledTableRow>
                              <TableCell className="align-middle">
                                <button
                                  className="btn btn-sm d-flex justify-content-center p-1"
                                  onClick={(e) => handleExpand(e, item.id)}
                                >
                                  <i className="fa fa-folder-plus text-primary"></i>
                                </button>
                              </TableCell>
                              <TableCell className="align-middle">
                                {item.type}
                              </TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                              <TableCell className="align-middle"></TableCell>
                            </StyledTableRow>
                            {item.childs.length !== 0 && item.show
                              ? item.childs.map((child) => (
                                  <StyledTableRow key={child.id}>
                                    <TableCell className="align-middle">
                                      <div className="d-flex justify-content-center">
                                        <i className="fa fa-file"></i>
                                      </div>
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {child.name}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {child.due_date}
                                    </TableCell>
                                    <TableCell className="align-middle">
                                      {child.mo}
                                    </TableCell>
                                    <TableCell className="align-middle"></TableCell>
                                    <TableCell className="align-middle"></TableCell>
                                    <TableCell className="align-middle"></TableCell>
                                    <TableCell className="align-middle"></TableCell>
                                    <TableCell className="align-middle">
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
                                    </TableCell>
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
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
