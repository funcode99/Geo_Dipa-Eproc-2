import { TableCell, TableRow } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { object } from "yup";
import { Formik } from "formik";
import validation from "../../../../../../service/helper/validationHelper";
import { option_dist_type, rowTableSA_field } from "./DUMMY_DATA";
import RowInput from "../../../../../../components/input/RowInput";
import { FormSAContext } from "./FormSA";

const validationSchema = object().shape({
  // name_service: validation.require("Header Text"),
  gl_account: validation.require("GL Account"),
  bus_area: validation.require("Bus Area"),
  cost_center: validation.require("Cost Center"),
  dist_type: validation.require("Distribution Type"),
  wbs: validation.require("WBS"),
  value: validation.require("Value"),
});

const RowTableSA = ({ item, index }) => {
  const formikRef = React.useRef();
  const { setArrService, listWBS } = useContext(FormSAContext);

  // const _handleSubmit = (data) => {
  //   console.log(`data`, data);
  // };
  const _handleBlur = () => {
    setArrService((prev) => ({
      ...prev,
      [`service_${index}`]: formikRef.current.values,
    }));
  };
  useEffect(() => {
    setArrService((prev) => ({ ...prev, [`service_${index}`]: item }));
  }, []);

  return (
    <Formik
      key={index}
      innerRef={formikRef}
      initialValues={item}
      // onSubmit={_handleSubmit}
      validationSchema={validationSchema}
    >
      <TableRow hover>
        <TableCell width={250}>{item.name_service}</TableCell>
        {rowTableSA_field.map((item, id) => (
          <TableCell width={220} key={id}>
            <RowInput
              onBlur={_handleBlur}
              {...item}
              listOptions={{
                dist_type: option_dist_type,
                wbs: listWBS.map(({ id, work_breakdown_ap }) => ({
                  value: id,
                  label: work_breakdown_ap,
                })),
              }}
              noLabel={true}
            />
          </TableCell>
        ))}
      </TableRow>
    </Formik>
  );
};

export default RowTableSA;
