import React from "react";
import { FormattedMessage } from "react-intl";
import AreaChart from "../../../../../../components/charts/AreaChart";
import DialogGlobal from "../../../../../../components/modals/DialogGlobal";
import { formatDate, formatSADate } from "../../../../../../libs/date";

const CardProgress = ({
  title,
  subTitle,
  percentage,
  scheme,
  onOpen,
  data,
}) => {
  const [visible, setVisible] = React.useState(false);
  const chartRef = React.useRef();
  const openChart = () => {
    // chartRef.current.open();
    // setVisible(true);
    onOpen({
      scheme,
      charts: data?.chart_data,
      // charts: data?.chart_data.map((el) => ({
      //   ...el,
      //   x: formatDate(new Date(1630454400 * 1000)),
      // })),
    });
  };
  return (
    <React.Fragment>
      <div className="kt-widget24">
        <div className="kt-widget24__details">
          <div className="kt-widget24__info">
            <h4 className="kt-widget24__title">{title}</h4>
            <span className="kt-widget24__desc">{subTitle}</span>
          </div>
          <div className="kt-widget19__action">
            <button
              onClick={openChart}
              className={`btn btn-sm btn-label-${scheme} btn-bold`}
            >
              Selengkapnya
            </button>
          </div>
        </div>
        <div className="progress progress--sm">
          <div
            className={`progress-bar kt-bg-${scheme}`}
            role="progressbar"
            style={{ width: `${parseFloat(data?.percentage)}%` }}
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="kt-widget24__action">
          <span className="kt-widget24__change">Progress</span>
          <span className="kt-widget24__number">{data?.percentage}%</span>
        </div>
      </div>
      {/* <DialogGlobal
        // ref={chartRef}
        visible={visible}
        textNo={
          <FormattedMessage id="TITLE.MODAL_CREATE.LABEL.BUTTON_FAILED" />
        }
        title={"Chart Report"}
      >
        {visible && <AreaChart baseColor={scheme} />}
      </DialogGlobal> */}
      {/* <AreaChart /> */}
    </React.Fragment>
  );
};

export default CardProgress;
