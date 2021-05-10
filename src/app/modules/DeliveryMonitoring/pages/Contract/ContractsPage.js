import React from 'react';
// import http from '../../libs/http';
// import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Icon,
} from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { Link } from 'react-router-dom';
// import '../../../_metronic/_assets/css/layout.css';
import { useSelector, useDispatch } from 'react-redux'
import { setDataContracts } from '../../_redux/deliveryMonitoringCrud';

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

// function createData(kontrak, po, judul, tgl_po, tgl_kontrak, penyedia, status) {
//   return { kontrak, po, judul, tgl_po, tgl_kontrak, penyedia, status };
// }

// const rows = [
//   createData(
//     'SPK/III/2021',
//     'PO.I',
//     'Pengadaan Tenaga Ahli',
//     '1 Jan 2021',
//     '11 Jan 2021',
//     'PT. XYZ',
//     'On Progress'
//   ),
//   createData(
//     'SPK/IV/2021',
//     'PO.II',
//     'Pengadaan Truk',
//     '1 Jan 2021',
//     '11 Jan 2021',
//     'PT. ZZZ',
//     'Selesai'
//   ),
//   createData(
//     'SPK/I/2021',
//     'PO.III',
//     'Pengadaan Bus',
//     '1 Jan 2021',
//     '11 Jan 2021',
//     'PT. QQQ',
//     'Selesai'
//   ),
//   createData(
//     'SPK/IV/2021',
//     'PO.IV',
//     'Pengadaan Truk',
//     '1 Jan 2021',
//     '11 Jan 2021',
//     'PT. asa',
//     'Selesai'
//   ),
// ];

// const initialContract = {
//   contract_name: 'Pengadaan Barang',
//   contract_no: '',
//   contract_period_range_day: '',
//   contract_period_range_month: '',
//   contract_status: '',
//   contract_value: '',
// };

export const ContractsPage = () => {
  const classes = useStyles();
  const [contract, setContract] = React.useState();
  const { dataContracts } = useSelector(state => state.deliveryMonitoring);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setDataContracts())
  }, [dispatch]);

  return (
    <>
      {/* <div className="d-flex align-items-center flex-wrap mr-1">
        <div className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')} />
          </span>
        </div>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Daftar Kontrak & PO
          </h2>
        </div>
      </div> */}

      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className="bg-primary text-white">No Kontrak</TableCell>
              <TableCell className="bg-primary text-white">No PO</TableCell>
              <TableCell className="bg-primary text-white">Judul Pengadaan</TableCell>
              <TableCell className="bg-primary text-white">Tanggal PO</TableCell>
              <TableCell className="bg-primary text-white">Tanggal Kontrak</TableCell>
              <TableCell className="bg-primary text-white">Penyedia</TableCell>
              <TableCell className="bg-primary text-white">Status</TableCell>
              <TableCell className="bg-primary text-white">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataContracts &&
              dataContracts.map((item) => {
                return (
                  <TableRow key={item.id} hover onClick={() => console.log('x')}>
                    <TableCell scope="row">
                      {item.id}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Link to={`/user/delivery_monitoring/${item.id}`}>
                        <Icon className="fas fa-search pointer text-primary" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default ContractsPage;