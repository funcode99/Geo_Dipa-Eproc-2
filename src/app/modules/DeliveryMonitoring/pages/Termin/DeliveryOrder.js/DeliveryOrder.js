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
import ModalSubmit from "./components/ModalSubmit";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import { FormattedMessage } from "react-intl";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import { formatDate } from "../../../../../libs/date";
import ButtonAction from "../../../../../components/buttonAction/ButtonAction";
import { StyledModal } from "../../../../../components/modals";

const tblHeadDlvItem = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "item_name",
    label: <FormattedMessage id="TITLE.NAME" />,
  },
  {
    id: "qty",
    label: <FormattedMessage id="TITLE.QUANTITY" />,
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
  {
    id: "action",
    label: <FormattedMessage id="TITLE.ACTION" />,
    sortable: false,
  },
];

const DeliveryOrder = ({
  taskId,
  items,
  orderItems,
  setOrderItems,
  tempOrderItems,
  setTempOrderItems,
}) => {
  const [open, setOpen] = React.useState({
    submit: false,
    tempParams: {},
  });
  const [tableContent, setTableContent] = React.useState([]);
  const [loading, setLoading] = React.useState({
    fetch: false,
  });
  // const [availableItems, setAvailableItems] = React.useState(items);
  const [update, setUpdate] = React.useState();

  // console.log(`items`, items);
  // console.log(`orderItems`, orderItems);

  const handleVisible = (key, tempParams = {}) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
      tempParams: { ...prev.tempParams, ...tempParams },
    }));
  };

  // const handleChecklist = (data) => {
  //   console.log(`data`, data);
  //   const temp = tempOrderItems;
  //   temp.map((item) => {
  //     // console.log(`item`, item);
  //     if (item?.item_id === data?.item_id) {
  //       item.checked = !item.checked;
  //     }
  //     return item;
  //   });
  //   setTempOrderItems(temp);
  // };

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

  const generateTableContent = (data) => {
    let dataArr = [];
    // console.log(`data`, data);
    data.forEach((item, index) => {
      // console.log(`item`, item);
      let objData = {
        no: (index += 1),
        item_name: item?.item?.desc,
        qty: item?.qty,
        date: item?.date !== null ? formatDate(new Date(item?.date)) : null,
        action: (
          <ButtonAction
            hoverLabel="More"
            data={"1"}
            // handleAction={console.log(null)}
            ops={[
              {
                label: "TITLE.EDIT_DATA",
                icon: "fas fa-edit text-primary",
                type: "update",
              },
              {
                label: "TITLE.DELETE_DATA",
                icon: "fas fa-trash text-danger",
                type: "delete",
              },
            ]}
          />
        ),
      };
      dataArr.push(objData);
    });
    setTableContent(dataArr);
  };

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const fetchData = () => {
    handleLoading("fetch", true);
    // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
    deliveryMonitoring
      .getTaskById(taskId)
      .then((res) => {
        console.log(`res`, res);
        if (res.data.status === true) generateTableContent(res?.data?.data);
      })
      .catch((err) => console.log("err", err))
      .finally(() => handleLoading("fetch", false));
  };

  // const setInitAvailItems = (data) => {
  //   // console.log(`data`, data);
  //   const temp = [];
  //   data.forEach((item) => {
  //     if (item.checked) {
  //       item.checked = false;
  //       temp.push(item);
  //     }
  //   });
  //   setTempOrderItems(temp);
  // };

  React.useEffect(() => {
    generateTableContent(orderItems);
    // setInitAvailItems(items);
    // console.log(`tempOrderItems`, tempOrderItems);
  }, []);

  // console.log(`tableContent`, tableContent);
  // console.log(`orderItems`, orderItems);

  return (
    <React.Fragment>
      <ModalSubmit
        visible={open.submit}
        onClose={() => handleVisible("submit")}
        onSubmit={(params) => handleApi("submit", params)}
        // additionalParams={open.tempParams}
        // update={{ update: false }}
      />

      <Card>
        <CardContent>
          <div className="d-flex justify-content-end w-100 mb-5">
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => handleVisible("submit", items)}
            >
              <span className="nav-icon">
                <i className="flaticon2-plus"></i>
              </span>
              <span className="nav-text">
                <FormattedMessage id="TITLE.ADD" />
              </span>
            </button>
          </div>

          <TablePaginationCustom
            headerRows={tblHeadDlvItem}
            rows={tableContent}
            width={1000}
            loading={false}
            withSearch={false}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  items: deliveryMonitoring.dataBarang,
  orderItems: deliveryMonitoring.dataTask?.task_item_deliveries,
  taskId: deliveryMonitoring.dataTask?.id,
  tempOrderItems: deliveryMonitoring.dataTempOrderItems,
});

const mapDispatch = (dispatch) => ({
  setOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataOrderItems,
      payload: payload,
    });
  },
  setTempOrderItems: (payload) => {
    dispatch({
      type: actionTypes.SetDataTempOrderItems,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(DeliveryOrder);
