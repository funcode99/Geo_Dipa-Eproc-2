import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Checkbox,
  InputLabel,
  CircularProgress,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { rupiah } from "../../../../../../libs/currency";
import { FormattedMessage } from "react-intl";
import { StyledModal } from "../../../../../../components/modals";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { isEmpty } from "lodash";

const tableHeader = [
  "",
  <FormattedMessage id="TITLE.NAME" />,
  <FormattedMessage id="TITLE.QTY_AVAILABLE" />,
  <FormattedMessage id="TITLE.QUANTITY" />,
  <FormattedMessage id="TITLE.UNIT_PRICE" />,
];

export const hasMaterialItem = (data) => {
  const filteredData = data?.filter(
    ({ item }, id) =>
      !(
        isEmpty(item?.material) ||
        item?.material === "undefined" ||
        item?.material === "null"
      )
  );
  console.log(`filteredData`, filteredData);
  return !!filteredData?.length;
};

const ModalSubmit = ({
  innerRef,
  visible,
  onClose,
  tempOrderItems,
  setTempOrderItems,
  formik,
  loading,
  errors,
  handleError,
  updateData,
  listPlants,
}) => {
  const isUpdate = Object.keys(updateData).length > 0;
  const hasMaterial = React.useMemo(() => hasMaterialItem(tempOrderItems), [
    tempOrderItems,
  ]);

  const handleChecklist = (data, index) => {
    handleError("item", false);

    const dataArr = [...tempOrderItems];
    dataArr[index].checked = !dataArr[index].checked;
    setTempOrderItems(dataArr);
  };

  const handleChange = (e, data, index) => {
    const value = +e.target.value;

    const dataArr = [...tempOrderItems];
    dataArr[index].qty = value;
    setTempOrderItems(dataArr);
  };

  console.log(`tempOrderItems`, tempOrderItems, hasMaterial);
  return (
    <React.Fragment>
      <DialogGlobal
        // visible={visible}
        ref={innerRef}
        title={
          isUpdate ? (
            <FormattedMessage id="TITLE.UPDATE_DELIVERY_ORDER" />
          ) : (
            <FormattedMessage id="TITLE.ADD_DELIVERY_ORDER" />
          )
        }
        textYes={
          isUpdate ? (
            <FormattedMessage id="TITLE.UPDATE" />
          ) : (
            <FormattedMessage id="TITLE.ADD" />
          )
        }
        textNo={<FormattedMessage id="BUTTON.CANCEL" />}
        onYes={formik.handleSubmit}
        onClose={onClose}
        onNo={onClose}
        btnNoProps={{
          className: "bg-secondary text-black",
        }}
        loading={loading}
        // isAction={false}
        // hideCloseIcon={false}
        // disableBackdrop
        minWidth="40vw"
        maxwidth="70vw"
      >
        {/* <h3 className="mb-7">
          {isUpdate && <FormattedMessage id="TITLE.UPDATE" />}
          {!isUpdate && <FormattedMessage id="TITLE.ADD" />}{" "}
          <FormattedMessage id="TITLE.DELIVERY_ORDER" />
        </h3> */}

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
            {tempOrderItems?.map((item, index) => {
              let qtyAvail = parseFloat(item?.qty_delivery_available);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      name={`checkbox-${item?.id}`}
                      color="secondary"
                      onChange={() => handleChecklist(item, index)}
                      size="small"
                      width={50}
                      variant="body"
                      checked={item.checked}
                    />
                  </TableCell>
                  <TableCell>{item?.item?.desc}</TableCell>
                  <TableCell>{qtyAvail}</TableCell>
                  <TableCell>
                    <Form.Control
                      type="number"
                      size="sm"
                      min={0.1}
                      step={0.1}
                      // max={item?.qty}
                      disabled={!item.checked ? true : false}
                      defaultValue={item.qty}
                      onChange={(e) => handleChange(e, item, index)}
                    />
                  </TableCell>
                  <TableCell>{rupiah(item?.item?.unit_price)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {errors.item && (
          <span className="text-danger">
            <FormattedMessage id="TITLE.ITEM_IS_REQUIRE" />
          </span>
        )}

        <form
          noValidate
          autoComplete="off"
          className="d-flex flex-column mt-7"
          onSubmit={formik.handleSubmit}
        >
          <InputLabel id="name" className="mt-6">
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
            {...formik.getFieldProps("name")}
          />
          <span className="text-danger">
            {formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null}
          </span>

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

          <InputLabel id="date" className="mt-6">
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
            {...formik.getFieldProps("date")}
          />
          <span className="text-danger">
            {formik.touched.date && formik.errors.date
              ? formik.errors.date
              : null}
          </span>

          <InputLabel id="remarks" className="mt-6">
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
            {...formik.getFieldProps("remarks")}
          />
          <span className="text-danger">
            {formik.touched.remarks && formik.errors.remarks
              ? formik.errors.remarks
              : null}
          </span>

          {/* <div className="d-flex justify-content-end w-100 mt-7">
            <Button
              size="small"
              disabled={loading}
              type="submit"
              variant="contained"
              color="secondary"
            >
              <span className="mr-1">
                {isUpdate && <FormattedMessage id="TITLE.UPDATE" />}
                {!isUpdate && <FormattedMessage id="TITLE.ADD" />}
              </span>
              {loading ? (
                <CircularProgress size="0.875rem" color="inherit" />
              ) : (
                <Send />
              )}
            </Button>
          </div> */}
        </form>
      </DialogGlobal>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  tempOrderItems: deliveryMonitoring.dataTempOrderItems,
});

const mapDispatch = (dispatch) => ({
  setTempOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataTempOrderItems,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(ModalSubmit);
