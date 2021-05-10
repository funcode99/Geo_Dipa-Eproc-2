import React from 'react';
import {
  Paper,
  makeStyles,
  Container,
  // Table,
  TableBody,
  TableRow,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  TableHeadStyled,
  TableResponsive,
  TableStyled,
  SelectStyled,
  CheckBoxStyled,
  TableCellStyled,
  ChildTables,
} from './style';
import {
  Nav,
  Table,
} from 'react-bootstrap';
import { StyledModal } from '../../../../components/Modals'
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

function createDataJasa(id, name, ktr, due_date, qty, uom, grossPrice, costCenter, wbs) {
  return { id, name, ktr, due_date, qty, uom, grossPrice, costCenter, wbs };
}

const rowJasa = [
  createDataJasa(
    1,
    'Jasa A',
    'jasa',
    '04/05/2021',
    '7',
    'Jasa data jasa berupa string yang panjang 10101',
    'Jasa data jasa berupa string yang panjang 10101',
    'Jasa data jasa berupa string yang panjang 10101',
    'Jasa data jasa berupa string yang panjang 10101'
  ),
  createDataJasa(
    2,
    'Jasa B',
    'jasa',
    '04/06/2021',
    '9',
    'Jasa data jasa berupa string yang panjang 10101',
    'Jasa data jasa berupa string yang panjang 10101',
    'Jasa data jasa berupa string yang panjang 10101',
    'Jasa data jasa berupa string yang panjang 10101'
  ),
  createDataJasa(
    3,
    'Jasa C',
    'jasa',
    '04/07/2021',
    '3',
    'Jasa data jasa berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj ',
    'Jasa data jasa berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj ',
    'Jasa data jasa berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj ',
    'Jasa data jasa berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj '
  ),
]

function createDataBarang(id, name, ktr, due_date, qty, uom, grossPrice, costCenter, wbs) {
  return { id, name, ktr, due_date, qty, uom, grossPrice, costCenter, wbs };
}

const rowBarang = [
  createDataBarang(
    1,
    'Barang A',
    'Barang',
    '04/05/2021',
    '7',
    'BarangdataBarangberupastringyangpanjang10101',
    'BarangdataBarangberupastringyangpanjang10101',
    'BarangdataBarangberupastringyangpanjang10101',
    'BarangdataBarangberupastringyangpanjang10101'
  ),
  createDataBarang(
    2,
    'Barang B',
    'Barang',
    '04/06/2021',
    '9',
    'Barang data Barang berupa string yang panjang 10101',
    'Barang data Barang berupa string yang panjang 10101',
    'Barang data Barang berupa string yang panjang 10101',
    'Barang data Barang berupa string yang panjang 10101'
  ),
  createDataBarang(
    3,
    'Barang C',
    'Barang',
    '04/07/2021',
    '3',
    'Barang data Barang berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj ',
    'Barang data Barang berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj ',
    'Barang data Barang berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj ',
    'Barang data Barang berupa string yang panjang 10101 kjsdbjksdhjkds adjlksjdklasdj '
  ),
]

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
        mo: 'M'
      },
      {
        id: '2',
        nama: 'Minggu 2',
        due_date: '07 Jan 2021',
        mo: 'M'
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
        mo: 'M'
      },
      {
        id: '6',
        nama: 'SAT',
        due_date: '31 Jan 2021',
        mo: 'M'
      },
    ],
  },
];

const tableHeads = [
  'No',
  'Keterangan',
  'Due Date',
  'Qty',
  'Uom',
  'Gross Price (SAP)',
  'Cost Center',
  'WBS',
  'Action'
];

const dlvDocHeads = [
  'No',
  'Deliverables Document',
  'Due Date',
  'M/O',
  'Uom',
  'Dokumen',
  'Project Progress',
  'Status',
  'Approval Status',
  'Action',
];

