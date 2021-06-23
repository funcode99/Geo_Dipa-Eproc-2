import React, { Suspense, lazy, useEffect } from "react";
import {
  Redirect,
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
// Page Guide Metronic
// import { BuilderPage } from "./pages/BuilderPage";
// import { MyPage } from "./pages/MyPage";
// Page Guide Metronic
import { DashboardPage } from "./pages/DashboardPage";
import { useSelector, shallowEqual } from "react-redux";
import RootClientDelivery from "./modules/DeliveryMonitoring/Client/RootClientDelivery";
import RootVendorDelivery from "./modules/DeliveryMonitoring/Vendor/RootVendorDelivery";

// Page Guide Metronic
// const GoogleMaterialPage = lazy(() =>
//   import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
// );
// const ReactBootstrapPage = lazy(() =>
//   import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
// );
// const ECommercePage = lazy(() =>
//   import("./modules/ECommerce/pages/eCommercePage")
// );
// Page Guide Metronic

const UserProfilePageClient = lazy(() =>
  import("./modules/UserProfile/Client/UserProfilePage")
);

const UserProfilePageVendor = lazy(() =>
  import("./modules/UserProfile/Vendor/UserProfilePage")
);

const RootDeliveryMonitoring = lazy(() =>
  import("./modules/DeliveryMonitoring/RootDeliveryMonitoring")
);

const RootClientInvoiceMonitoring = lazy(() =>
  import("./modules/InvoiceMonitoring/Client/RootClientInvoiceMonitoring")
);

const RootVendorInvoiceMonitoring = lazy(() =>
  import("./modules/InvoiceMonitoring/Vendor/RootVendorInvoiceMonitoring")
);

const MasterData = lazy(() => import("./modules/Master/RootMasterData"));

export default function BasePage() {
  let status = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (window.location.pathname.split("/")[1] !== status) {
      history.push("/");
    }
  }, [location]); // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect
            exact
            from="/"
            to={status === "client" ? "/client/dashboard" : "/vendor/dashboard"}
          />
        }
        {<Redirect exact from="/client" to="/client/dashboard" />}
        {<Redirect exact from="/vendor" to="/vendor/dashboard" />}
        <ContentRoute path="/client/dashboard" component={DashboardPage} />
        <ContentRoute path="/vendor/dashboard" component={DashboardPage} />

        {/* Page Guide Metronic */}
        {/* <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} /> */}
        {/* Page Guide Metronic */}

        <Route path="/client/user-profile" component={UserProfilePageClient} />
        <Route path="/vendor/user-profile" component={UserProfilePageVendor} />
        <Route
          path="/client/invoice_monitoring"
          component={RootClientInvoiceMonitoring}
        />
        <Route
          path="/vendor/invoice_monitoring"
          component={RootVendorInvoiceMonitoring}
        />

        <Route path="/client/master" component={MasterData} />
        <Route
          path="/client/delivery-monitoring"
          component={RootClientDelivery}
        />
        <Route
          path="/vendor/delivery-monitoring"
          component={RootVendorDelivery}
        />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
}
