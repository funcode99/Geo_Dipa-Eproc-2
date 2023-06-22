import React, { useState, useEffect, useLayoutEffect } from "react"; // useState
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Container,
  makeStyles,
  Paper,
  LinearProgress,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { rupiah } from "../../../../libs/currency";
import { code_currency } from "../../../../../../../../libs/currency";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSubheader } from "../../../../../_metronic/layout";
import { Form, Row, Col } from "react-bootstrap";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { useHistory, useParams, Link } from "react-router-dom";
import { getTermContract } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import TableOnly from "../../../../components/tableCustomV1/tableOnly";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const data_ops = [
  {
    label: "CONTRACT_DETAIL.TABLE_ACTION.DETAIL",
    icon: "fas fa-search text-primary",
    type: "open",
  },
];

const ListTermContract = (props) => {
  const suhbeader = useSubheader();
  const { intl } = props;
  const { contract } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [Toast, setToast] = useToast();

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "TITLE.TABLE_HEADER.NO",
      }),
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.SCOPE_OF_WORK",
      }),
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.DUE_DATE",
      }),
    },
    {
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.TABLE_HEAD.WEIGHT" }),
    },
    {
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.TAB.PRICE" }),
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.PROJECT_PROGRESS",
      }),
    },
    // {
    //   title: intl.formatMessage({
    //     id: "CONTRACT_DETAIL.TABLE_HEAD.DOCUMENT_PROGRESS",
    //   }),
    // },
    {
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.TABLE_HEAD.STATUS" }),
    },
  ];

  useLayoutEffect(() => {
    suhbeader.setTitle(
      intl.formatMessage({
        id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.CONTRACT",
      })
    );
    suhbeader.setBreadcrumbs([
      {
        pathname: `/vendor/invoice_monitoring/contract`,
        title: intl.formatMessage({
          id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        }),
      },
      {
        pathname: `/vendor/invoice_monitoring/contract/${contract}`,
        title: intl.formatMessage({
          id: "TITLE.CONTRACT_ITEM",
        }),
      },
    ]);
  }, []);

  const getData = () => {
    setLoading(true);
    getTermContract(contract)
      .then((result) => {
        setLoading(false);
        var data = result.data.data;
        if (data && data.data_termin) {
          data.data_termin = data.data_termin.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt)
              ? 1
              : new Date(b.createdAt) > new Date(a.createdAt)
              ? -1
              : 0
          );
        }
        setData(data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };
  useEffect(getData, []);

  return (
    <Container className="px-0">
      <Toast />
      <Subheader
        text={(data?.contract_no || "") + " - " + (data.contract_name || "")}
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />
      {loading && <LinearProgress color="secondary" className="rounded" />}
      <Paper className={`py-5 px-5 ${classes.paper}`}>
        <Form>
          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER",
                    })}
                    defaultValue={data?.contract_no}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE",
                    })}
                    defaultValue={data?.contract_name}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="validationCustom01">
                <Form.Label column sm="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.AUTHORITY_GROUP" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.AUTHORITY_GROUP",
                    })}
                    defaultValue={data?.alias_name_1}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="validationCustom02">
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.USER_GROUP" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.USER_GROUP",
                    })}
                    defaultValue={data?.alias_name_2}
                    disabled
                  />
                </Col>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.PO_NUMBER",
                    })}
                    defaultValue={data?.purch_order_no}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NAME" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.PO_NAME",
                    })}
                    defaultValue={data?.header_po}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.PRICE" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.PRICE",
                    })}
                    value={code_currency(data?.code,
                      parseInt(data?.contract_value ? data?.contract_value : 0)
                    )}
                    disabled
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column md="4">
                  <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />
                </Form.Label>
                <Col md="8">
                  <Form.Control
                    required
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CONTRACT_DETAIL.LABEL.VENDOR",
                    })}
                    defaultValue={data?.full_name}
                    disabled
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <TableOnly
          dataHeader={headerTable}
          loading={loading}
          // err={err}
          hecto={10}
        >
          {data &&
            data?.data_termin &&
            data?.data_termin.map((value, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      to={`/vendor/invoice_monitoring/contract/${contract}/${value.task_id}`}
                    >
                      {value.task_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {window
                      .moment(new Date(value?.due_date))
                      .format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>{value?.bobot + "%"}</TableCell>
                  <TableCell>{rupiah(value?.prices || 0)}</TableCell>
                  <TableCell>{value?.progress}</TableCell>
                  {/* <TableCell>Doc Progress</TableCell> */}
                  <TableCell>{value?.name}</TableCell>
                </TableRow>
              );
            })}
        </TableOnly>
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, null)(ListTermContract));
