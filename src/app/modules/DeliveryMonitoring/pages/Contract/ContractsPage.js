import React from 'react';
import { Paper, makeStyles, Icon } from '@material-ui/core';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../../_metronic/_helpers';
import { Link } from 'react-router-dom';
import * as deliveryMonitoring from '../../service/DeliveryMonitoringCrud';
import useToast from '../../../../components/toast';
import Subheader from '../../../../components/subheader';
import CustomTable from '../../../../components/tables';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

const tableHeaderContracts = [
  'No Kontrak',
  'No PO',
  'Judul Pengadaan',
  'Tanggal PO',
  'Tanggal Kontrak',
  'Group',
  'Penyedia',
  'Status',
  'Action',
];

export const ContractsPage = () => {
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = React.useState(false);
  const [tableContent, setTableContent] = React.useState([]);

  const generateTableContent = (data) => {
    data.forEach((item) => {
      const rows = [
        { content: item.contract_no },
        { content: item.purch_order_no },
        { content: item.contract_name },
        { content: item.issued_date },
        { content: item.issued_date },
        { content: item.purch_order.purch_group.alias_name },
        { content: item.vendor.party.full_name },
        { content: item.state },
        {
          content: (
            <Link to={`/client/delivery-monitoring/contract/${item.id}`}>
              <Icon className="fas fa-search pointer text-primary" />
            </Link>
          ),
        },
      ];
      setTableContent((prev) => [...prev, rows]);
    });
  };

  const getDataContracts = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getDataContracts();
      generateTableContent(data);
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== 'TokenExpiredError'
      ) {
        setToast('Error API, please contact developer!');
      }
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
        <CustomTable
          tableHeader={tableHeaderContracts}
          tableContent={tableContent}
          marginY="my-1"
          hecto="hecto-15"
          loading={loading}
        />
      </Paper>
    </>
  );
};

export default ContractsPage;
