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
  gl_account: validation.require("GL Account"),
  bus_area: validation.require("Bus Area"),
  cost_center: validation.require("Cost Center"),
  dist_type: validation.require("Distribution Type"),
  // wbs: validation.require("WBS"),
  // value: validation.require("Value"),
});

const RowTableSA = ({ item, index }) => {
  const formikRef = React.useRef();
  const wbsRef = React.useRef();
  const { setArrService, listWBS, readOnly } = useContext(FormSAContext);

  // const _handleSubmit = (data) => {
  //   console.log(`data`, data);
  // };
  const _handleBlur = () => {
    console.log("formikRef.current", formikRef.current);
    setArrService((prev) => ({
      ...prev,
      [`service_${index}`]: {
        ...formikRef.current.values,
        isValid: formikRef.current.isValid,
      },
    }));
  };
  const _open = () => {
    wbsRef.current.open();
  };
  console.log(`readOnly`, readOnly);
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
      [`service_${index}`]: { item, isValid: false },
    }));
    // _handleBlur();
    // formikRef.current.validateForm();
  }, []);

  return (
    <React.Fragment key={index}>
      <ModalAddWBS
        innerRef={wbsRef}
        onSelected={_handleSelected}
        onBlur={_handleBlur}
      />
      <Formik
        innerRef={formikRef}
        initialValues={item}
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
                }}
                noLabel={true}
                ChildrenProps={{
                  onOpen: _open,
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
