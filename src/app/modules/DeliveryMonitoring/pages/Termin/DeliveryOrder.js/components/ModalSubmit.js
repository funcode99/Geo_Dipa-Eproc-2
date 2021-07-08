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
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { rupiah } from "../../../../../../libs/currency";
import { FormattedMessage } from "react-intl";
import { StyledModal } from "../../../../../../components/modals";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";

const tableHeader = [
  "",
  <FormattedMessage id="TITLE.NAME" />,
  <FormattedMessage id="TITLE.QTY_AVAILABLE" />,
  <FormattedMessage id="TITLE.QUANTITY" />,
  <FormattedMessage id="TITLE.UNIT_PRICE" />,
];

const ModalSubmit = ({
  visible,
  onClose,
  tempOrderItems,
  setTempOrderItems,
  formik,
  loading,
  errors,
  handleError,
  updateData,
}) => {
  const isUpdate = Object.keys(updateData).length > 0;

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
          {isUpdate && <FormattedMessage id="TITLE.UPDATE" />}
          {!isUpdate && <FormattedMessage id="TITLE.ADD" />}{" "}
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
            {tempOrderItems?.map((item, index) => {
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
                  <TableCell>{item?.qty_avail}</TableCell>
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

          <div className="d-flex justify-content-end w-100 mt-7">
            <Button
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
          </div>
        </form>
      </StyledModal>
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
