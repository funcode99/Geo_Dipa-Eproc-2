import React from "react";
import { StyledModal } from "../../../../../../components/modals";
import { FormattedMessage } from "react-intl";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { rupiah } from "../../../../../../libs/currency";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
    // marginBottom: theme.spacing(2),
  },
}));

const ModalTerm = ({
  visible,
  onClose,
  update,
  dataSubmitItems,
  loading,
  formik,
  options,
}) => {
  const classes = useStyles();

  return (
    <StyledModal
      visible={visible}
      onClose={onClose}
      hideCloseIcon={false}
      disableBackdrop
      minWidth="40vw"
      maxwidth="70vw"
    >
      <h3 className={update.update ? "mb-7" : "mb-5"}>
        {update.update ? (
          <FormattedMessage id="CONTRACT_DETAIL.MODAL_TITLE.UPDATE" />
        ) : (
          <FormattedMessage id="CONTRACT_DETAIL.MODAL_TITLE.CREATE" />
        )}{" "}
        <FormattedMessage id="CONTRACT_DETAIL.MODAL_TITLE.TERM" />
      </h3>

      {!update.update &&
        dataSubmitItems?.task_items?.length === 0 &&
        dataSubmitItems?.task_services?.length === 0 && (
          <p>
            <FormattedMessage id="CONTRACT_DETAIL.MODAL_CREATE.NO_ITEMS" />
          </p>
        )}

      {!update.update && (
        <div className="mb-5">
          {dataSubmitItems && dataSubmitItems.task_services.length > 0 && (
            <React.Fragment>
              <h5>
                <FormattedMessage id="SUMMARY.NAV.SERVICE" />
              </h5>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["No", "Name", "Quantity", "Unit Price"].map(
                      (item, index) => (
                        <TableCell className="bg-white" key={index}>
                          {item}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSubmitItems.task_services.map((item, index) => (
                    <TableRow key={item?.service_id}>
                      <TableCell>{(index += 1)}</TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>{item?.qty}</TableCell>
                      <TableCell>{rupiah(item?.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </React.Fragment>
          )}
          {dataSubmitItems && dataSubmitItems.task_items.length > 0 && (
            <React.Fragment>
              <h5 className="mt-4">
                <FormattedMessage id="SUMMARY.NAV.ITEM" />
              </h5>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["No", "Name", "Quantity", "Unit Price"].map(
                      (item, index) => (
                        <TableCell className="bg-white" key={index}>
                          {item}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSubmitItems.task_items.map((item, index) => (
                    <TableRow key={item?.item_id}>
                      <TableCell>{(index += 1)}</TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>{item?.qty}</TableCell>
                      <TableCell>{rupiah(item?.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </React.Fragment>
          )}
          {dataSubmitItems.total_price > 0 && (
            <p className="mt-4">
              <FormattedMessage id="CONTRACT_DETAIL.MODAL_CREATE.TOTAL_PRICE" />
              <span className="text-primary">
                {" "}
                {rupiah(dataSubmitItems?.total_price)}.
              </span>
            </p>
          )}
        </div>
      )}

      <form
        noValidate
        autoComplete="off"
        className="d-flex flex-column"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          label="Scope of Work"
          variant="outlined"
          name="name"
          className={classes.textField}
          size="small"
          {...formik.getFieldProps("name")}
        />
        <p style={{ color: "red" }}>
          {formik.touched.name && formik.errors.name
            ? formik.errors.name
            : null}
        </p>

        <TextField
          label="Due Date"
          variant="outlined"
          name="due_date"
          className={classes.textField}
          size="small"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          {...formik.getFieldProps("due_date")}
        />
        <p style={{ color: "red" }}>
          {formik.touched.due_date && formik.errors.due_date
            ? formik.errors.due_date
            : null}
        </p>

        {update.update ? (
          <React.Fragment>
            <InputLabel id="task-status">Status</InputLabel>
            <Select
              labelId="task-status"
              id="task-status-id"
              name="status"
              size="small"
              className={classes.textField}
              {...formik.getFieldProps("status")}
            >
              <MenuItem value={876}>
                <FormattedMessage id="CONTRACT_DETAIL.MODAL_CREATE.SELECT_ITEM" />
              </MenuItem>
              {options &&
                options.map((val) => (
                  <MenuItem key={val.id} value={val.id}>
                    {val.name}
                  </MenuItem>
                ))}
            </Select>
            <p style={{ color: "red" }}>
              {formik.touched.status && formik.errors.status
                ? formik.errors.status
                : null}
            </p>
          </React.Fragment>
        ) : null}

        <div className="d-flex">
          <Button
            disabled={loading}
            className="btn btn-primary ml-auto"
            type="submit"
            variant="contained"
          >
            {loading ? <CircularProgress /> : null}&nbsp;
            {update.update ? (
              <FormattedMessage id="BUTTON.UPDATE" />
            ) : (
              <FormattedMessage id="BUTTON.CREATE" />
            )}
          </Button>
        </div>
      </form>
    </StyledModal>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  dataSubmitItems: deliveryMonitoring.dataSubmitItems,
});

const mapDispatch = () => ({});

export default connect(mapState, mapDispatch)(ModalTerm);
