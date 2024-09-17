
import { Suspense, lazy } from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import RootPage from "../pages/home/RootPage";
const NotFound = lazy(() => import("../pages/home/NotFound"));
import SlimTopLoading from "../components/app/SlimTopLoading";
import administration_routes from "./admin/administration_routes";


export default function RoutesProvider() {
  return (
    <Suspense fallback={<SlimTopLoading />}>
      <Routes>
        <Route path="/" element={<RootPage />}></Route>
        {administration_routes}

        <Route Component={NotFound} path="*" />
      </Routes>
    </Suspense>
  )
}