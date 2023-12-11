import React from "react";
import { connect } from "react-redux";

const UpdateButton = ({
  dataNewClause,
  dataNewClauseDrafting,
  fromWhere,
  isDrafting = false,
  isMandatory = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 28,
        padding: "2rem 0",
      }}
    >
      <button
        type="submit"
        // tidak menerima komentar wkwk, auto ga jalan atribut nya
        disabled={
          fromWhere !== "other" && isDrafting === false
            ? dataNewClause[fromWhere].attachmentClauseData[0]
                .attachment_number === "" ||
              dataNewClause[fromWhere].attachmentClauseData[0].clause_note ===
                "" ||
              dataNewClause[fromWhere].bodyClauseData.after_clause_note ===
                "" ||
              dataNewClause[fromWhere].bodyClauseData.before_clause_note ===
                "" ||
              dataNewClause[fromWhere].bodyClauseData.clause_number === ""
            : fromWhere === "other" && isDrafting === true
            ? dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                .attachment_number === "" ||
              dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                .clause_note === "" ||
              dataNewClauseDrafting[fromWhere].bodyClauseData[0]
                .after_clause_note === "" ||
              dataNewClauseDrafting[fromWhere].bodyClauseData[0]
                .before_clause_note === "" ||
              dataNewClauseDrafting[fromWhere].bodyClauseData[0]
                .clause_number === ""
            : fromWhere !== "other" && isDrafting === false
            ? dataNewClause[fromWhere].attachmentClauseData[0]
                .attachment_number === "" ||
              dataNewClause[fromWhere].attachmentClauseData[0].clause_note ===
                "" ||
              dataNewClause[fromWhere].bodyClauseData.after_clause_note ===
                "" ||
              dataNewClause[fromWhere].bodyClauseData.before_clause_note ===
                "" ||
              dataNewClause[fromWhere].bodyClauseData.clause_number === ""
            : isMandatory === true
            ? dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                .attachment_number === "" ||
              dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                .clause_note === "" ||
              dataNewClauseDrafting[fromWhere].bodyClauseData
                .after_clause_note === "" ||
              dataNewClauseDrafting[fromWhere].bodyClauseData
                .before_clause_note === "" ||
              dataNewClauseDrafting[fromWhere].bodyClauseData.clause_number ===
                ""
            : false
        }
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: "400",
          padding: "8px 14px",
          borderRadius: "8px",
          backgroundColor:
            fromWhere === "other" && isDrafting === false
              ? dataNewClause[fromWhere].attachmentClauseData[0]
                  .attachment_number === "" ||
                dataNewClause[fromWhere].attachmentClauseData[0].clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData[0].after_clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData[0]
                  .before_clause_note === "" ||
                dataNewClause[fromWhere].bodyClauseData[0].clause_number === ""
                ? "#8c8a8a"
                : "#3699ff"
              : fromWhere !== "other" && isDrafting === false
              ? dataNewClause[fromWhere].attachmentClauseData[0]
                  .attachment_number === "" ||
                dataNewClause[fromWhere].attachmentClauseData[0].clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData.after_clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData.before_clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData.clause_number === ""
                ? "#8c8a8a"
                : "#3699ff"
              : isDrafting === true
              ? (dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                  .attachment_number === "" ||
                  dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                    .clause_note === "" ||
                  dataNewClauseDrafting[fromWhere].bodyClauseData
                    .after_clause_note === "" ||
                  dataNewClauseDrafting[fromWhere].bodyClauseData
                    .before_clause_note === "" ||
                  dataNewClauseDrafting[fromWhere].bodyClauseData
                    .clause_number === "") &&
                isMandatory === true
                ? "#8c8a8a"
                : "#3699ff"
              : dataNewClause[fromWhere].attachmentClauseData[0]
                  .attachment_number === "" ||
                dataNewClause[fromWhere].attachmentClauseData[0].clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData.after_clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData.before_clause_note ===
                  "" ||
                dataNewClause[fromWhere].bodyClauseData.clause_number === ""
              ? "#8c8a8a"
              : "#3699ff",
          outline: "none",
          border: "none",
        }}
      >
        Update
      </button>
    </div>
  );
};

// export default UpdateButton;
const mapState = ({ addendumContract }) => ({
  dataNewClause: addendumContract.dataNewClause,
  dataNewClauseDrafting: addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, null)(UpdateButton);
