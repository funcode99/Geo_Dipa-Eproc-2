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
  CircularProgress,
} from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { Link } from 'react-router-dom';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import Subheader from '../../../../components/subheader';

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
  const [dataContracts, setDataContracts] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [Toast, setToast] = useToast();

  const getDataContracts = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getDataContracts();
      setDataContracts(data);
    } catch (error) {
      setToast('Error API, please contact developer!');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getDataContracts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Toast />
      <Subheader
        text="Daftar Kontrak & PO"
        IconComponent={
          <SVG
            src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')}
            style={{ color: 'white' }}
          />
        }
      />

      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className="bg-primary text-white">
                No Kontrak
              </TableCell>
              <TableCell className="bg-primary text-white">No PO</TableCell>
              <TableCell className="bg-primary text-white">
                Judul Pengadaan
              </TableCell>
              <TableCell className="bg-primary text-white">
                Tanggal PO
              </TableCell>
              <TableCell className="bg-primary text-white">
                Tanggal Kontrak
              </TableCell>
              <TableCell className="bg-primary text-white">Group</TableCell>
              <TableCell className="bg-primary text-white">Penyedia</TableCell>
              <TableCell className="bg-primary text-white">Status</TableCell>
              <TableCell className="bg-primary text-white">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow hover>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : null}
            {dataContracts &&
              dataContracts.map((item) => {
                return (
                  <TableRow key={item.id} hover>
                    <TableCell scope="row">{item.id}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell></TableCell>
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
