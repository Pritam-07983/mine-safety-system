import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Helmets from "./pages/Helmets";
import HelmetDetails from "./pages/HelmetDetails";
import Alerts from "./pages/Alerts";
import Rescue from "./pages/Rescue";
import Miners from "./pages/Miners";

import DashboardLayout from "./components/DashboardLayout";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/helmets"
                    element={
                        <DashboardLayout>
                            <Helmets />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/helmets/:helmetId"
                    element={
                        <DashboardLayout>
                            <HelmetDetails />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/alerts"
                    element={
                        <DashboardLayout>
                            <Alerts />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/rescue"
                    element={
                        <DashboardLayout>
                            <Rescue />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/miners"
                    element={
                        <DashboardLayout>
                            <Miners />
                        </DashboardLayout>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;