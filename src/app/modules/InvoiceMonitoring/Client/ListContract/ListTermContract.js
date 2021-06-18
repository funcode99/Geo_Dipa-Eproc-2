import React from "react"; // useState
import { connect } from "react-redux";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import { Container, makeStyles, Paper } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../libs/currency";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSubheader } from "../../../../../_metronic/layout";
import { Form, Row, Col } from "react-bootstrap";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { useHistory, useParams } from "react-router-dom";

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
  suhbeader.setTitle(
    intl.formatMessage({
      id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.CONTRACT",
    })
  );
  const classes = useStyles();
  const history = useHistory();

  const handleAction = (type, data) => {
    console.log("type: ", type, " - ", "data: ", data);
    history.push(`/client/invoice_monitoring/contract/${contract}/1`);
  };

  return (
    <Container className="px-0">
      <Subheader
        text="012.PJ/PST.30-GDE/IX/2020-1000014263"
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: `Contract Item`,
            to: "/",
          },
        ]}
      />
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
                    placeholder="Nomor Kontrak"
                    defaultValue="0848/SPK/V/2021"
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
                    placeholder="Judul Pengadaan"
                    defaultValue="Pengadaan SPK Jasa"
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
                    placeholder="Kewenangan"
                    defaultValue="Procurement Manager"
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
                    placeholder="User"
                    defaultValue="Procurement Superintendent"
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
                    placeholder="Nomor PO"
                    defaultValue="8000003579"
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
                    placeholder="Header Text PO"
                    defaultValue=""
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
                    placeholder="Harga Pekerjaan"
                    defaultValue={rupiah(parseInt(0))}
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
                    placeholder="Penyedia"
                    defaultValue="Abyor International"
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
                  <tr>
                    <td className="align-middle text-center">1</td>
                    <td>----</td>
                    <td>----</td>
                    <td className="align-middle text-center">----</td>
                    <td className="align-middle">----</td>
                    <td className="align-middle">----</td>
                    <td className="align-middle">----</td>
                    <td className="align-middle">----</td>
                    <td className="align-middle">
                      <ButtonAction
                        data={[]}
                        handleAction={handleAction}
                        ops={data_ops}
                      />
                    </td>
                  </tr>
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
