import React from "react";
import ModalConfirmation from "../../../../../../components/modals/ModalConfirmation";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { rupiah } from "../../../../../../libs/currency";
import { FormattedMessage } from "react-intl";
import { StyledModal } from "../../../../../../components/modals";
import { Col, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import { LensTwoTone, Send } from "@material-ui/icons";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData } from "./fieldData";
import { formatInitialDate } from "../../../../../../libs/date";
// import validation from "../../../../../../service/helper/validationHelper";
// import { object } from "yup";
import * as Yup from "yup";
import { useFormik } from "formik";
import SelectInputCustom from "../../../../../../components/input/SelectInputCustom";

// const validationSchema = object().shape({
//   item: validation.require("Item"),
//   date: validation.require("Delivery date"),
//   qty: validation.require("Quantity"),
// });

const ModalSubmit = ({
  visible,
  onClose,
  onSubmit,
  // additionalParams,
  items,
  orderItems,
  tempOrderItems,
  submitOrderItems,
  saveSubmitOrderItems,
  setTempOrderItems,
  // update,
}) => {
  const [availableItems, setAvailableItems] = React.useState(items);
  const [loadings, setLoadings] = React.useState({
    create: false,
    update: false,
    delete: false,
  });
  const [optionList, setOptionList] = React.useState([]);

  const FormSchema = Yup.object().shape({
    item: Yup.string().required(
      <FormattedMessage id="TITLE.ITEM_IS_REQUIRE" />
    ),
    date: Yup.date()
      .required(<FormattedMessage id="TITLE.DATE_IS_REQUIRE" />)
      .nullable(),
    qty: Yup.number()
      .required(<FormattedMessage id="TITLE.QTY_IS_REQUIRE" />)
      .min(1, <FormattedMessage id="MESSAGE.MIN_QUANTITY" />)
      .integer(<FormattedMessage id="MESSAGE.MUST_NUMBER" />)
      .positive(<FormattedMessage id="MESSAGE.MUST_POSITIVE" />),
  });

  const initialValues = {
    item: "",
    date: formatInitialDate(),
    qty: 1,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        console.log(`values`, values);
        // handleLoading("create", true);
        // const requestData = update.update
        //   ? {
        //       name: values.name,
        //       due_date: values.due_date,
        //       task_status_id: values.status,
        //     }
        //   : {
        //       contract_id: contractId,
        //       name: values.name,
        //       due_date: values.due_date,
        //       task_items: dataSubmitItems.task_items,
        //       task_services: dataSubmitItems.task_services,
        //     };
        // const res = update.update
        //   ? await deliveryMonitoring.submitTask(requestData, update)
        //   : await deliveryMonitoring.submitTask(requestData);
        // if (res.data.status === true) {
        //   handleSuccess(res);
        // }
      } catch (error) {
        setSubmitting(false);
        setStatus("Failed Submit Data");
        // handleError(error);
      } finally {
        // disableLoading();
        // setModals(false);
      }
    },
  });

  const handleChecklist = (data, index) => {
    // console.log(`data`, data);

    const dataArr = [...tempOrderItems];
    dataArr[index].checked = !dataArr[index].checked;
    setTempOrderItems(dataArr);
  };

  const setInitAvailItems = (data) => {
    // console.log(`data`, data);
    let temp = data.filter((item) => item.checked === true);
    // console.log(`temp`, temp);
    setTempOrderItems(temp.map((item) => ({ ...item, checked: false })));
  };

  const handleLoading = (key, state) => {
    setLoadings((prev) => ({ ...prev, [key]: state }));
  };

  const _handleSubmit = (data) => {
    // handleLoading("create", true);

    console.log(`tempOrderItems`, tempOrderItems);
    console.log(`data`, data);

    // let params = {};
    // switch (status) {
    //   case "vendor":
    //     params = {
    //       url: `delivery/task-news/${taskId}`,
    //       no: data.nomor_bapp,
    //       date: data.tanggal_bapp,
    //     };
    //     break;
    //   case "client":
    //     params = {
    //       url: `delivery/task-news/${taskNews?.id}/review`,
    //       review_text: data.hasil_pekerjaan,
    //     };
    //     break;
    //   default:
    //     break;
    // }

    // deliveryMonitoring
    //   .postCreateBAPP(params)
    //   .then((res) => handleSuccess(res))
    //   .catch((err) => handleError(err))
    //   .finally(handleLoading("submit", false));
  };

  const setInitialOption = () => {
    setOptionList(
      tempOrderItems.map((item) => ({
        value: item?.id,
        label: item?.item?.desc,
        qty: item?.qty,
      }))
    );
  };

  React.useEffect(() => {
    setInitAvailItems(items);
    setInitialOption();
  }, []);

  // const optionsList = {
  //   item: tempOrderItems.map((item) => ({
  //     value: item.id,
  //     label: item?.item?.desc,
  //   })),
  // };

  console.log(`optionList`, optionList);

  return (
    <StyledModal
      visible={visible}
      onClose={onClose}
      hideCloseIcon={false}
      disableBackdrop
      minWidth="40vw"
      maxwidth="70vw"
    >
      {/* <h3 className={update.update ? "mb-7" : "mb-5"}> */}
      <h3 className="mb-7">
        {/* {update.update ? (
          <FormattedMessage id="TITLE.UPDATE" />
        ) : ( */}
        <FormattedMessage id="TITLE.ADD" />
        {/* )} */} <FormattedMessage id="TITLE.DELIVERY_ORDER" />
      </h3>

      <Table size="small">
        <TableHead>
          <TableRow>
            {["No", "Name", "Quantity", "Unit Price"].map((item, index) => (
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
                  {(index += 1)}
                  {/* <Checkbox
                    name={`checkbox-${item?.item_id}`}
                    color="secondary"
                    onChange={() => handleChecklist(item, index)}
                    size="small"
                    width={50}
                    variant="body"
                    checked={item.checked}
                  /> */}
                </TableCell>
                <TableCell>{item?.item?.desc}</TableCell>
                <TableCell>
                  {/* <Form.Control
                    type="number"
                    size="sm"
                    min="1"
                    step="1"
                    max={item?.qty}
                    disabled={!item.checked ? true : false}
                    defaultValue={item.qty}
                    onChange={(e) =>
                      // handleInputQty(e.target.value, item, "barang")
                      console.log(`e.target.value`, e.target.value)
                    }
                  /> */}
                  {item?.qty}
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
        <InputLabel id="item">
          <FormattedMessage id="TITLE.ITEM" />
        </InputLabel>
        <Select
          labelId="item"
          id="item"
          name="date"
          size="small"
          {...formik.getFieldProps("item")}
        >
          <MenuItem value="">
            <FormattedMessage id="TITLE.SELECT_ITEM" />
          </MenuItem>
          {optionList &&
            optionList.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
        </Select>
        <span className="text-danger">
          {formik.touched.item && formik.errors.item
            ? formik.errors.item
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

        <InputLabel id="task-status" className="mt-6">
          <FormattedMessage id="TITLE.QUANTITY" />
        </InputLabel>
        <Form.Control
          type="number"
          size="md"
          min="1"
          // max={maxQty}
          step="1"
          name="qty"
          // max={item?.qty}
          // disabled={!item.checked ? true : false}
          // defaultValue={item.qty}
          // onChange={(e) =>
          //   // handleInputQty(e.target.value, item, "barang")
          //   console.log(`e.target.value`, e.target.value)
          // }
          {...formik.getFieldProps("qty")}
        />
        <span className="text-danger">
          {formik.touched.qty && formik.errors.qty ? formik.errors.qty : null}
        </span>
        {/* <TextField
          variant="outlined"
          name="qty"
          type="number"
          min="1"
          max="4"
          // max={maxQty}
          // step="1"
          // className={classes.textField}
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          {...formik.getFieldProps("qty")}
        />
        <span className="text-danger">
          {formik.touched.qty && formik.errors.qty ? formik.errors.qty : null}
        </span> */}

        <div className="d-flex justify-content-end w-100 mt-7">
          <Button
            disabled={loadings.create}
            // className="btn btn-primary ml-auto"
            type="submit"
            variant="contained"
            color="secondary"
          >
            <span className="mr-1">
              <FormattedMessage id="TITLE.ADD" />
            </span>
            {loadings.create ? (
              <CircularProgress size="0.875rem" color="inherit" />
            ) : (
              <Send />
            )}
          </Button>
        </div>
      </form>

      {/* <FormBuilder
        onSubmit={_handleSubmit}
        loading={loadings.create}
        initial={initialValues}
        validation={validationSchema}
        fieldProps={{
          listOptions: optionsList,
        }}
      >
        {({ fieldProps }) => (
          <Row>
            <Col>
              <FieldBuilder formData={formData} {...fieldProps} />
            </Col>
          </Row>
        )}
      </FormBuilder> */}
    </StyledModal>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  items: deliveryMonitoring.dataBarang,
  tempOrderItems: deliveryMonitoring.dataTempOrderItems,
  orderItems: deliveryMonitoring.dataTask?.task_item_deliveries,
  // taskId: deliveryMonitoring.dataTask?.id,
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
