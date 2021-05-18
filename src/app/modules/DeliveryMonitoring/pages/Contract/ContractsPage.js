import React from 'react';
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
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';

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

export const ContractsPage = () => {
  const classes = useStyles();
  const [dataContracts, setDataContract] = React.useState();

  const getDataContracts = async () => {
    const {
      data: { data },
    } = await deliveryMonitoring.getDataContracts();
    console.log(data)
    setDataContract(data);
  };

  React.useEffect(() => {
    getDataContracts();
  }, []);

  return (
    <>
      <div className="d-flex align-items-center flex-wrap mr-1">
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
      </div>

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
                      <Link to={`/delivery_monitoring/contract/${item.id}`}>
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