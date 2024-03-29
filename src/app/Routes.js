/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, { lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import VerificationQrCodeDM from "./modules/VerificationQrCode/VerificationQrCodeDM";

const UserNewAccountHomePage = lazy(() =>
  import("./modules/UserCreate/CreateNewAccountHome")
);

const VerificationQrCode = lazy(() =>
  import("./modules/VerificationQrCode/VerificationQrCode")
);
const DeliveryOrderStatusPg = lazy(() =>
  import("./modules/DeliveryMonitoring/pages/DeliveryOrderStatusPg")
);

export function Routes() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  );

  return (
    <Switch>
      <Route path="/create-account" component={UserNewAccountHomePage} />
      <Route path="/qrcode" component={VerificationQrCode} />
      <Route path="/qrcode-dm" component={VerificationQrCodeDM} />
      <Route path="/update-do-status" component={DeliveryOrderStatusPg} />
      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route>
          <AuthPage />
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />

      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}
    </Switch>
  );
}
