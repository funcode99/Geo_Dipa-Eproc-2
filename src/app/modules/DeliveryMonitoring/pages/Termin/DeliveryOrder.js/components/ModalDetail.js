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
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { hasMaterialItem } from "./ModalSubmit";

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
  innerRef,
  visible,
  onClose,
  formik,
  updateData,
  userStatus,
  loading,
  options,
  tempOrderItems,
  listPlants,
}) => {
  const classes = useStyles();
  const isClient = userStatus === "client";
  const isVendor = userStatus === "vendor";

  const hasMaterial = React.useMemo(() => hasMaterialItem(tempOrderItems), [
    tempOrderItems,
  ]);

  return (
    <React.Fragment>
      <DialogGlobal
        // visible={visible}
        ref={innerRef}
        title={<FormattedMessage id="TITLE.DETAIL_DELIVERY_ORDER" />}
        textYes={<FormattedMessage id="BUTTON.SUBMIT" />}
        textNo={<FormattedMessage id="BUTTON.CANCEL" />}
        onYes={formik.handleSubmit}
        onNo={onClose}
        onClose={onClose}
        btnNoProps={{
          className: "bg-secondary text-black",
        }}
        loading={loading}
        isSubmit={isClient}
        // hideCloseIcon={false}
        // disableBackdrop
        minWidth="40vw"
        maxwidth="70vw"
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {tableHeader.map((item, index) => (
                <TableCell className="bg-white text-dark" key={index}>
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

          {hasMaterial && (
            <React.Fragment>
              <InputLabel id="destination" className="mt-6">
                <FormattedMessage id="TITLE.DESTINATION_UNIT" />
              </InputLabel>
              <Select
                // labelId="demo-simple-select-label"
                // id="demo-simple-select"
                // value={10}
                name={"destination"}
                label="Age"
                onChange={() => {}}
                variant="outlined"
                style={{ height: 37 }}
                {...formik.getFieldProps("destination")}
              >
                {listPlants?.map((plant, id) => (
                  <MenuItem key={plant.id} value={plant.id}>
                    {plant?.facility?.name}
                  </MenuItem>
                ))}
                {/* <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
              </Select>
              <span className="text-danger">
                {formik.touched.destination && formik.errors.destination
                  ? formik.errors.destination
                  : null}
              </span>
            </React.Fragment>
          )}

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
              id="delivery-order-status-id"
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

            {/* {isClient && (
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
            )} */}
          </React.Fragment>
        </form>
      </DialogGlobal>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  // updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
  tempOrderItems: deliveryMonitoring.dataTempOrderItems,
});

const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(ModalDetail);
