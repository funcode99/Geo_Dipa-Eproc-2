import React from "react";
import { useDispatch } from "react-redux";
import { fetch_api_sg } from "../../../redux/globalReducer";

const useStatusOption = () => {
  const [options, setOptions] = React.useState([]);
  React.useEffect(() => {
    getOptions();
  }, []);
  const dispatch = useDispatch();
  const changeSequenceOptions = (arr) => {
    let temp = [];
    arr.forEach((item) => {
      if (item.code === "rejected") {
        temp[0] = item;
      }

      if (item.code === "approved") {
        temp[1] = item;
      }

      if (item.code === "waiting") {
        temp[2] = item;
      }
    });
    return temp;
  };
  const addClassToOptions = (data) => {
    data.map((item, index) => {
      switch (item.name) {
        case "WAITING APPROVAL":
          item.class = "dark";
          break;

        case "APPROVED":
          item.class = "success";
          break;

        case "REJECTED":
          item.class = "danger";
          break;

        default:
          break;
      }
    });
  };
  const getOptions = async () => {
    dispatch(
      fetch_api_sg({
        key: "approve-status-option",
        type: "get",
        url: `/delivery/options`,
        onSuccess: (res) => {
          let approveStatusOptions = res?.data?.approve_status;
          approveStatusOptions = changeSequenceOptions(approveStatusOptions);
          addClassToOptions(approveStatusOptions);
          setOptions(approveStatusOptions);
        },
      })
    );
  };

  return { approveOption: options };
};

export default useStatusOption;
