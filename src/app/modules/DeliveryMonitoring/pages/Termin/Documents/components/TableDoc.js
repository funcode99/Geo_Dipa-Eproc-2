import { TableBody, TableCell } from "@material-ui/core";
import React from "react";
import { StyledHead, StyledTable, StyledTableHead } from "../../style";
import { DocumentsContext } from "../Documents";
import RowAccordion from "./RowAccordion";

const theadDocuments = [
  { id: "action", label: "" },
  { id: "doc-name", label: "Document Name" },
  { id: "dokumen-progress", label: "Document Progress" },
  { id: "deliv-dokumen", label: "Deliverable Document" },
  { id: "aksi", label: "Action" },
];

const BtnAksi = ({ item }) => {
  const { handleAction } = React.useContext(DocumentsContext);
  //   console.log(`item`, item);
  return (
    <div className="d-flex flex-row">
      {/* <button
        className="btn btn-sm p-1"
        onClick={() => handleAction("update", { update_id: item?.id })}
      >
        <i className="fas fa-edit text-warning"></i>
      </button> */}
      <button
        className="btn btn-sm p-1"
        onClick={() => handleAction("delete", { delete_id: item?.id })}
      >
        <i className="fas fa-trash text-danger"></i>
      </button>
      <button
        className="btn btn-sm p-1 mr-2"
        onClick={() => handleAction("upload", { upload_id: item?.id })}
      >
        <i className="fas fa-upload text-primary"></i>
      </button>
    </div>
  );
};

const TableDoc = ({}) => {
  const { content } = React.useContext(DocumentsContext);
  return (
    <div className="responsive">
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <div className="segment-table">
          <div className="hecto-15">
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
                      data={["accordIcon", el.name, "-", "-", ""]}
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
                                data={["accordIcon", el?.name, "-", "-", ""]}
                              >
                                {/* Dokumen */}
                                {(item2) =>
                                  item2?.documents?.map((els, idx) => (
                                    <RowAccordion
                                      key={idx}
                                      classBtn={"pl-17"}
                                      data={[
                                        "accordIcon",
                                        els?.document?.name,
                                        els?.url === null
                                          ? "WAITING TO UPLOAD"
                                          : "AVAILABLE",
                                        els?.url,
                                        <BtnAksi item={els} />,
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
                                  el?.document?.name,
                                  el?.url === null
                                    ? "WAITING TO UPLOAD"
                                    : "AVAILABLE",
                                  el?.url,
                                  <BtnAksi item={el} />,
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
