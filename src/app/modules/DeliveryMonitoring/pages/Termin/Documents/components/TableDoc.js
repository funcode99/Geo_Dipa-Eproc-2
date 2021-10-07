import {
  makeStyles,
  TableBody,
  TableCell,
  Typography,
} from "@material-ui/core";
import React from "react";
import { StyledHead, StyledTable, StyledTableHead } from "../../style";
import { DocumentsContext } from "../Documents";
import RowAccordion from "./RowAccordion";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import BtnAksi from "./BtnAksi";
import { formatDate } from "../../../../../../libs/date";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import urlHelper, {
  openLinkTab,
} from "../../../../../../service/helper/urlHelper";
import StatusRemarks from "../../../../../../components/StatusRemarks";

const theadDocuments = [
  { id: "action", label: "" },
  { id: "doc-name", label: "Document Name", sticky: true },
  { id: "due-date", label: "Due Date" },
  { id: "dokumen-progress", label: "Status" },
  { id: "percentage", label: "Percentage" },
  { id: "deliv-dokumen", label: "Deliverable Document" },
  { id: "remarks", label: "Remarks" },
  { id: "aksi", label: "Action", rightSticky: true },
];

// const StatusRemarks = ({ status, remarks }) => {
//   const isRejected = status === "REJECTED";

//   return (
//     <div className="d-flex flex-column flex-grow-1">
//       <p className="text-dark-75 font-size-lg mb-1">{status || "-"}</p>
//       <span className="text-muted font-weight-bold">
//         {isRejected ? remarks : null}
//       </span>
//     </div>
//   );
// };

// const BtnAksi = ({ item }) => {
//   const { handleAction } = React.useContext(DocumentsContext);
//   //   console.log(`item`, item);

//   return (
//     <div className="d-flex flex-row">
//       {/* <button
//         className="btn btn-sm p-1"
//         onClick={() => handleAction("update", { update_id: item?.id })}
//       >
//         <i className="fas fa-edit text-warning"></i>
//       </button> */}
//       <button
//         className="btn btn-sm p-1"
//         onClick={() => handleAction("delete", { delete_id: item?.id })}
//       >
//         <i className="fas fa-trash text-danger"></i>
//       </button>
//       <button
//         className="btn btn-sm p-1 mr-2"
//         onClick={() => handleAction("upload", { upload_id: item?.id })}
//       >
//         <i className="fas fa-upload text-primary"></i>
//       </button>
//     </div>
//   );
// };

