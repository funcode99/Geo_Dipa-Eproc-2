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

export default function SumaryStatsDM({ className }) {
  const uiService = useHtmlClassService();

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
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.light.success"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_mixed_widget_14_chart");
    if (!element) {
      return;
    }

    const height = parseInt(KTUtil.css(element, "height"));
    const options = getChartOptions(layoutProps, height);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps]);

  return (
    <div className={`card card-custom ${className}`}>
      {/* Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder ">Summary Contract</h3>
      </div>
      {/* Body */}
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">
          <div id="kt_mixed_widget_14_chart" style={{ height: "200px" }}></div>
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
    </div>
  );
}

function getChartOptions(layoutProps, height) {
  var options = {
    chart: {
      width: "100%",
      type: "donut",
    },
    enabledOnSeries: true,
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],

    dataLabels: {
      enabled: false,
    },
    series: [76, 67, 61, 90],
    tooltip: {
      enabled: true,
      y: {
        formatter: function(val) {
          return val;
        },
        title: {
          formatter: function(seriesName) {
            return seriesName;
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
