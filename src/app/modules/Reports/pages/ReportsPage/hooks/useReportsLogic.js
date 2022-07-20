import { isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useExcelDownloder } from "react-xls";
import { fetch_api_sg } from "../../../../../../redux/globalReducer";
import { useStyleReport } from "../styles";

const baseQuery = {
  unit: "",
  start_date: "",
  end_date: "",
};

const key = "REPORTS_KEY";
const url_report = `delivery/report`;

export const useReportsLogic = () => {
  const classes = useStyleReport();
  const dispatch = useDispatch();
  const [query, setQuery] = useState(null);
  const [content, setContent] = useState([]);
  const { ExcelDownloder, Type } = useExcelDownloder();
  let filteredData = useMemo(() => {
    if (isEmpty(query)) return content;
    if (isEmpty(content)) return content;
    let tempData = [...content];

    return tempData.filter((item) => {
      let checkUnit = isEmpty(query.unit) ? true : query.unit === item.name;
      let checkStartDate = isEmpty(query.start_date)
        ? true
        : item.tanggal_kontrak > query.start_date;
      let checkEndDate = isEmpty(query.end_date)
        ? true
        : query.end_date > item.tanggal_kontrak;

      return checkUnit && checkStartDate && checkEndDate;
      // return checkStartDate;
    });
  }, [query, content]);

  const fetchReports = useCallback((refresh) => {
    dispatch(
      fetch_api_sg({
        key,
        type: "get",
        url: url_report,
        // params: {},
        onSuccess: (result) => {
          const dataMapped = result.data.map((item, index) => ({
            "No. Kontrak": item.nomor_kontrak,
            "No. PO": item.no_po,
            "Judul Pengadaan": item.judul_pengadaan,
            "Scope of Work": item.scope_of_work,
            "Nilai Kontrak/PO (exc PPN) ": item.nilai_kontrak,
            "Tanggal Kontrak/PO": item.tanggal_kontrak,
            "Due Date": item.due_date,
            "Group/Cost Center": item.group_cost_center,
            Vendor: item.vendor,
            "Nomor Vendor": item.nomor_vendor,
            "Material Document (SA) ": item.material_document_sa,
            "SA Released Date": item.released_date_sa,
            "Material Document (GR 101/GR 105) ": item.material_document_gr,
            "GR Released Date": item.released_date_gr,
            "SPP Number": item.spp_number,
            "Receipt Number": item.receipt_number,
            "Invoice Number ": item.invoice_number,
            "Tax Number": item.tax_number,
            "Tax Posting Date ": item.tax_date,
            "BKB Number": item.bkb_number,
            "Park AP": item.park_ap_number,
            "Park BYR ": item.park_byr_number,
            "SPT Date": item.spt_date,
            "Payment Date": item.payment_date,
            name: item.name,
            tanggal_kontrak: item.tanggal_kontrak,
          }));
          setContent(dataMapped);
        },
      })
    );
  }, []);

  useEffect(function firstFetchReports() {
    fetchReports();
  }, []);

  return {
    ExcelDownloder,
    Type,
    classes,
    content: filteredData,
    setQuery,
    query,
  };
};

export default useReportsLogic;
