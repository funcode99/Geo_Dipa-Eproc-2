import React from "react";
import {
  MixedWidget1,
  MixedWidget14,
  ListsWidget9,
  StatsWidget11,
  StatsWidget12,
  ListsWidget1,
  AdvanceTablesWidget2,
  AdvanceTablesWidget4,
  ListsWidget3,
  ListsWidget8,
  /////
  TilesWidget1,
  TilesWidget3,
  TilesWidget10,
  TilesWidget13,
  TilesWidget11,
  TilesWidget12,
  TilesWidget14,
  MixedWidget6,
  MixedWidget10,
  MixedWidget11,
  MixedWidget12,
  ListsWidget10,
  ListsWidget11,
  ListsWidget14,
  MixedWidget4,
  BaseTablesWidget1,
  BaseTablesWidget2,
  BaseTablesWidget6,
  AdvanceTablesWidget9,
  AdvanceTablesWidget1,
  StatsWidget10,
} from "../widgets";
import ListsWidget4 from "../widgets/lists/ListsWidget4";

export function DemoOnly() {
  return (
    <>
      <h1>Demo 1</h1>
      <div className="row">
        <div className="col-lg-6 col-xxl-4">
          <StatsWidget11
            className="card-stretch card-stretch-half gutter-b"
            symbolShape="circle"
            baseColor="success"
          />
          <StatsWidget12 className="card-stretch card-stretch-half gutter-b" />
        </div>

        <div className="col-lg-6 col-xxl-4 order-1 order-xxl-1">
          <ListsWidget1 className="card-stretch gutter-b" />
        </div>
        <div className="col-xxl-8 order-2 order-xxl-1">
          <AdvanceTablesWidget2 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-6 col-xxl-4 order-1 order-xxl-2">
          <ListsWidget3 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-6 col-xxl-4 order-1 order-xxl-2">
          <MixedWidget1 className="card-stretch gutter-b" />
        </div>
        <div className="col-mlg-12 col-xxl-4 order-1 order-xxl-2">
          <ListsWidget8 className="card-stretch gutter-b" />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <MixedWidget14 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-8">
          <AdvanceTablesWidget4 className="card-stretch gutter-b" />
        </div>
      </div>
      <h1>Demo 2</h1>
      {/* begin::Dashboard */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-4">
          <TilesWidget1 className="gutter-b card-stretch" chartColor="danger" />
        </div>
        <div className="col-xl-8">
          <div className="row">
            <div className="col-xl-3">
              <TilesWidget3 className="gutter-b" widgetHeight="150px" />
            </div>
            <div className="col-xl-9">
              <TilesWidget10 className="gutter-b" widgetHeight="150px" />
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6">
              <TilesWidget13 className="gutter-b" widgetHeight="175px" />
              <div className="row">
                <div className="col-xl-6">
                  <TilesWidget11
                    className="gutter-b"
                    baseColor="primary"
                    widgetHeight="150px"
                  />
                </div>
                <div className="col-xl-6">
                  <TilesWidget12
                    className="gutter-b"
                    iconColor="success"
                    widgetHeight="150px"
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <TilesWidget14 className="gutter-b card-stretch" />
            </div>
          </div>
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-lg-6 col-xxl-4">
          <MixedWidget6 className="gutter-b card-stretch" chartColor="danger" />
        </div>

        <div className="col-lg-6 col-xxl-8">
          <AdvanceTablesWidget1 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-4">
          <MixedWidget10 className="card-stretch gutter-b" />
        </div>

        <div className="col-xl-4">
          <MixedWidget11 className="card-stretch gutter-b" />
        </div>

        <div className="col-xl-4">
          <MixedWidget12 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-lg-6">
          <ListsWidget10 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-6">
          <ListsWidget11 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* end::Dashboard */}

      <h1>Dashboard 3</h1>
      {/* begin::Dashboard */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-4">
          <MixedWidget4 className="gutter-b card-stretch" />
        </div>
        <div className="col-xl-8">
          <BaseTablesWidget6 className="gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-4">
          <div className="row">
            <div className="col-xl-12">
              {/* <StatsWidget11
                className="gutter-b"
                symbolShape="circle"
                baseColor="danger"
              /> */}
            </div>
            <div className="col-xl-12">
              <StatsWidget10
                className="gutter-b"
                symbolShape="circle"
                baseColor="info"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <ListsWidget14 className="gutter-b card-stretch" />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-lg-12 col-xxl-12">
          <AdvanceTablesWidget9 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-6">
          <ListsWidget10 className="card-stretch gutter-b" />
        </div>
        <div className="col-xl-6">
          <BaseTablesWidget1 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-lg-4">
          <ListsWidget8 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-8">
          <BaseTablesWidget2 className="card-stretch gutter-b" />
        </div>
      </div>
      {/* end::Row */}

      {/* end::Dashboard */}
    </>
  );
}
