import React from "react"
import { Route, Switch } from "react-router-dom"
import { useSubheader } from '_metronic/layout'

import { injectIntl } from "react-intl"
import { connect } from "react-redux"
import { 
    ContractsAddendumPage,
    AddContractAddendum
 } from 'app/modules/AddendumContract/pages/index'

function RootVendorAddendum(props) {
    const subheader = useSubheader()
    subheader.setTitle("Addendum Contract")

    return(
        <Switch>
            <Route 
                path="/vendor/addendum-contract/list-addendum-request"
                component={ContractsAddendumPage}
            />
            <Route 
                path="/vendor/addendum-contract/contract/:contract_id"
                component={AddContractAddendum}
            />

        </Switch>
    )
}

export default injectIntl(connect(null, null)(RootVendorAddendum))