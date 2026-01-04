import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
import { RouteLoadingIndicator } from "./hooks/page-transition";

function App() {
  return (
    <CommonLayout >
      <RouteLoadingIndicator />
      <Outlet />
    </CommonLayout>
  );
}

export default App;