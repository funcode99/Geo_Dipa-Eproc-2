import React from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { formatDate } from "../../../../../../../libs/date";
import FormBuilder from "../../../../../../../components/builder/FormBuilder";
import { formData } from "./formDataOItem";
import CardOrderItem from "./comp/CardOrderItem";
import { Row } from "react-bootstrap";
import ButtonSubmit from "../../../../../../../components/buttonAction/ButtonSubmit";
import { DeliveryOrderContext } from "../../DeliveryOrder";

const DevOrderItem = ({ data, ...other }) => {
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
        <CardHeader
          classes={{ action: "align-self-center" }}
          title={data?.name}
          subheader={
            data?.date !== null ? formatDate(new Date(data?.date)) : null
          }
          action={
            <ButtonSubmit handleSubmit={() => handleAction("confirm", data)} />
          }
        />
        <CardContent>
          <FormBuilder
            withSubmit={false}
            initial={values}
            formData={formData}
          />
          {/* <Row> */}
          {data?.task_delivery_items.map((el, id) => (
            <CardOrderItem key={id} data={el} {...other} />
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
