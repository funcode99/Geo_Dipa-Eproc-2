import React, { useState, useEffect } from "react"; // useState
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Container,
  makeStyles,
  Paper,
  LinearProgress,
} from "@material-ui/core";
import { rupiah } from "../../../../libs/currency";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSubheader } from "../../../../../_metronic/layout";
import { Form, Row, Col } from "react-bootstrap";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { useHistory, useParams } from "react-router-dom";
import { getTermContract } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";

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
  suhbeader.setTitle(
    intl.formatMessage({
      id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.CONTRACT",
    })
  );
  const { contract } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [Toast, setToast] = useToast();

  const handleAction = (type, data) => {
    history.push(`/client/invoice_monitoring/contract/${contract}/1`);
  };

  const getData = () => {
    setLoading(true);
    getTermContract(contract)
      .then((result) => {
        setLoading(false);
        setData(result.data.data);
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
        text="012.PJ/PST.30-GDE/IX/2020-1000014263"
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: intl.formatMessage({
              id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
            }),
            to: `/client/invoice_monitoring/contract`,
          },
          {
            label: `Contract Item`,
            to: "/",
          },
        ]}
      />
      {loading && <LinearProgress color="secondary" className="rounded" />}
      <Paper className={classes.paper} className="py-5 px-5">
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
                    defaultValue={rupiah(
                      parseInt(data.total_amount ? data.total_amount : 0)
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

        {/* begin: Table */}
        <div className="table-wrapper-scroll-y my-custom-scrollbar">
          <div className="segment-table">
            <div className="hecto-10">
              <table className="table-bordered overflow-auto">
                <thead>
                  <tr>
                    <th className="bg-primary text-white align-middle">No</th>
                    <th className="bg-primary text-white align-middle">
                      Scope of Work
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Due Date
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Bobot
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Harga Pekerjaan
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Project Progress
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Document Progress
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Status
                    </th>
                    <th className="bg-primary text-white align-middle">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.data_termin &&
                    data.data_termin.map((value, index) => {
                      return (
                        <tr key={index.toString()}>
                          <td className="align-middle text-center">
                            {index + 1}
                          </td>
                          <td>{value.task_name}</td>
                          <td>
                            {window
                              .moment(new Date(value.due_date))
                              .format("DD MMM YYYY")}
                          </td>
                          <td>bobot</td>
                          <td>price</td>
                          <td>{value.progress}</td>
                          <td>Doc Progress</td>
                          <td>{value.name}</td>
                          <td className="align-middle">
                            <ButtonAction
                              data={value}
                              handleAction={handleAction}
                              ops={data_ops}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* end: Table */}
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, null)(ListTermContract));
