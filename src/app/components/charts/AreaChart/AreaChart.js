import React from "react";
import { useHtmlClassService } from "../../../../_metronic/layout";
import ApexCharts from "apexcharts";
import objectPath from "object-path";
import { Paper } from "@material-ui/core";
import { format } from "date-fns";
import { formatDate, formatSADate } from "../../../libs/date";

const AreaChart = ({ baseColor, chart_data }) => {
  const uiService = useHtmlClassService();
  const layoutProps = React.useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        `js.colors.theme.base.${baseColor}`
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        `js.colors.theme.light.${baseColor}`
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService, baseColor]);
  const idNow = "chart" + Date.now();

  React.useEffect(() => {
    const element = document.getElementById("kt_stats_widget_11_chart");
    // const element = document.getElementById(idNow);

    if (!element) {
      return;
    }

    const options = getChartOption(layoutProps);

    const objData = chart_data.reduce(
      (acc, el) => {
        return {
          data: [...acc.data, el.y],
          categories: [...acc.categories, formatDate(new Date(el.x * 1000))],
        };
      },
      { data: [], categories: [] }
    );

    options.series[0].data = objData.data;
    options.xaxis.categories = objData.categories;

    // options.series[0].data = [11, 12, 21, 35, 63, 75, 89];
    // options.xaxis.categories = [
    //   "1 Januari 2020",
    //   "1 Februari 2020",
    //   "1 Maret 2020",
    //   "1 April 2020",
    //   "1 Mei 2020",
    //   "1 Juni 2020",
    //   "1 Juli 2020",
    // ];

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, chart_data]);
  return (
    <Paper>
      <div
        id={"kt_stats_widget_11_chart"}
        // id={idNow}
        className="card-rounded-bottom"
        style={{ height: "150px" }}
      ></div>
    </Paper>
  );
};

AreaChart.defaultProps = {
  baseColor: "danger",
};

export default AreaChart;

function getChartOption(layoutProps) {
  const options = {
    series: [
      {
        name: "Progress",
        data: [40, 40, 30, 30, 35, 35, 50],
      },
    ],
    chart: {
      type: "area",
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [layoutProps.colorsThemeBaseSuccess],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        show: true,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function(val) {
          return val + "%";
          //   return "$" + val + " thousands";
        },
      },
    },
    colors: [layoutProps.colorsThemeLightSuccess],
    markers: {
      colors: [layoutProps.colorsThemeLightSuccess],
      strokeColor: [layoutProps.colorsThemeBaseSuccess],
      strokeWidth: 3,
    },
  };
  return options;
}
