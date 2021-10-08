// import React from "react";
// import { Row, Col } from "react-bootstrap";
// import { Box } from "@material-ui/core";
// import { detailSA } from "../fieldData";
// import { formatSADate } from "../../../../../../libs/date";
// import ColDetail from "./ColDetail";

// const DetailSA = ({ data, type }) => {
//   const { client, document, vendor, contract } = detailSA;

//   let dataSA = {};
//   if (type === "SA") dataSA = data;

//   const docValuesSA = React.useMemo(
//     () => [
//       {
//         label: "Number",
//         value: dataSA ? dataSA?.sheet_no : document.number || "",
//       },
//       {
//         label: "Page",
//         value: "1 of 1",
//       },
//       {
//         label: "Posting date",
//         value: dataSA ? formatSADate(dataSA?.doc_date) : document.document_date,
//       },
//       {
//         label: "Document date",
//         value: dataSA ? formatSADate(dataSA?.doc_date) : document.document_date,
//       },
//     ],
//     [dataSA, document]
//   );

//   return (
//     <div style={{ fontSize: "0.875rem" }}>
//       <Row className="mt-5">
//         <Col xs={6} className="pr-2">
//           <Box border={1} padding={1}>
//             {Object.values(client).map((el, id) => (
//               <p className="mb-0" key={id}>
//                 {el}
//               </p>
//             ))}
//           </Box>
//         </Col>
//         <Col xs={6} className="pl-2">
//           <Row>
//             <ColDetail
//               label={docValuesSA[0].label}
//               value={docValuesSA[0].value}
//               position="left"
//             />
//             <ColDetail
//               label={docValuesSA[1].label}
//               value={docValuesSA[1].value}
//               position="right"
//             />
//           </Row>
//           <Row>
//             <ColDetail
//               label={docValuesSA[2].label}
//               value={docValuesSA[2].value}
//               position="left"
//             />
//             <ColDetail
//               label={docValuesSA[3].label}
//               value={docValuesSA[3].value}
//               position="right"
//             />
//           </Row>
//         </Col>
//       </Row>
//       <Row className="mt-4">
//         <Col xs={6} className="pr-2">
//           <Box border={1} padding={1}>
//             {Object.values(vendor).map((el, id) =>
//               id === Object.values(vendor).length - 1 ? (
//                 <p className="mb-0" key={id}>
//                   Your vendor number with us: {el}
//                 </p>
//               ) : (
//                 <p className="mb-0" key={id}>
//                   {el}
//                 </p>
//               )
//             )}
//           </Box>
//         </Col>
//         <Col xs={6} className="pl-2">
//           <Box border={1} padding={1}>
//             <Row>
//               <Col xs={4} className="pr-0">
//                 <p className="mb-0">PO Number</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">
//                   {data ? data?.po_number : contract.po_number}
//                 </p>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={4} className="pr-0">
//                 <p className="mb-0">Purchasing Group</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">{contract?.purch_group} (static)</p>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={4} className="pr-0">
//                 <p className="mb-0">Telephone</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">{contract?.telephone} (static)</p>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={4} className="pr-0">
//                 <p className="mb-0">Currency</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">
//                   {data ? data?.currency : contract.currency}
//                 </p>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={4} className="pr-0">
//                 <p className="mb-0">External Number</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">
//                   {data ? data?.ext_number : contract.external_number}
//                 </p>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={7} className="pr-0">
//                 <p className="mb-0">
//                   Ref. Quality Assurance Acceptance Certificate
//                 </p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={4} className="pl-0">
//                 <p className="mb-0">
//                   {data ? data?.ref_doc_no : contract.ref_qa}
//                 </p>
//               </Col>
//             </Row>
//           </Box>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DetailSA;

import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import { formatSADate } from "../../../../../../libs/date";
import { detailSA } from "../fieldData";
import "../styles.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 21,
  },
  paper: {
    minHeight: 100,
    padding: 13,
    height: "100%",
    // width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  root2: {
    flexGrow: 1,
    height: "100%",
  },
  paper2: {
    minHeight: 55,
    height: "100%",
    padding: 8,
  },
  label: {
    color: "#6c7293",
    fontWeight: "500",
  },
  txtValue: {
    color: "#a7abc3",
    fontWeight: "400",
  },
  pp: {
    marginBottom: 1,
  },
}));

const DetailSA = ({ data, fullData, type }) => {
  const { client, document, vendor, contract } = detailSA;
  const classes = useStyles();
  let dataSA = {};
  if (type === "SA") dataSA = data;

  const tab1 = useMemo(
    () => [
      { value: client?.name },
      { value: client?.address1 },
      { value: client?.address2 },
      { value: client?.address3 },
    ],
    [client]
  );
  const tab2 = useMemo(
    () => [
      { label: "Number", value: dataSA?.sheet_no || "-" },
      { label: "Page", value: "1 of 1" },
      {
        label: "Posting Date",
        value: formatSADate(dataSA?.post_date) || "-",
      },
      {
        label: "Document Date",
        value: formatSADate(dataSA?.doc_date) || "-",
      },
    ],
    [dataSA]
  );
  const tab3 = useMemo(
    () => [
      { value: fullData?.contract?.vendor?.party?.full_name },
      { value: fullData?.contract?.contract_party?.party_2_legal_domicile },
      // { value: vendor?.address2 },
      // { value: vendor?.address3 },
      {
        value:
          " Your vendor number with us : " +
          fullData?.contract?.vendor?.data?.sap_code,
      },
    ],
    [vendor, fullData]
  );
  const tab4 = useMemo(
    () => [
      { label: "PO Number", value: dataSA?.po_number || "-" },
      {
        label: "Purchasing Group",
        value:
          fullData?.contract?.purch_order?.purch_group?.party?.full_name || "-",
      },
      { label: "Telephone", value: "(021) 7982925" },
      { label: "Currency", value: dataSA?.currency || "-" },
      {
        label: "External Number",
        value: dataSA?.ext_number || "-",
      },
    ],
    [dataSA]
  );

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          {tab1.map(({ value }, id1) => (
            <p className={classes.pp} key={id1}>
              <span className={classes.txtValue}>{value}</span>
            </p>
          ))}
          {/* Dummmy */}
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <div>
          <Grid container className={classes.root2} spacing={1}>
            {tab2.map(({ label, value }, id2) => (
              <Grid item xs={6} key={id2}>
                <Paper className={classes.paper2}>
                  <p className={classes.pp}>
                    <span className={classes.label}>{label} :</span>
                  </p>
                  <span className={classes.txtValue}>{value}</span>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <p className={classes.pp}></p>
          {tab3.map(({ value }, id1) => (
            <p className={classes.pp} key={id1}>
              <span className={classes.txtValue}>{value}</span>
            </p>
          ))}
          {/* - */}
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <table>
            <colgroup>
              <col width="150px" />
              <col width="10px" />
              <col />
            </colgroup>
            <tbody>
              {tab4.map(({ label, value }, id4) => (
                <tr key={id4}>
                  <td className={"td2"}>
                    <span className={classes.label}>{label}</span>
                  </td>
                  <td className={"td2"}>
                    <span className={classes.label}>:</span>
                  </td>
                  <td className={"td2"}>
                    <span className={classes.txtValue}>{value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={classes.pp}>
            <span className={classes.label}>
              Ref. Quality Assurance Acceptance Certificate :{`    `}
            </span>
            <span className={classes.txtValue}>
              {dataSA?.ref_doc_no || "-"}
            </span>
          </p>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DetailSA;
