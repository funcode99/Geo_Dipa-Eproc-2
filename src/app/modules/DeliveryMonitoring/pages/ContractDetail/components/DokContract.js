import { TableBody, TableCell } from "@material-ui/core";
import React from "react";
import { Table } from "react-bootstrap";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import {
  StyledHead,
  StyledTable,
  StyledTableRow,
  StyledTableHead,
} from "../../Termin/style";
import withBox from "./withBox";

const RowNormal = () => {
  return (
    <StyledTableRow>
      {["1", "1928371/asdasd/123/asd", "123", "29 Juni 2020"].map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {el}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

const DokContract = () => {
  return (
    <Card>
      <CardBody>
        <div className="table-wrapper-scroll-y my-custom-scrollbar">
          <div className="segment-table">
            <div className="hecto-10">
              <StyledTable>
                <StyledTableHead>
                  <StyledHead>
                    {[
                      "No",
                      "Nama Dokumen",
                      "Nomor Dokumen",
                      "Tanggal Dokumen",
                    ].map((el, id) => (
                      <TableCell key={id} className="text-white align-middle">
                        {el}
                      </TableCell>
                    ))}
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

export default DokContract;
