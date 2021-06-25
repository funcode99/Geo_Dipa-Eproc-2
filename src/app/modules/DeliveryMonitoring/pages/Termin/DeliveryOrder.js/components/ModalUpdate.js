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
  <FormattedMessage id="TITLE.QUANTITY" />,
  <FormattedMessage id="TITLE.UNIT_PRICE" />,
];

const ModalUpdate = ({
  visible,
  onClose,
  updateOrderItems,
  setUpdateOrderItems,
  formik,
  loading,
  updateData,
}) => {
  const [errors, setErrors] = React.useState({});

  const handleError = (type, err) => {
    setErrors((prev) => ({ ...prev, [type]: err }));
  };

  const handleChecklist = (data, index) => {
    handleError("item", false);

    // console.log(`updateOrderItems`, updateOrderItems);
    const dataArr = [...updateOrderItems];
    dataArr[index].checked = !dataArr[index].checked;
    setUpdateOrderItems(dataArr);
  };

  const handleChange = (e, data, index) => {
    const value = +e.target.value;

    const dataArr = [...updateOrderItems];
    dataArr[index].qty = value;
    setUpdateOrderItems(dataArr);
  };

  const addCheckedField = React.useCallback(() => {
    setUpdateOrderItems(
      updateData?.task_delivery_items?.map((item) => ({
        ...item,
        checked: true,
      }))
    );
  }, [updateData, setUpdateOrderItems]);

  React.useEffect(() => {
    addCheckedField();
  }, [updateData, addCheckedField]);

  // console.log(`updateOrderItems`, updateOrderItems);

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
          <FormattedMessage id="TITLE.UPDATE" />{" "}
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
                  <TableCell>
                    <Checkbox
                      name={`checkbox-${item?.id}`}
                      color="secondary"
                      onChange={() => handleChecklist(item, index)}
                      size="small"
                      width={50}
                      variant="body"
                      checked={item?.checked}
                    />
                  </TableCell>
                  <TableCell>{item?.item?.desc}</TableCell>
                  <TableCell>
                    <Form.Control
                      type="number"
                      size="sm"
                      min="1"
                      step="1"
                      max={item?.item?.qty}
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
                <FormattedMessage id="TITLE.UPDATE" />
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
  updateOrderItems: deliveryMonitoring.dataUpdateOrderItems,
});

const mapDispatch = (dispatch) => ({
  setTempOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataTempOrderItems,
      payload: payload,
    });
  },
  setUpdateOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataUpdateOrderItems,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(ModalUpdate);
