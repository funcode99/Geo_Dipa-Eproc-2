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
  Button,
  CircularProgress,
  Select,
  MenuItem,
} from "@material-ui/core";
import { rupiah } from "../../../../../../libs/currency";
import { FormattedMessage } from "react-intl";
import { StyledModal } from "../../../../../../components/modals";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { Send } from "@material-ui/icons";

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
  "Status",
];

const ModalDetail = ({
  visible,
  onClose,
  formik,
  updateData,
  userStatus,
  loading,
  options,
}) => {
  const classes = useStyles();
  const isClient = userStatus === "client";
  const isVendor = userStatus === "vendor";

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
            {updateData?.task_delivery_items?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{(index += 1)}</TableCell>
                  <TableCell>{item?.item?.desc}</TableCell>
                  <TableCell>{item?.qty}</TableCell>
                  <TableCell>{rupiah(item?.item?.unit_price)}</TableCell>
                  <TableCell>{item?.approve_status?.name}</TableCell>
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

          <React.Fragment>
            <InputLabel id="delivery-order-status" className="mt-6 text-dark">
              <FormattedMessage id="TITLE.DELIVERY_ORDER" /> Status
            </InputLabel>
            <TextField
              labelid="delivery-order-status"
              id="elivery-order-status-id"
              name="approve_status"
              size="small"
              classes={{ root: classes.textField }}
              select
              variant="outlined"
              disabled={isVendor}
              // onChange={(e) => console.log(e.target.value)}
              defaultValue={4}
              {...formik.getFieldProps("status")}
            >
              <MenuItem value={4}>
                <FormattedMessage id="CONTRACT_DETAIL.MODAL_CREATE.SELECT_ITEM" />
              </MenuItem>
              {/* {["satu", "dua", "tiga"].map((item, id) => (
                  <MenuItem key={id} value={item}>
                    {item}
                  </MenuItem>
                ))} */}
              {options &&
                options.map((option, id) => (
                  <MenuItem key={id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            {/* <p style={{ color: "red" }}>
                    {formik.touched.status && formik.errors.status
                      ? formik.errors.status
                      : null}
                  </p> */}

            <InputLabel id="status_remarks" className="mt-6 text-dark">
              <FormattedMessage id="TITLE.STATUS_REMARKS" />
            </InputLabel>
            <TextField
              variant="outlined"
              name="status_remarks"
              size="small"
              type="text"
              placeholder="status remarks..."
              disabled={isVendor}
              InputLabelProps={{
                shrink: true,
              }}
              classes={{ root: classes.textField }}
              {...formik.getFieldProps("status_remarks")}
            />

            {isClient && (
              <div className="d-flex justify-content-end w-100 mt-7">
                <Button
                  disabled={loading}
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  <span className="mr-1">
                    <FormattedMessage id="BUTTON.SUBMIT" />
                  </span>
                  {loading ? (
                    <CircularProgress size="0.875rem" color="inherit" />
                  ) : (
                    <Send />
                  )}
                </Button>
              </div>
            )}
          </React.Fragment>
        </form>
      </StyledModal>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  // updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
});

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(ModalDetail);
