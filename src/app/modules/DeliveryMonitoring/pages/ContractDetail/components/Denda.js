import { TableBody, TableCell } from "@material-ui/core";

import React from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import {
  StyledHead,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
} from "../../Termin/style";
import { FormattedMessage } from "react-intl";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { useSelector } from "react-redux";

const tableHeaderContractsNew = [
  {
    id: "no",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.NO" />,
  },
  {
    id: "type",
    label: "Jenis Denda",
  },
  {
    id: "value",
    label: "Nilai",
    sortable: false,
  },
  {
    id: "max",
    label: "Maksimal Hari",
  },
];

const RowNormal = () => {
  return (
    <StyledTableRow>
      {["1", "Denda Kecelakaan Kerja", ["2000000", "%"], "5"].map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {Array.isArray(el) ? (
            <InputGroup className="mb-3">
              <FormControl defaultValue={el[0]} aria-label="Days" />
              <InputGroup.Append>
                <InputGroup.Text>{el[1]}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          ) : (
            el
          )}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

const Denda = () => {
  const { penalty_fine_data } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );
  return (
    <Card>
      <CardBody>
        <TablePaginationCustom
          headerRows={tableHeaderContractsNew}
          rows={penalty_fine_data.map((el, id) => ({
            no: id + 1,
            type: el?.pinalty_name,
            value: (
              <InputGroup className="mb-3">
                <FormControl defaultValue={el?.value} aria-label="Days" />
                <InputGroup.Append>
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            ),
            max: el?.max_day,
          }))}
        />
        {/* <div
          className="table-wrapper-scroll-y my-custom-scrollbar"
          style={{ height: "30vh", marginBottom: 21 }}
        >
          <div className="segment-table">
            <div className="hecto-10">
              <StyledTable>
                <StyledTableHead>
                  <StyledHead>
                    {["No", "Jenis Denda", "Nilai", "Maksimal Hari"].map(
                      (el, id) => (
                        <TableCell key={id} className="text-white align-middle">
                          {el}
                        </TableCell>
                      )
                    )}
                  </StyledHead>
                </StyledTableHead>
                <TableBody>
                  <RowNormal />
                  <RowNormal />
                  <RowNormal />
                </TableBody>
              </StyledTable>
            </div>
          </div>
        </div> */}
      </CardBody>
    </Card>
  );
};

export default Denda;
