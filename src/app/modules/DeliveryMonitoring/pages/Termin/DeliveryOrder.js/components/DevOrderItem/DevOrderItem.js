import React from "react";
import { Card, CardContent, CardHeader, Divider } from "@material-ui/core";
import { formatDate } from "../../../../../../../libs/date";
import FormBuilder from "../../../../../../../components/builder/FormBuilder";
import { formData } from "./formDataOItem";
import CardOrderItem from "./comp/CardOrderItem";
import { Row } from "react-bootstrap";
import ButtonSubmit from "../../../../../../../components/buttonAction/ButtonSubmit";
import { DeliveryOrderContext } from "../../DeliveryOrder";

const DevOrderItem = ({ data, isVendor, ...other }) => {
  const { handleAction } = other;
  const [visible, setVisible] = React.useState(false);
  // const [itemForm, setItemForm] = React.useState({});

  React.useEffect(() => {
    if (Object.keys(data).length) setVisible(true);
    else setVisible(false);
  }, [data]);

  const values = React.useMemo(
    () => ({
      deliv_status: data?.approve_status?.name,
      deliv_status_remarks: data?.reject_text,
    }),
    [data]
  );

  // React.useEffect(() => {
  //   console.log(`itemForm`, itemForm, Object.values(itemForm));
  // }, [itemForm]);

  return (
    visible &&
    Object.keys(data).length && (
      <Card style={{ marginTop: 21 }}>
        {/* <CardHeader
          classes={{ action: "align-self-center" }}
          title={data?.name}
          subheader={
            data?.date !== null ? formatDate(new Date(data?.date)) : null
          }
          action={
            !isVendor && (
              <ButtonSubmit
                handleSubmit={() => handleAction("confirm", data)}
              />
            )
          }
        /> */}
        <div className="kt-widget31 my-5">
          <div className="kt-widget31__item">
            <div className="kt-widget31__content">
              <div className="kt-widget31__info">
                <p className="kt-widget31__username mb-0 ">{data?.name}</p>
                <p className="kt-widget31__text">
                  {data?.date !== null
                    ? formatDate(new Date(data?.date))
                    : null}
                </p>
              </div>
            </div>
            <div style={{ width: "50%" }} className="kt-widget31__content">
              <div className="kt-widget31__progress">
                <p className="kt-widget31__stats">
                  <span>Progress</span>
                  <span>63%</span>
                </p>
                <div className="progress progress-sm">
                  <div
                    className="progress-bar bg-brand"
                    role="progressbar"
                    style={{ width: "75%" }}
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <button
                href="#"
                className="btn-label-brand btn btn-sm btn-bold mr-5"
              >
                Upload Delivery Order
              </button>
            </div>
          </div>
        </div>
        <Divider />

        <CardContent>
          <FormBuilder
            withSubmit={false}
            initial={values}
            formData={formData}
          />
          {/* <Row> */}
          {data?.task_delivery_items.map((el, id) => (
            <CardOrderItem key={id} data={el} isVendor={isVendor} {...other} />
          ))}
          {/* {data?.task_delivery_items.map((el, id) => (
            <CardOrderItem key={id} data={el} />
          ))}
          {data?.task_delivery_items.map((el, id) => (
            <CardOrderItem key={id} data={el} />
          ))}
          {data?.task_delivery_items.map((el, id) => (
            <CardOrderItem key={id} data={el} />
          ))} */}
          {/* </Row> */}
        </CardContent>
      </Card>
    )
  );
};

export default DevOrderItem;
