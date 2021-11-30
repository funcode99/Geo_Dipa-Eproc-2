import React from "react";
import {ListsWidget10, ListsWidget11, AdvanceTablesWidget1, MixedWidget6, MixedWidget10, MixedWidget11, MixedWidget12, TilesWidget1, TilesWidget3, TilesWidget10, TilesWidget11, TilesWidget12, TilesWidget13, TilesWidget14, TilesWidgetInformation} from "../widgets";

export function InformationDashboard() {
    return <>
        {/* begin::Dashboard */}

        {/* begin::Row */}
        <div className="row">
            <div className="col-xl-12">
                <div className="row">
                    <div className="col-xl-11">
                        <TilesWidgetInformation  className="gutter-b" widgetHeight="150px"/>
                    </div>
                </div>

            </div>
        </div>
        {/* end::Row */}

        {/* end::Dashboard */}
    </>;
}
