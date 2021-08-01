import {
  IconButton,
  TableCell,
  Collapse,
  Box,
  TableRow,
  Typography,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import React from "react";
import TableHistory from "./TableHistory";
import { FormattedMessage } from "react-intl";

const RowCollapse = ({ row, childData }) => {
  const [open, setOpen] = React.useState(false);
  // console.log(`row`, row);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className="btn btn-sm btn-primary p-0"
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.desc}</TableCell>
        <TableCell>{row.date}</TableCell>
        <TableCell>{row.remarks}</TableCell>
        <TableCell>{row.approve_status}</TableCell>
        <TableCell>{row.action}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={Object.keys(row).length}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              margin={1}
              style={{
                maxHeight: 300,
                overflowY: "scroll",
              }}
            >
              <Typography variant="h6" gutterBottom component="div">
                <FormattedMessage id="TITLE.HISTORY" />
              </Typography>
              <TableHistory data={childData} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default RowCollapse;
