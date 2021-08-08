import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import useStyles from "./useStyle";
import { Card, IconButton, Paper } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Skeleton from "@material-ui/lab/Skeleton";
import "./styles.scss";

const PDFPreview = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const classes = useStyles();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const prevPage = () => {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const nextPage = () => {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  };

  return (
    <Paper className={classes.root}>
      <Document
        loading={() => <Skeleton variant="rect" height={400} width={300} />}
        file={"http://192.168.0.168:5000/task-document/BAPPBAST.pdf"}
        // file={
        //   "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        // }
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          className={"page-doc"}
          pageNumber={pageNumber}
          height={400}
          width={300}
        />
      </Document>
      <Card className={classes.boxBtn}>
        <IconButton
          className={classes.button}
          onClick={prevPage}
          aria-label="prev"
        >
          <ChevronLeftIcon />
        </IconButton>
        <div>
          {pageNumber} of {numPages}
        </div>
        <IconButton
          className={classes.button}
          onClick={nextPage}
          aria-label="next"
        >
          <ChevronRightIcon />
        </IconButton>
      </Card>
    </Paper>
  );
};

export default PDFPreview;