const docOptions = [
  {
    id: 1,
    name: 'Laporan Pekerjaan',
    document: [
      {
        id: 1,
        name: 'Harian'
      },
      {
        id: 2,
        name: 'Mingguan'
      },
      {
        id: 3,
        name: 'Bulanan'
      },
    ]
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
    ]
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
    ]
  },
  {
    id: 4,
    name: 'Dokumen Lain-lain',
  }
];

export const TerminPage = () => {
  const classes = useStyles();

  const [tabActive, setTabctive] = React.useState('summary');
  const [navActive, setNavActive] = React.useState('Jasa');
  const [selectedItems, updateSelectedItems] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [showEditDoc, setShowEditDoc] = React.useState(false);
  const [showAddDelivModal, setShowAddDelivModal] = React.useState(false);
  const [showChild, setShowChild] = React.useState({ show: false, data: {} });
  const [docId, setDocId] = React.useState(0);

  const handleShow = () => setShow(true);
  const handleShowModalDelete = () => setShowModalDelete(true);
  const handleShowEditDoc = () => setShowEditDoc(true);
  const handleShowAddDelivModal = () => setShowAddDelivModal(true);


  const handleChange = (event) => {
    const item = rowJasa.find((row) => +event.target.value === row.id)

    if (item) {
      const selectedItem = selectedItems.find((element) => +item.id === +element.id)

      if (!selectedItem) {
        updateSelectedItems((arr) => [...arr, item])
      }
    }
  };

  const showNavBody = (navName) => {
    return (
      <div className="card-body border p-3 mt-2">
        {navName === 'Jasa' && (
          <div className="row">
            <div className="col-2 d-flex align-items-center">
              <p className="mb-0">Daftar Jasa</p>
            </div>
            <div className="col-10">
              <select className="form-control" aria-label=".form-select-sm example" onChange={handleChange}>
                <option defaultValue>Pilih Jasa</option>
                {rowJasa.map((item) => {
                  return <option value={item.id}>{item.name}</option>
                })}
              </select>
            </div>
          </div>
        )}
        <div className="row mt-2">
          <div className="col-12">
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <div className="segment-table">
                <div className="hecto-10">
                  <Table className="table-bordered overflow-auto">
                    <thead>
                      <tr>
                        {tableHeads.map(item => (
                          <th className="bg-primary text-white align-middle">{item}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {navName === 'Barang' ? (
                        rowBarang.map((item) => {
                          return (
                            <tr>
                              <td className="align-middle">{item.id}</td>
                              <td className="align-middle">{item.name}</td>
                              <td className="align-middle">
                                <div className="d-flex justify-content-between flex-row">
                                  <button className="btn btn-sm p-1" onClick={handleShow}>
                                    <i className="fas fa-edit text-primary"></i>
                                  </button>
                                  <button className="btn btn-sm p-1 mr-2" onClick={handleShowModalDelete}>
                                    <i className="fas fa-trash text-danger"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="align-middle">{item.due_date}</td>
                              <td className="align-middle">{item.qty}</td>
                              <td className="align-middle">{item.uom}</td>
                              <td className="align-middle">{item.grossPrice}</td>
                              <td className="align-middle">{item.costCenter}</td>
                              <td className="align-middle">{item.wbs}</td>
                            </tr>
                          )
                        })
                      )
                        : (
                          selectedItems.length > 0 && (
                            selectedItems.map((item) => {
                              return (
                                <tr>
                                  <td className="align-middle">{item.id}</td>
                                  <td className="align-middle">{item.name}</td>
                                  <td className="align-middle">
                                    <div className="d-flex justify-content-between flex-row">
                                      <button className="btn btn-sm p-1" onClick={handleShow}>
                                        <i className="fas fa-edit text-primary"></i>
                                      </button>
                                      <button className="btn btn-sm p-1 mr-2" onClick={handleShowModalDelete}>
                                        <i className="fas fa-trash text-danger"></i>
                                      </button>
                                    </div>
                                  </td>
                                  <td className="align-middle">{item.due_date}</td>
                                  <td className="align-middle">{item.qty}</td>
                                  <td className="align-middle">{item.uom}</td>
                                  <td className="align-middle">{item.grossPrice}</td>
                                  <td className="align-middle">{item.costCenter}</td>
                                  <td className="align-middle">{item.wbs}</td>
                                </tr>
                              )
                            })
                          )
                        )
                      }
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  const showTabBody = (tabName) => {
    if (tabName === 'summary') return (
      <div className="card-body">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="summary" role="tabpanel">
            <Nav variant="pills" defaultActiveKey="link-1">
              <Nav.Item onClick={() => setNavActive('Jasa')}>
                <Nav.Link className="border-primary" eventKey="link-1">Jasa</Nav.Link>
              </Nav.Item>
              <Nav.Item onClick={() => setNavActive('Barang')}>
                <Nav.Link className="border-primary" eventKey="link-2">Barang</Nav.Link>
              </Nav.Item>
            </Nav>
            {showNavBody(navActive)}
          </div>
        </div>
      </div>
    )

    if (tabName === 'berita acara') return (
      <div className="card-body">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="berita_acara" role="tabpanel" aria-labelledby="kt_tab_pane_1_4">
            Body Berita acara
          </div>
        </div>
      </div>
    )

    if (tabName === 'sa/gr') return (
      <div className="card-body">
        <div className="tab-content">
          <div className="tab-pane fade show active" id="sa_gr" role="tabpanel" aria-labelledby="kt_tab_pane_1_4">
            SA/GR
          </div>
        </div>
      </div>
    )

  };

  const handleChildDoc = (id) => {
    rowDoc.forEach((item) => {
      if (id === item.id) {

        setShowChild({ show: !showChild.show, data: item });
      }
    });
  }

  const childTables = (itemId) => {
    if (showChild.show && showChild.data.id === itemId) {
      return (
        <tbody>
          {
            showChild.data.child.map((item) => (
              <tr>
                <td>
                  <div className="d-flex justify-content-center">
                    <i className="fa fa-file"></i>
                  </div>
                </td>
                <td>{item.nama}</td>
                <td>{item.due_date}</td>
                <td>{item.mo}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div className="d-flex justify-content-between flex-row">
                    <button className="btn btn-sm p-1" onClick={handleShowEditDoc}>
                      <i className="fas fa-edit text-primary"></i>
                    </button>
                    <button className="btn btn-sm p-1 mr-2" onClick={handleShowModalDelete}>
                      <i className="fas fa-trash text-danger"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      )
    }
  }

  const handleSelectChange = (event) => {
    const docId = +event.target.value
    setDocId(docId);
  };

  const showDocOption = (key) => {
    if (key === 4) {
      return (
        <div className="form-group">
          <label for="doc" className="h3">Document</label>
          <input type="text" className="form-control" id="doc" name="doc" placeholder="Ketikkan nama dokumen" />
        </div>
      )
    } else if (key !== 0) {
      return (
        <CheckBoxStyled
          label="Document"
          list={docOptions}
          keyId={docId}
        />
      )
    } else {
      return null
    }
  }

  return (
    <Container>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <div className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')} />
          </span>
        </div>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Termin
          </h2>
        </div>
      </div>

      <Paper className={classes.root}>
        <StyledModal
          visible={show}
          onClose={() => setShow(false)}
          minWidth='50vw'
        >
          <form>
            <div className="form-group">
              <label for="qty">Quantity</label>
              <input type="number" className="form-control" id="qty" name="qty" aria-describedby="emailHelp" />
            </div>
            <div className="form-group">
              <label for="due_date">Due Date</label>
              <input type="date" className="form-control" id="due_date" />
            </div>
            <div className="d-flex">
              <div></div>
              <button className="btn btn-primary ml-auto">Submit</button>
            </div>
          </form>
        </StyledModal>

        <StyledModal
          visible={showEditDoc}
          onClose={() => setShowEditDoc(false)}
          minWidth='50vw'
        >
          <form>
            <div className="form-group">
              <label for="ktr">Keterangan</label>
              <input type="text" className="form-control" id="ktr" name="ktr" aria-describedby="emailHelp" />
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
          minWidth='50vw'
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
          minWidth='50vw'
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
              <div className="col-6">
                {showDocOption(docId)}
              </div>
            </div>
            <div className="d-flex">
              <div></div>
              <button className="btn btn-primary ml-auto">Submit</button>
            </div>
          </form>
        </StyledModal>

        <div className="card card-custom">
          <div className="card-header card-header-tabs-line">
            <div className="card-toolbar">
              <ul className="nav nav-tabs nav-bold nav-tabs-line">
                <li className="nav-item">
                  <Link className="nav-link active" data-toggle="tab" onClick={() => setTabctive('summary')}>
                    <span className="nav-icon"><i className="flaticon2-paper"></i></span>
                    <span className="nav-text">Summary</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" data-toggle="tab" onClick={() => setTabctive('berita acara')}>
                    <span className="nav-icon"><i className="flaticon2-document"></i></span>
                    <span className="nav-text">Berita Acara</span>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" data-toggle="tab" onClick={() => setTabctive('sa/gr')}>
                    <span className="nav-icon"><i className="flaticon2-drop"></i></span>
                    <span className="nav-text">SA / GR</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {showTabBody(tabActive)}
        </div>

        <Container>
          <div className="d-flex justify-content-end w-100">
            <button className="btn btn-success btn-sm mt-3 mb-2" onClick={handleShowAddDelivModal}>
              <span className="nav-icon"><i className="flaticon2-plus"></i></span>
              <span className="nav-text">Deliverables</span>
            </button>
          </div>

          <div className="responsive">
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <div className="segment-table">
                <div className="hecto-10">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white align-middle">No</th>
                      <th className="bg-primary text-white align-middle">Scope of Work(Term)</th>
                      <th className="bg-primary text-white align-middle">Delivery Date</th>
                      <th className="bg-primary text-white align-middle">Bobot(%)</th>
                      <th className="bg-primary text-white align-middle">Harga Pekerjaan</th>
                      <th className="bg-primary text-white align-middle">Project Progress(%)</th>
                      <th className="bg-primary text-white align-middle">Dokumen Progress</th>
                      <th className="bg-primary text-white align-middle">Deliverable Dokumen</th>
                      <th className="bg-primary text-white align-middle">Aksi</th>
                    </tr>
                  </thead>
                  {/* <tbody> */}
                  {rowDoc.map((item, index) => {
                    return (
                      <>
                      <tbody>
                        <tr>
                          <td>
                            <button className="btn btn-sm d-flex justify-content-center p-1" onClick={() => handleChildDoc(item.id)}>
                              <i className="fa fa-folder-plus text-primary"></i>
                            </button>
                          </td>
                          <td>{item.type}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                      {childTables(item.id)}
                    </>
                    )})}
                  {/* </tbody> */}
                </div>
              </div>
            </div>
            
            {/* <Table className="table table-hover table-bordered">
              <TableHeadStyled rows={dlvDocHeads} />
              {rowDoc.map((item) => {
                return (
                  <>
                    <TableBody>
                      <TableRow>
                        <TableCellStyled>
                          <button className="btn btn-sm d-flex justify-content-center p-1" onClick={() => handleChildDoc(item.id)}>
                            <i className="fa fa-folder-plus text-primary"></i>
                          </button>
                        </TableCellStyled>
                        <TableCellStyled>{item.type}</TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled></TableCellStyled>
                        <TableCellStyled>
                        </TableCellStyled>
                      </TableRow>
                    </TableBody>
                    {childTables(item.id)}
                  </>
                )
              })}

            </Table> */}
          </div>
        </Container>

      </Paper >
    </Container>
  );
};

export default TerminPage;