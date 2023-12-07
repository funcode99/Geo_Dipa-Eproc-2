import React from "react";
import { TableBody, TableCell } from "@material-ui/core";

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
    id: "no_dokument",
    label: "No Dokumen Addendum",
  },
  {
    id: "tanggal_addendum",
    label: "Tanggal Addendum",
  },
  {
    id: "addendum_status",
    label: "Addendum Status",
  },
  {
    id: "aksi",
    label: "Aksi",
  },
];

// const RowNormal = () => {
//   return (
//     <StyledTableRow>
//       {["1", "Denda Kecelakaan Kerja", ["2000000", "%"], "5"].map((el, idx) => (
//         <TableCell key={idx} className="text-dark text-left">
//           {Array.isArray(el) ? (
//             <InputGroup className="mb-3">
//               <FormControl disabled defaultValue={el[0]} aria-label="Days" />
//               <InputGroup.Append>
//                 <InputGroup.Text>{el[1]}</InputGroup.Text>
//               </InputGroup.Append>
//             </InputGroup>
//           ) : (
//             el
//           )}
//         </TableCell>
//       ))}
//     </StyledTableRow>
//   );
// };

const ListAddendum = ({ dataContractById }) => {
  const { authority_group } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );

  console.log(authority_group, "authority_group");
  console.log(dataContractById, "dataContractById");
  return (
    <Card>
      <CardBody>
        <TablePaginationCustom
          headerRows={tableHeaderContractsNew}
          withSearch={false}
          //   rows={penalty_fine_data.map((el, id) => ({
          //     no: id + 1,
          //     type: el?.pinalty_name,
          //     value: (
          //       <InputGroup className="mb-3">
          //         <FormControl
          //           disabled
          //           defaultValue={el?.value}
          //           aria-label="Days"
          //         />
          //         <InputGroup.Append>
          //           <InputGroup.Text>%</InputGroup.Text>
          //         </InputGroup.Append>
          //       </InputGroup>
          //     ),
          //     max: el?.max_day,
          //   }))}
        />
      </CardBody>
    </Card>
  );
};

export default ListAddendum;
