import React, { useEffect, useRef, useState } from "react";
import NoDataBox from "../../../../../../components/boxes/NoDataBox/NoDataBox";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import { KEYS_TERMIN } from "../../TerminPageNew/STATIC_DATA";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";
import { option_dist_type, sa_field, validationSchema_sa } from "./DUMMY_DATA";
import ModalAddWBS from "./ModalAddWBS";
import TableAccordSA from "./TableAccordSA";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = ({
  fetch_api_sg,
  keys,
  dataContractById,
  loadings_sg,
  onRefresh,
  dataSAGR,
  docDate,
}) => {
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
      // url: `delivery/wbs/${dataContractById?.id}`,
      url: `delivery/wbs-task/${dataContractById?.id}`,
      onSuccess: (res) => {
        setlistWBS(res.data);
      },
    });
    func.handleApi({
      key: KEYS_TERMIN.f_termin,
      onSuccess: (res) => {
        const tempDataJasa = res.data.task_item_services;
        // let tempSubmitJasa = [];
        // tempDataJasa.forEach((item) => {
        //   tempSubmitJasa = item.item_services.filter(
        //     (service) => service.service
        //   );
        // });
        setItemJasa(tempDataJasa);
      },
    });
  };
  const disabled = [""];
  const _handleSubmit = React.useCallback(
    ({ begdate, enddate, ...data }) => {
      const params = {
        ...data,
        beg_date: begdate,
        end_date: enddate,
        services: Object.values(arrService).map((item) => ({
          service_id: item.service_id,
          distribution_type: item.dist_type.value,
          gl_account: item.gl_account.value,
          bus_area: item.bus_area,
          costcenter: item.cost_center.value,
          // wbs_elem: item.wbs.label,
          // value: item.value,
          wbs: item.wbsdata,
        })),
      };
      fetch_api_sg({
        key: keys.upload_sa,
        type: "post",
        url: `delivery/task-sa/${task_id}`,
        alertAppear: "both",
        params,
        onSuccess: (res) => {
          onRefresh();
          // setlistWBS(res.data);
        },
      });
    },
    [arrService, fetch_api_sg, keys.upload_sa, onRefresh, task_id]
  );
  const fetchOption = () => {
    fetch_api_sg({
      key: "option-gl",
      type: "get",
      url: `delivery/gl_account`,
      onSuccess: (res) => {
        setOptGL(
          res.data.map((el) => ({ ...el, label: el.code, value: el.code }))
        );
      },
    });
    fetch_api_sg({
      key: "option-cost",
      type: "get",
      url: `delivery/cost_center`,
      onSuccess: (res) => {
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

  const initial_header = React.useMemo(
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
      person_int: dataSAGR?.base_sa?.person_internal,
      person_ext: dataSAGR?.base_sa?.person_external,
      begdate: dataSAGR?.base_sa?.task_start_date,
      enddate: dataSAGR?.base_sa?.task_due_date,
      ref_doc_no: dataSAGR?.base_sa?.no,
      ext_number: dataSAGR?.base_sa?.vendor_no,
      doc_date: docDate,
    }),
    [dataSAGR, docDate]
  );

  const options = { optCost, optGL };

  if (itemJasa.length == 0) {
    return <NoDataBox text={"Form Service Acceptance not Available"} />;
  }

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
          baseSA: dataSAGR?.base_sa,
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
          initial={saExist ? initial : initial_header}
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
