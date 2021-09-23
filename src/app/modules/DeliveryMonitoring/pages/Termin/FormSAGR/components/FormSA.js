import React, { useEffect, useRef, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import { KEYS_TERMIN } from "../../TerminPageNew/STATIC_DATA";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";
import { option_dist_type, sa_field, validationSchema_sa } from "./DUMMY_DATA";
import ModalAddWBS from "./ModalAddWBS";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = ({ fetch_api_sg, keys, loadings_sg, onRefresh, dataSAGR }) => {
  const [arrService, setArrService] = useState({});
  const [listWBS, setlistWBS] = useState([]);
  const [itemJasa, setItemJasa] = useState([]);
  const wbsRef = useRef();
  const saExist = Boolean(dataSAGR.sa);
  const dataSA = dataSAGR.sa;

  const { func, task_id } = React.useContext(TerminPageContext);
  const handleRefresh = () => {
    fetch_api_sg({
      key: keys.fetch_wbs,
      type: "get",
      url: `delivery/wbs`,
      onSuccess: (res) => {
        // console.log("reswbs", res);
        setlistWBS(res.data);
      },
    });
    func.handleApi({
      key: KEYS_TERMIN.f_termin,
      onSuccess: (res) => {
        const tempDataJasa = res.data.task_item_services;
        let tempSubmitJasa = [];
        tempDataJasa.forEach((item) => {
          tempSubmitJasa = item.item_services.filter(
            (service) => service.service
          );
        });
        setItemJasa(tempSubmitJasa);
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
        gl_account: item.gl_account,
        bus_area: item.bus_area,
        costcenter: item.cost_center,
        wbs_elem: item.wbs.label,
        value: item.value,
      })),
    };
    console.log(`data`, params);
    fetch_api_sg({
      key: keys.upload_sa,
      type: "post",
      url: `delivery/task-sa/${task_id}`,
      params,
      onSuccess: (res) => {
        console.log("post sa", res);
        onRefresh();
        // setlistWBS(res.data);
      },
    });
  };
  useEffect(() => handleRefresh(), []);

  const initial = React.useMemo(
    () => ({
      // ext_number: dataSA?.ext_number,
      // short_text: validation.require("Short Text"),
      // location: validation.require("Location"),
      begdate: dataSA?.beg_date,
      enddate: dataSA?.end_date,
      // person_int: validation.require("Person Internal"),
      // person_ext: validation.require("Person External"),
      // post_date: validation.require("Post Date"),
      // ref_doc_no: validation.require("Ref Doc No"),
      // doc_text: validation.require("Doc Text"),
      // po_item: validation.require("PO Item"),
      ...dataSA,
    }),
    [dataSA]
  );

  return (
    !loadings_sg[keys.fetch_sagr] && (
      <FormSAContext.Provider
        value={{
          setArrService,
          listWBS,
          itemJasa,
          readOnly: saExist,
          dataSA: dataSA,
        }}
      >
        {/* <ButtonContained
          onClick={() => wbsRef.current.open()}
          className={"my-5"}
          baseColor={"warning"}
        >
          Lihat Dokumen
        </ButtonContained> */}
        <ModalAddWBS innerRef={wbsRef} />
        {/* <TableSA /> */}
        {itemJasa.length > 0 && <TableSA />}
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
          withSubmit={!saExist}
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
