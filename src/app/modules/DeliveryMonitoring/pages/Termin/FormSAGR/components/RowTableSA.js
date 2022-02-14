import { TableCell, TableRow } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { object } from "yup";
import { Formik } from "formik";
import validation from "../../../../../../service/helper/validationHelper";
import { option_dist_type, rowTableSA_field } from "./DUMMY_DATA";
import RowInput from "../../../../../../components/input/RowInput";
import { FormSAContext } from "./FormSA";
import ModalAddWBS from "./ModalAddWBS";
import InputWBS from "./InputWBS";

const validationSchema = object().shape({
  // name_service: validation.require("Header Text"),
  bus_area: validation.require("Bus Area"),
  gl_account: validation.require("GL Account"),
  cost_center: validation.require("Cost Center"),
  dist_type: validation.require("Distribution Type"),
  // wbs: validation.require("WBS"),
  // value: validation.require("Value"),
});

const RowTableSA = ({ item, index }) => {
  const formikRef = React.useRef();
  const wbsRef = React.useRef();
  const { setArrService, listWBS, readOnly, options } = useContext(
    FormSAContext
  );

  // const _handleSubmit = (data) => {
  //   console.log(`data`, data);
  // };
  const _handleBlur = () => {
    console.log("formikRef.current", formikRef.current);
    setArrService((prev) => ({
      ...prev,
      [`service_${item?.id}`]: {
        ...formikRef.current.values,
        isValid: formikRef.current.isValid,
      },
    }));
  };
  const _open = () => {
    wbsRef.current.open();
  };
  console.log(`readOnly`, readOnly, item);
  // console.log(`data row`, formikRef.current);
  const _handleSelected = (data) => {
    // console.log(`data`, data);
    const dataArr = Array(data.length)
      .fill()
      .map((_, i) => ({
        name: data[`wbs${i + 1}`].label,
        value: data[`value${i + 1}`],
      }));
    // console.log(`datasss`, dataArr);
    formikRef.current.setFieldValue("wbsdata", dataArr, true);
    setTimeout(() => {
      _handleBlur();
    }, 500);
  };
  useEffect(() => {
    setArrService((prev) => ({
      ...prev,
      [`service_${item?.id}`]: { item, isValid: false },
    }));
    // _handleBlur();
    // formikRef.current.validateForm();
  }, []);

  const initialValue = React.useMemo(
    () => ({
      ...item,
      dist_type: item?.dist_type,
      // wbsdata:
      gl_account: { value: item?.gl_account, label: item?.gl_account },
      cost_center: { value: item?.cost_center, label: item?.cost_center },
    }),
    [item]
  );

  return (
    <React.Fragment key={item?.id}>
      <ModalAddWBS
        innerRef={wbsRef}
        onSelected={_handleSelected}
        onBlur={_handleBlur}
        data={item?.wbsdata}
        dist_value={formikRef?.current?.values?.dist_type}
      />
      <Formik
        innerRef={formikRef}
        initialValues={initialValue}
        // onSubmit={_handleSubmit}
        // validateOnMount
        validateOnChange={false}
        validationSchema={validationSchema}
      >
        <TableRow hover>
          <TableCell
            width={250}
            style={{
              position: "sticky",
              left: 0,
              zIndex: 10,
              backgroundColor: "white",
            }}
          >
            {item.name_service}
          </TableCell>
          {/* <InputWBS
            value={formikRef?.current?.values?.["wbs"]}
            onOpen={_open}
          /> */}
          {rowTableSA_field.map((item, id) => (
            <TableCell width={220} key={id}>
              {/* {id === 1 ? null : ( */}
              <RowInput
                onBlur={_handleBlur}
                {...item}
                // readOnly={readOnly}
                listOptions={{
                  dist_type: option_dist_type,
                  wbs: listWBS.map(({ id, work_breakdown_ap }) => ({
                    value: id,
                    label: work_breakdown_ap,
                  })),
                  gl_account: options.optGL,
                  cost_center: options.optCost,
                }}
                noLabel={true}
                ChildrenProps={{
                  onOpen: _open,
                  defaultValue: initialValue.wbs,
                }}
              />
              {/* )} */}
            </TableCell>
          ))}
        </TableRow>
      </Formik>
    </React.Fragment>
  );
};

export default RowTableSA;
