import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  InputLabel,
  makeStyles,
} from "@material-ui/core";
import { rupiah } from "../../../../../../libs/currency";
import { FormattedMessage } from "react-intl";
import { StyledModal } from "../../../../../../components/modals";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .Mui-disabled": {
      color: "black",
      background: "lightgray",
    },
  },
}));

const tableHeader = [
  "No",
  <FormattedMessage id="TITLE.NAME" />,
  <FormattedMessage id="TITLE.QUANTITY" />,
  <FormattedMessage id="TITLE.UNIT_PRICE" />,
];

const ModalDetail = ({
  visible,
  onClose,
  updateOrderItems,
  formik,
  updateData,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <StyledModal
        visible={visible}
        onClose={onClose}
        hideCloseIcon={false}
        disableBackdrop
        minWidth="40vw"
        maxwidth="70vw"
      >
        <h3 className="mb-7">
          <FormattedMessage id="TITLE.DETAIL" />{" "}
          <FormattedMessage id="TITLE.DELIVERY_ORDER" />
        </h3>

        <Table size="small">
          <TableHead>
            <TableRow>
              {tableHeader.map((item, index) => (
                <TableCell className="bg-white" key={index}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {updateOrderItems?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{(index += 1)}</TableCell>
                  <TableCell>{item?.item?.desc}</TableCell>
                  <TableCell>{item?.qty}</TableCell>
                  <TableCell>{rupiah(item?.item?.unit_price)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <form
          noValidate
          autoComplete="off"
          className="d-flex flex-column mt-7"
          onSubmit={formik.handleSubmit}
        >
          <InputLabel id="name" className="mt-6 text-dark">
            <FormattedMessage id="TITLE.DESCRIPTION" />
          </InputLabel>
          <TextField
            variant="outlined"
            name="name"
            size="small"
            type="text"
            placeholder="description..."
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            classes={{ root: classes.textField }}
            {...formik.getFieldProps("name")}
          />
          <span className="text-danger">
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null}
          </span>

          <InputLabel id="date" className="mt-6 text-dark">
            <FormattedMessage id="TITLE.DATE" />
          </InputLabel>
          <TextField
            variant="outlined"
            name="date"
            size="small"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            classes={{ root: classes.textField }}
            {...formik.getFieldProps("date")}
          />
          <span className="text-danger">
            {formik.touched.date && formik.errors.date
              ? formik.errors.date
              : null}
          </span>

          <InputLabel id="remarks" className="mt-6 text-dark">
            <FormattedMessage id="TITLE.REMARKS" />
          </InputLabel>
          <TextField
            variant="outlined"
            name="remarks"
            size="small"
            type="text"
            placeholder="remarks..."
            InputLabelProps={{
              shrink: true,
            }}
            disabled
            classes={{ root: classes.textField }}
            {...formik.getFieldProps("remarks")}
          />
          <span className="text-danger">
            {formik.touched.remarks && formik.errors.remarks
              ? formik.errors.remarks
              : null}
          </span>
        </form>
      </StyledModal>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
});

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(ModalDetail);