const BtnLihat = ({ url }) => {
  const handleOpen = React.useCallback(() => {
    openLinkTab(url);
    // window.open(urlHelper.addBaseURL(url), "_blank");
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

const TableDoc = ({ loading }) => {
  const { content, handleAction } = React.useContext(DocumentsContext);
  console.log(`content`, content);

  return (
    <TablePaginationCustom
      headerRows={theadDocuments}
      rows={content?.task_documents}
      headerProps={{ sortable: false }}
      width={1207}
      maxHeight={300}
      loading={loading}
      withSearch={false}
      withPagination={false}
      renderRows={({ item, index }) => {
        let el = item;
        let id = index;
        return (
          <RowAccordion
            key={id}
            dataAll={el}
            data={["accordIcon", el.name, "-", "-", "-", "-", "-", ""]}
          >
            {(item) => {
              const isPeriodic = item.is_periodic;
              // Periode Dokumen
              return isPeriodic
                ? item?.periodes?.map((el, id) => (
                    <RowAccordion
                      key={id}
                      classBtn={"pl-8"}
                      dataAll={el}
                      data={[
                        "accordIcon",
                        el?.name,
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                      ]}
                    >
                      {/* Dokumen */}
                      {(item2) =>
                        item2?.documents?.map((els, idx) => (
                          <RowAccordion
                            key={idx}
                            classBtn={"pl-13"}
                            data={[
                              "accordIcon",
                              els?.document_custom_name ?? els?.document?.name,
                              formatDate(new Date(els?.due_date)),
                              // els?.url === null
                              //   ? "WAITING TO UPLOAD"
                              //   : "AVAILABLE",
                              <StatusRemarks
                                status={els?.document_status?.name}
                                remarks={els?.remarks_status}
                                url={els?.url}
                                withFile={true}
                                approvedBy={els?.users?.username ?? "N/A"}
                              />,
                              els?.percentage && els?.percentage + "%",
                              <BtnLihat url={els?.url} />,
                              els?.remarks,
                              <BtnAksi
                                item={els}
                                handleAction={handleAction}
                                isPeriodic={isPeriodic}
                              />,
                            ]}
                          />
                        ))
                      }
                    </RowAccordion>
                  ))
                : item?.documents?.map((el, id) => (
                    <RowAccordion
                      //  Dokumen
                      key={id}
                      classBtn={"pl-13"}
                      data={[
                        "accordIcon",
                        el?.document_custom_name ?? el?.document?.name,
                        formatDate(new Date(el?.due_date)),
                        // el?.url === null ? "WAITING TO UPLOAD" : "AVAILABLE",
                        <StatusRemarks
                          status={el?.document_status?.name}
                          remarks={el?.remarks_status}
                          url={el?.url}
                          withFile={true}
                          approvedBy={el?.users?.username ?? "N/A"}
                        />,
                        // el?.percentage && el?.percentage + "%",
                        "-",
                        <BtnLihat url={el?.url} />,
                        el?.remarks,
                        <BtnAksi item={el} handleAction={handleAction} />,
                        //   "aksi",
                      ]}
                    />
                  ));
            }}
          </RowAccordion>
        );
      }}
    />
  );
  return (
    <div className="responsive">
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <div className="segment-table">
          <div className="hecto-17">
            <StyledTable>
              <StyledTableHead>
                <StyledHead>
                  {theadDocuments.map((item) => (
                    <TableCell
                      className="text-white align-middle"
                      key={item.id}
                    >
                      {item.label}
                    </TableCell>
                  ))}
                </StyledHead>
              </StyledTableHead>
              <TableBody>
                {content?.task_documents?.map((el, id) => {
                  // Jenis Dokumen
                  return (
                    <RowAccordion
                      key={id}
                      dataAll={el}
                      data={["accordIcon", el.name, "-", "-", "-", "-", ""]}
                    >
                      {(item) => {
                        const isPeriodic = item.is_periodic;
                        // Periode Dokumen
                        return isPeriodic
                          ? item?.periodes?.map((el, id) => (
                              <RowAccordion
                                key={id}
                                classBtn={"pl-12"}
                                dataAll={el}
                                data={[
                                  "accordIcon",
                                  el?.name,
                                  "-",
                                  "-",
                                  "-",
                                  "-",
                                  "",
                                ]}
                              >
                                {/* Dokumen */}
                                {(item2) =>
                                  item2?.documents?.map((els, idx) => (
                                    <RowAccordion
                                      key={idx}
                                      classBtn={"pl-17"}
                                      data={[
                                        "accordIcon",
                                        els?.document_custom_name ??
                                          els?.document?.name,
                                        formatDate(new Date(els?.due_date)),
                                        els?.url === null
                                          ? "WAITING TO UPLOAD"
                                          : "AVAILABLE",
                                        <BtnLihat url={els?.url} />,
                                        els?.remarks,
                                        <BtnAksi
                                          item={els}
                                          handleAction={handleAction}
                                          isPeriodic={isPeriodic}
                                        />,
                                      ]}
                                    />
                                  ))
                                }
                              </RowAccordion>
                            ))
                          : item?.documents?.map((el, id) => (
                              <RowAccordion
                                //  Dokumen
                                key={id}
                                classBtn={"pl-17"}
                                data={[
                                  "accordIcon",
                                  el?.document_custom_name ??
                                    el?.document?.name,
                                  formatDate(new Date(el?.due_date)),
                                  el?.url === null
                                    ? "WAITING TO UPLOAD"
                                    : "AVAILABLE",
                                  <BtnLihat url={el?.url} />,
                                  el?.remarks,
                                  <BtnAksi
                                    item={el}
                                    handleAction={handleAction}
                                  />,
                                  //   "aksi",
                                ]}
                              />
                            ));
                      }}
                    </RowAccordion>
                  );
                })}
              </TableBody>
            </StyledTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDoc;
