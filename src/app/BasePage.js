import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);
const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);
const DeliveryMonitoringRoutes = lazy(() =>
  import("./modules/DeliveryMonitoring/routes/DeliveryMonitoringRoutes")
);
const DeliverableDocumentRoutes = lazy(() =>
  import("./modules/DeliverableDocument/DeliverableDocumentRoutes")
);

const RootClientInvoiceMonitoring = lazy(() =>
  import("./modules/InvoiceMonitoring/Client/RootClientInvoiceMonitoring")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to={ true ? "/client/dashboard":"/vendor/dashboard"} />
        }
        <ContentRoute path="/client/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Route path="/user-profile" component={UserProfilepage} />
        <Route path="/user/delivery_monitoring" component={DeliveryMonitoringRoutes} />
        <Route path="/vendor/deliverable_document" component={DeliverableDocumentRoutes} />
        <Route path="/client/invoice_monitoring" component={RootClientInvoiceMonitoring} />
        <Redirect to="/error" />
      </Switch>
    </Suspense>
  );
}
