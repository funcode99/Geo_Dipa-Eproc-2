import { Button } from "@material-ui/core";
import { TableBody, TableCell } from "@material-ui/core";
import React from "react";
import { Table } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import {
  StyledHead,
  StyledTable,
  StyledTableRow,
  StyledTableHead,
} from "../../Termin/style";
import withBox from "./withBox";

const tableHeaderContractsNew = [
  {
    id: "no",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.NO" />,
  },
  // {
  //   id: "po_number",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />,
  // },
  // {
  //   id: "procurement_title",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />,
  // },
  // {
  //   id: "po_date",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_DATE" />,
  // },
  // {
  //   id: "contract_date",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_DATE" />,
  // },
  {
    id: "name",
    label: <FormattedMessage id="TITLE.DOCUMENT_NAME" />,
  },
  {
    id: "nomor",
    label: <FormattedMessage id="TITLE.NO_DOCUMENT" />,
  },
  {
    id: "dokumen",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
    sortable: false,
  },
  {
    id: "tanggal",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
];

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

const BtnLihat = ({ url }) => {
  const handleOpen = React.useCallback(() => {
    window.open(url, "_blank");
  }, [url]);
  return (
    <div className={"d-flex flex-row align-items-center"}>
      {/* <Typography>{url}</Typography> */}
      {url && (
        <Button onClick={handleOpen} href="#text-buttons">
          Lihat Dokumen
        </Button>
      )}
    </div>
  );
};

const initRows = tableHeaderContractsNew.map((item) => ({ [item.id]: "" }));

const DokContract = () => {
  const {
    data: { file },
  } = useSelector((state) => state.deliveryMonitoring.dataContractById);
  // console.log(`data`, file);
  // console.log(`initRows`, initRows);
  return (
    <Card>
      <CardBody>
        <TablePaginationCustom
          headerRows={tableHeaderContractsNew}
          // width={1210}
          rows={
            file
              ? file.map((el, id) => ({
                  no: id + 1,
                  name: el.namaDokumen,
                  nomor: el.noDokumen,
                  dokumen: <BtnLihat url={el.linkDokumen} />,
                  tanggal: el.tglDokumen,
                }))
              : initRows
          }
        />
        {/* <div className="table-wrapper-scroll-y my-custom-scrollbar">
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
        </div> */}
      </CardBody>
    </Card>
  );
};

export default DokContract;
