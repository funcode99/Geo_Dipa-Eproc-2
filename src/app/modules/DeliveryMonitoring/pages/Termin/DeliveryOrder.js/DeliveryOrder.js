import {
  Card,
  CardContent,
  Checkbox,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@material-ui/core";
import React from "react";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import RowNormal from "./RowNormal";
import { Form } from "react-bootstrap";
import { rupiah } from "../../../../../libs/currency";
import { connect } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";
import { Send } from "@material-ui/icons";
import ModalCreate from "./components/ModalCreate";

const DeliveryOrder = ({ items, orderItems, setOrderItems }) => {
  const [open, setOpen] = React.useState({
    submit: false,
    tempParams: {},
  });

  const handleVisible = (key, tempParams = {}) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
      tempParams: { ...prev.tempParams, ...tempParams },
    }));
  };

  const setInitialOrderItems = React.useCallback(() => {
    // const tempOrder = items.filter((item) => item.checked === true);

    // console.log(items);

    setOrderItems(items);
  }, [items, setOrderItems]);

  React.useEffect(() => {
    setInitialOrderItems();
  }, [setInitialOrderItems]);

  const handleChecklist = (items) => {
    console.log(`items`, items);
  };

  const handleChange = (e, items) => {
    const value = e.target.value;
    console.log(`value`, value);
    console.log(`items`, items);
  };

  const handleApi = React.useCallback(
    (type, params) => {
      // handleLoading(type, true);
      switch (type) {
        case "submit":
          // console.log(`submit`, type, open?.tempParams?.submit_id);
          // deliveryMonitoring
          //   .submitDocId(open?.tempParams?.submit_id)
          //   .then(handleSuccess)
          //   .catch(handleError)
          //   .finally(() => {
          //     handleLoading(type, false);
          //     handleVisible(type);
          //   });
          console.log(`open.tempParams`, open?.tempParams);
          console.log(`type`, type);
          console.log(`params`, params);
          break;
        default:
          break;
      }
    },
    [open]
  );

  return (
    <React.Fragment>
      <ModalCreate
        visible={open.submit}
        onClose={() => handleVisible("submit")}
        onSubmit={(params) => handleApi("submit", params)}
        additionalParams={open.tempParams}
        orderItems={items}
      />

      <Card>
        <CardContent>
          {/* <div className="d-flex justify-content-end w-100 mt-3">
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => handleVisible("submit", orderItems)}
            >
              <span className="mr-1">Create</span>
              <Send />
            </Button>
          </div> */}

          <div className="d-flex justify-content-end w-100 mb-5">
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => handleVisible("submit", orderItems)}
            >
              <span className="nav-icon">
                <i className="flaticon2-plus"></i>
              </span>
              <span className="nav-text">Create</span>
            </button>
          </div>

          <TableBuilder
            hecto={5}
            dataHead={["", "Keterangan", "Due Date", "Qty", "Uom", "Net Value"]}
            // dataBody={items}
            // renderRowBody={({ item, index }) => (
            //   <RowNormal
            //     key={index}
            //     data={
            //       item.item
            //         ? [
            //             <Checkbox
            //               name={`checkbox-${item?.item?.id}`}
            //               color="secondary"
            //               onChange={(e) => handleChecklist(item?.item)}
            //               size="small"
            //               width={50}
            //               variant="body"
            //               checked={item?.checked}
            //               disabled={item.qty_available === 0 ? true : false}
            //             />,
            //             item?.item?.desc,
            //             "",
            //             <Form.Control
            //               type="number"
            //               size="sm"
            //               min={1}
            //               max={item?.item?.qty}
            //               disabled={!item.checked}
            //               defaultValue={item.qty}
            //               onChange={(e) => handleChange(e, item.item)}
            //             />,
            //             "",
            //             rupiah(item?.item?.unit_price),
            //           ]
            //         : [
            //             <Checkbox
            //               name={`checkbox-${item?.id}`}
            //               color="secondary"
            //               onChange={(e) => handleChecklist(item)}
            //               size="small"
            //               width={50}
            //               variant="body"
            //               checked={item?.checked}
            //               disabled={item.qty_available === 0 ? true : false}
            //             />,
            //             item?.desc,
            //             "",
            //             <Form.Control
            //               type="number"
            //               size="sm"
            //               min={1}
            //               max={item?.qty_available}
            //               disabled={!item.checked}
            //               defaultValue={item?.qty_available}
            //               onChange={(e) => handleChange(e, item)}
            //             />,
            //             "",
            //             rupiah(item?.unit_price),
            //           ]
            //     }
            //   />
            // )}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  items: deliveryMonitoring.dataBarang,
  orderItems: deliveryMonitoring.dataOrderItems,
});

const mapDispatch = (dispatch) => ({
  setOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataOrderItems,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(DeliveryOrder);
