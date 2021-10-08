import React, { useEffect, useRef, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import { KEYS_TERMIN } from "../../TerminPageNew/STATIC_DATA";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";
import { option_dist_type, sa_field, validationSchema_sa } from "./DUMMY_DATA";
import ModalAddWBS from "./ModalAddWBS";
import TableAccordSA from "./TableAccordSA";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = ({ fetch_api_sg, keys, loadings_sg, onRefresh, dataSAGR }) => {
  const [arrService, setArrService] = useState({});
  const [listWBS, setlistWBS] = useState([]);
  const [itemJasa, setItemJasa] = useState([]);
  const [optGL, setOptGL] = useState([]);
  const [optCost, setOptCost] = useState([]);
  const dataSA = dataSAGR.sa;
  const saExist = Boolean(dataSA?.[0]);

  const { func, task_id } = React.useContext(TerminPageContext);
  const handleRefresh = () => {
    fetch_api_sg({
      key: keys.fetch_wbs,
      type: "get",
      url: `delivery/wbs`,
      onSuccess: (res) => {
        console.log("reswbs", res);
        setlistWBS(res.data);
      },
    });
    func.handleApi({
      key: KEYS_TERMIN.f_termin,
      onSuccess: (res) => {
        console.log(`resss`, res);
        const tempDataJasa = res.data.task_item_services;
        let tempSubmitJasa = [];
        tempDataJasa.forEach((item) => {
          tempSubmitJasa = item.item_services.filter(
            (service) => service.service
          );
        });
        setItemJasa(tempDataJasa);
      },
    });
  };
  const disabled = [""];
  const _handleSubmit = ({ begdate, enddate, ...data }) => {
    const params = {
      ...data,
      beg_date: begdate,
      end_date: enddate,
      services: Object.values(arrService).map((item) => ({
        service_id: item.service_id,
        distribution_type: item.dist_type.value,
        gl_account: item.gl_account.code,
        bus_area: item.bus_area,
        costcenter: item.cost_center.code,
        // wbs_elem: item.wbs.label,
        // value: item.value,
        wbs: item.wbsdata,
      })),
    };
    // console.log(`data`, params, data, dataSA);
    fetch_api_sg({
      key: keys.upload_sa,
      type: "post",
      url: `delivery/task-sa/${task_id}`,
      alertAppear: "both",
      params,
      onSuccess: (res) => {
        console.log("post sa", res);
        onRefresh();
        // setlistWBS(res.data);
      },
    });
  };
  const fetchOption = () => {
    fetch_api_sg({
      key: "option-gl",
      type: "get",
      url: `delivery/gl_account`,
      onSuccess: (res) => {
        // console.log("resp gl_account", res);
        setOptGL(
          res.data.map((el) => ({ ...el, label: el.name, value: el.code }))
        );
      },
    });
    fetch_api_sg({
      key: "option-cost",
      type: "get",
      url: `delivery/cost_center`,
      onSuccess: (res) => {
        // console.log("resp cost_center", res);
        setOptCost(
          res.data.map((el) => ({ ...el, label: el.code, value: el.code }))
        );
      },
    });
  };
  useEffect(() => {
    handleRefresh();
    fetchOption();
  }, []);

  const initial = React.useMemo(
    () => ({
      // ext_number: dataSA?.ext_number,
      // short_text: validation.require("Short Text"),
      // location: validation.require("Location"),
      // person_int: validation.require("Person Internal"),
      // person_ext: validation.require("Person External"),
      // post_date: validation.require("Post Date"),
      // ref_doc_no: validation.require("Ref Doc No"),
      // doc_text: validation.require("Doc Text"),
      // po_item: validation.require("PO Item"),
      begdate: dataSA?.[0]?.beg_date,
      enddate: dataSA?.[0]?.end_date,
      ...dataSA?.[0],
    }),
    [dataSA]
  );

  // console.log(`dataSA`, dataSA);

  const options = { optCost, optGL };

  return (
    !loadings_sg[keys.fetch_sagr] && (
      <FormSAContext.Provider
        value={{
          setArrService,
          listWBS,
          itemJasa,
          // readOnly: saExist,
          saExist,
          dataSA,
          options,
        }}
      >
        {/* <TableSA /> */}
        {/* {itemJasa.length > 0 && <TableSA />} */}
        {itemJasa.length > 0 && <TableAccordSA />}
        {/* {saExist && !loadings_sg[keys.fetch_sagr] && ( */}
        <FormBuilder
          loading={loadings_sg[keys.upload_sa]}
          onSubmit={_handleSubmit}
          formData={sa_field}
          validation={validationSchema_sa}
          initial={initial}
          fieldProps={
            {
              // readOnly: saExist || itemJasa.length === 0,
            }
          }
          // withSubmit={!saExist}
          disabledButton={Object.values(arrService).some(
            ({ isValid }, id) => isValid === false
          )}
        />
        {/* )} */}
      </FormSAContext.Provider>
    )
  );
};

export default FormSA;
