import { useExcelDownloder } from "react-xls";
import { useStyleReport } from "../styles";

export const useReportsLogic = () => {
  const classes = useStyleReport();
  const { ExcelDownloder, Type } = useExcelDownloder();

  return {
    ExcelDownloder,
    Type,
    classes,
  };
};

export default useReportsLogic;
