import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@material-ui/core";
import "./styles.scss";

const TableOnly = (props) => {
  const {
    intl,
    dataHeader = [],
    loading = false,
    err = false,
    children,
    hecto = 1,
  } = props;
  return (
    <React.Fragment>
      <div>
        <TableContainer component={Paper}>
          <Table className={"hecto-" + hecto}>
            <TableHead>
              <TableRow>
                {dataHeader.map((item, index) => {
                  return (
                    <TableCell className="bg-primary" key={index.toString()}>
                      <span>{item.title}</span>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </Table>

          <div className="table-loading-data">
            <div className="text-center font-weight-bold py-5">
              <div className="table-loading-data-potition">
                {loading && (
                  <span>
                    <i className="fas fa-spinner fa-pulse text-dark mr-1"></i>
                    <FormattedMessage id="TITLE.TABLE.WAITING_DATA" />
                  </span>
                )}
                {err && (
                  <span className="text-danger">
                    <i className="far fa-frown text-danger mr-1"></i>
                    <FormattedMessage id="TITLE.ERROR_REQUEST" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </TableContainer>
      </div>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(TableOnly));
