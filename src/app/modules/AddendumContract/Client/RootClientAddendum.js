import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { useSubheader } from '_metronic/layout'

import { injectIntl } from "react-intl"
import { connect } from "react-redux"
import { 
    ContractsAddendumPage,
    ContractAddendumDetail
 } from 'app/modules/AddendumContract/pages/index'

function RootClientAddendum() {
    const subheader = useSubheader()
    subheader.setTitle("Addendum Contract")

    return(
        <Switch>
            <Route 
                path="/client/addendum-contract/list-contract-po"
                component={ContractsAddendumPage}
            />
            {/* <Route 
                path="/client/addendum-contract/list-request"
                component={ListOfRequestAddendumPage}
            /> */}
            <Route 
                path="/client/addendum-contract/contract/:contract_id"
                component={ContractAddendumDetail}
            />

        </Switch>
    )
}

export default injectIntl(connect(null, null)(RootClientAddendum));