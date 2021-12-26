/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Dropdown } from "react-bootstrap";
// import {useHtmlClassService} from "../../../layout";
// import {DropdownMenu4, DropdownCustomToggler} from "../../dropdowns";
// import {KTUtil} from "../../../_assets/js/components/util";
import { useHtmlClassService } from "../../../../../../_metronic/layout";
import {
  DropdownCustomToggler,
  DropdownMenu4,
} from "../../../../../../_metronic/_partials/dropdowns";
import { KTUtil } from "../../../../../../_metronic/_assets/js/components/util";
import { Link } from "react-router-dom";
import { rupiah } from "../../../../../libs/currency";

export default function SumaryStatsDM({
  data,
  className,
  authStatus,
  openModal,
  pie_chart_datas,
}) {
  const uiService = useHtmlClassService();
  const chartKey = "kt_mixed_widget_14_chart" + new Date();

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray100: objectPath.get(
        uiService.config,
        "js.colors.gray.gray100"
      ),
      colorsGrayGray700: objectPath.get(
        uiService.config,
        "js.colors.gray.gray700"
      ),
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.base.success"
      ),
      colorsThemeBaseWarning: objectPath.get(
        uiService.config,
        "js.colors.theme.base.warning"
      ),
      colorsThemeBaseDanger: objectPath.get(
        uiService.config,
        "js.colors.theme.base.danger"
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.light.success"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById(chartKey);
    if (!element) {
      return;
    }

    const height = parseInt(KTUtil.css(element, "height"));
    const options = getChartOptions(layoutProps, height, [
      parseInt(pie_chart_datas.sagr),
      parseInt(pie_chart_datas.on_progress),
      parseInt(pie_chart_datas.overdue),
      // 12,
      // 32,
      // 55,
    ]);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, pie_chart_datas]);

  return (
    <div className={`card card-custom ${className}`}>
      {/* Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder ">Summary Contract</h3>
      </div>
      {/* Body */}
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">
          <div id={chartKey} style={{ height: "200px" }}></div>
        </div>
        {/* <div className="pt-5">
          <p className="text-center font-weight-normal font-size-lg pb-7">
            Notes: Current sprint requires stakeholders
            <br />
            to approve newly amended policies
          </p>
          <a
            href="#"
            className="btn btn-success btn-shadow-hover font-weight-bolder w-100 py-3"
          >
            Generate Report
          </a>
        </div> */}
      </div>
      <div className="card-spacer mt10">
        <div className=" bg-light-success px-8 py-3 rounded-xl mb-7">
          <Link
            className="text-success font-weight-bold font-size-h6"
            onClick={() => openModal("success")}
          >
            {data?.sagr} Success
          </Link>
        </div>
        <div className=" bg-light-warning px-8 py-3 rounded-xl mb-7">
          <Link
            className="text-warning font-weight-bold font-size-h6"
            onClick={() => openModal("onprogress")}
          >
            {data?.on_progress} On Progress
          </Link>
        </div>
        <div className=" bg-light-danger px-8 py-3 rounded-xl mb-7">
          <Link
            className="text-danger font-weight-bold font-size-h6"
            onClick={() => openModal("overdue")}
          >
            {data?.overdue} Overdue
          </Link>
        </div>
      </div>
    </div>
  );
}

let series_labels = ["Success", "On Progress", "Overdue"];

function getChartOptions(layoutProps, height, series) {
  var options = {
    chart: {
      width: "100%",
      type: "donut",
    },
    enabledOnSeries: true,
    // colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    colors: [
      layoutProps.colorsThemeBaseSuccess,
      layoutProps.colorsThemeBaseWarning,
      layoutProps.colorsThemeBaseDanger,
    ],
    dataLabels: {
      enabled: false,
    },
    // series: [76, 67, 61],
    series,
    tooltip: {
      enabled: true,
      y: {
        formatter: function(val) {
          return rupiah(val);
        },
        title: {
          formatter: function(seriesName, index) {
            console.log(`index`, index);
            return series_labels[index.seriesIndex] || seriesName;
          },
        },
      },
    },
    legend: {
      show: false,
    },
  };
  // const options = {
  //   series: [74],
  //   chart: {
  //     height: height,
  //     type: "radialBar",
  //   },
  //   plotOptions: {
  //     radialBar: {
  //       hollow: {
  //         margin: 0,
  //         size: "65%",
  //       },
  //       dataLabels: {
  //         showOn: "always",
  //         name: {
  //           show: false,
  //           fontWeight: "700",
  //         },
  //         value: {
  //           color: layoutProps.colorsGrayGray700,
  //           fontSize: "30px",
  //           fontWeight: "700",
  //           offsetY: 12,
  //           show: true,
  //         },
  //       },
  //       track: {
  //         background: layoutProps.colorsThemeLightSuccess,
  //         strokeWidth: "100%",
  //       },
  //     },
  //   },
  //   colors: [layoutProps.colorsThemeBaseSuccess],
  //   stroke: {
  //     lineCap: "round",
  //   },
  //   labels: ["Progress"],
  // };
  return options;
}
