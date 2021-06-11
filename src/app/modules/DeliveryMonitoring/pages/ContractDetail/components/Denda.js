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
  return (
    <Card>
      <CardBody>
        <div
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
        </div>
      </CardBody>
    </Card>
  );
};

export default Denda;
