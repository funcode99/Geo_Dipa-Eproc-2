// import React from "react";
// import { Row, Col } from "react-bootstrap";
// import { Box } from "@material-ui/core";
// import { detailGR } from "../fieldData";
// import { formatSADate } from "../../../../../../libs/date";

// const DetailGR = ({ data }) => {
//   const { client, document, vendor, contract } = detailGR;

//   return (
//     <div style={{ fontSize: "0.875rem" }}>
//       <Row className="mt-5">
//         <Col xs={6} className="pr-2">
//           <Box border={1} padding={1}>
//             <p className="mb-0">{client?.name}</p>
//             <p className="mb-0">{client?.address1}</p>
//             <p className="mb-0">{client?.address2}</p>
//             <p className="mb-0">{client?.address3}</p>
//           </Box>
//         </Col>
//         <Col xs={6} className="pl-2">
//           <Row>
//             <Col xs={6} className="pr-0">
//               <Box border={1} padding={1} paddingBottom={0}>
//                 <p className="mb-0">Number:</p>
//                 <p className="mb-0">{data ? data?.mat_doc : document.number}</p>
//               </Box>
//             </Col>
//             <Col xs={6} className="pl-0">
//               <Box border={1} padding={1} paddingBottom={0}>
//                 <p className="mb-0">Page:</p>
//                 <p className="mb-0">1 of 1</p>
//               </Box>
//             </Col>
//           </Row>
//           <Row>
//             <Col xs={6} className="pr-0">
//               <Box border={1} padding={1} paddingTop={0}>
//                 <p className="mb-0">Posting date:</p>
//                 <p className="mb-0">
//                   {data
//                     ? formatSADate(data?.pstng_date)
//                     : document.posting_date}
//                 </p>
//               </Box>
//             </Col>
//             <Col xs={6} className="pl-0">
//               <Box border={1} padding={1} paddingTop={0}>
//                 <p className="mb-0">Document date:</p>
//                 <p className="mb-0">
//                   {data ? formatSADate(data?.doc_date) : document.document_date}
//                 </p>
//               </Box>
//             </Col>
//           </Row>
//         </Col>
//       </Row>
//       <Row className="mt-4">
//         <Col xs={6} className="pr-2">
//           <Box border={1} padding={1}>
//             <p className="mb-0">{vendor?.name}</p>
//             <p className="mb-0">{vendor?.address1}</p>
//             <p className="mb-0">{vendor?.address2}</p>
//             <p className="mb-0">{vendor?.address3}</p>
//             <br />
//             <p className="mb-0">
//               Your vendor number with us: {vendor?.vendor_number}
//             </p>
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
//                 <p className="mb-0">{data?.po_number || contract.po_number}</p>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={4} className="pr-0">
//                 <p className="mb-0">Movement Type</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">{contract.movement_type}</p>
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
//                 <p className="mb-0">Delivery Note</p>
//               </Col>
//               <Col xs={1} className="px-0 d-flex justify-content-center">
//                 <p className="mb-0">:</p>
//               </Col>
//               <Col xs={7} className="pl-0">
//                 <p className="mb-0">
//                   {data?.ext_number || contract.delivery_note}
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
//                 <p className="mb-0">{data?.ref_doc_no || contract.ref_qa}</p>
//               </Col>
//             </Row>
//           </Box>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DetailGR;

import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import { formatSADate } from "../../../../../../libs/date";
import { detailSA } from "../fieldData";
import { detailGR } from "../fieldData";
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

const DetailGR = ({ data, type, fullData }) => {
  const { client, document, vendor, contract } = detailGR;
  const classes = useStyles();
  let dataSA = {};
  if (type === "SA") dataSA = data;
  console.log(`fullData`, fullData, dataSA, data);
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
      { label: "Number", value: data ? data?.mat_doc : "dummy" },
      { label: "Page", value: "1 of 1" },
      {
        label: "Posting Date",
        value: data ? formatSADate(data?.pstng_date) : "dummy",
      },
      {
        label: "Document Date",
        value: data ? formatSADate(data?.doc_date) : "dummy",
      },
    ],
    [data, document]
  );
  const tab3 = useMemo(
    () => [
      { value: fullData?.contract?.vendor?.party?.full_name },
      { value: fullData?.contract?.contract_party?.party_2_legal_domicile },
      // { value: vendor?.name },
      // { value: vendor?.address1 },
      // { value: vendor?.address2 },
      // { value: vendor?.address3 },
    ],
    [vendor]
  );
  const tab4 = useMemo(
    () => [
      { label: "PO Number", value: fullData?.task_gr?.po_number || "dummy" },
      {
        label: "Movement Type",
        value: fullData?.task_gr?.gr_items?.[0]?.move_type || "dummy",
      },
      { label: "Purchasing Group", value: "dummy" },
      { label: "Telephone", value: "dummy" },
      {
        label: "Delivery Note",
        value: data?.ext_number || "dummy",
      },
    ],
    [data, client, fullData]
  );

  return (
    <Grid container className={classes.root} spacing={1}>
      {/* tab1 */}
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          {tab1.map(({ value }, id1) => (
            <p className={classes.pp} key={id1}>
              <span className={classes.txtValue}>{value}</span>
            </p>
          ))}
          {/* DUMMY */}
        </Paper>
      </Grid>
      {/* tab2 */}
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
      {/* tab3 */}
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          {tab3.map(({ value }, id1) => (
            <p className={classes.pp} key={id1}>
              <span className={classes.txtValue}>{value}</span>
            </p>
          ))}
          {/* DUMMY */}
        </Paper>
      </Grid>
      {/* tab4 */}
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
              {data?.ref_doc_no || "dummy"}
            </span>
          </p>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DetailGR;
