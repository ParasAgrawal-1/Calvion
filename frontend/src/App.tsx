import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import VerifyRegistrationOtp from "./pages/VerifyRegistrationOtp";
import AddAsset from "./pages/AddAsset";
import Home from "./pages/Home";
import AssetDetails from "./pages/AssetDetails";
import MyAssets from "./pages/MyAssets";
import EditAsset from "./pages/EditAsset";
import SharedAssets from "./pages/SharedAssets";
import Settings from "./pages/settings/Settings";
function App() {
  return (
      <>
      <BrowserRouter>

        <Routes>

          {/* =========================================
            HOME
        ========================================= */}

          <Route
              path="/"
              element={<Home />}
          />


          {/* =========================================
            AUTHENTICATION
        ========================================= */}

          <Route
              path="/register"
              element={<Register />}
          />

          <Route
              path="/verify-registration-otp"
              element={<VerifyRegistrationOtp />}
          />

          <Route
              path="/login"
              element={<Login />}
          />

          <Route
              path="/forgot-password"
              element={<ForgotPassword />}
          />

          <Route
              path="/verify-otp"
              element={<VerifyOtp />}
          />

          <Route
              path="/reset-password"
              element={<ResetPassword />}
          />


          {/* =========================================
            APPLICATION
        ========================================= */}

          <Route
              path="/dashboard"
              element={<Dashboard />}
          />

          <Route
              path="/add-asset"
              element={<AddAsset />}
          />

          <Route
              path="/assets"
              element={<MyAssets />}
          />

          <Route
              path="/assets/:id/edit"
              element={<EditAsset />}
          />

          <Route
              path="/assets/:id"
              element={<AssetDetails />}
          />

          <Route
              path="/shared-assets"
              element={<SharedAssets />}
          />
          <Route
              path="/settings"
              element={<Settings />}
          />

        </Routes>

      </BrowserRouter>
      <Analytics />
      </>
  );
}

export default App;