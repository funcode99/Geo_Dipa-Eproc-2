import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { useSubheader } from '_metronic/layout'

import { injectIntl } from "react-intl"
import { connect } from "react-redux"
import { ContractsAddendumPage } from 'app/modules/AddendumContract/pages'

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
        </Switch>
    )
}

export default injectIntl(connect(null, null)(RootClientAddendum));