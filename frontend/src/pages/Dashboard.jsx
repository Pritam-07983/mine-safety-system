import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DemoSensorSimulator from "../components/DemoSensorSimulator";
import API from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [helmets, setHelmets] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const [dashboardData, setDashboardData] = useState({
        totalHelmets: 0,
        safeHelmets: 0,
        warningHelmets: 0,
        criticalHelmets: 0,
        offlineHelmets: 0,
        activeAlerts: 0,
        totalAlerts: 0
    });

    const [loading, setLoading] = useState(true);


    // Fetch Dashboard Data

    const fetchDashboardData = async () => {
        try {
            const response = await API.get("/dashboard");

            setDashboardData(response.data);

        } catch (error) {
            console.error(
                "Failed to fetch dashboard data:",
                error
            );
        }
    };


    // Fetch Helmets + Sensors


    const fetchHelmets = async () => {
        try {
            const helmetResponse = await API.get("/helmets");

            const helmetList = helmetResponse.data;

            const updatedHelmets = await Promise.all(
                helmetList.map(async (helmet) => {

                    let sensor = null;

                    try {
                        const sensorResponse = await API.get(
                            `/sensors/${helmet.helmetId}`
                        );

                        if (sensorResponse.data.length > 0) {
                            sensor = sensorResponse.data[0];
                        }

                    } catch (error) {
                        console.error(
                            `Failed to fetch sensor data for ${helmet.helmetId}`,
                            error
                        );
                    }


                    return {
                        id: helmet.helmetId,

                        miner: helmet.minerName,

                        status: helmet.status,

                        battery: `${helmet.battery}%`,

                        temperature: sensor
                            ? `${sensor.temperature}°C`
                            : "N/A",

                        humidity: sensor
                            ? `${sensor.humidity}%`
                            : "N/A",

                        gas: sensor
                            ? sensor.gas
                            : "N/A",

                        co: sensor
                            ? `${sensor.co} ppm`
                            : "N/A",

                        ch4: sensor
                            ? `${sensor.ch4}%`
                            : "N/A",

                        o2: sensor
                            ? `${sensor.o2}%`
                            : "N/A",

                        heartRate: sensor
                            ? `${sensor.heartRate} BPM`
                            : "N/A",

                        spo2: sensor
                            ? `${sensor.spo2}%`
                            : "N/A"
                    };
                })
            );

            setHelmets(updatedHelmets);

        } catch (error) {
            console.error(
                "Failed to fetch helmets:",
                error
            );
        }
    };


    // =========================
    // Fetch Active Alerts
    // =========================

    const fetchAlerts = async () => {
        try {
            const response = await API.get("/alerts/active");

            setAlerts(response.data);

        } catch (error) {
            console.error(
                "Failed to fetch alerts:",
                error
            );
        }
    };


    // =========================
    // Initial Load
    // =========================

    useEffect(() => {

        const loadDashboard = async () => {

            setLoading(true);

            await Promise.all([
                fetchDashboardData(),
                fetchHelmets(),
                fetchAlerts()
            ]);

            setLoading(false);
        };

        loadDashboard();

    }, []);


    // =========================
    // Refresh Dashboard
    // =========================

    const refreshDashboard = async () => {

        setLoading(true);

        await Promise.all([
            fetchDashboardData(),
            fetchHelmets(),
            fetchAlerts()
        ]);

        setLoading(false);
    };


    return (
        <div className="space-y-8">

            {/* Dashboard Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Mine Safety Dashboard
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Underground Mine Monitoring & Rescue System
                    </p>
                </div>


                <div className="flex items-center gap-3">

                    <button
                        onClick={refreshDashboard}
                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                    >
                        🔄 Refresh
                    </button>

                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        System Online
                    </div>

                </div>

            </div>


            {/* Statistics */}

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">


                {/* Total */}

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Total Helmets
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                        {loading ? "..." : dashboardData.totalHelmets}
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                        Registered helmets
                    </p>

                </div>


                {/* Safe */}

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Safe
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {loading ? "..." : dashboardData.safeHelmets}
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                        Helmets operating normally
                    </p>

                </div>


                {/* Warning */}

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Warning
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-500 mt-2">
                        {loading ? "..." : dashboardData.warningHelmets}
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                        Require attention
                    </p>

                </div>


                {/* Critical */}

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Critical
                    </p>

                    <h2 className="text-3xl font-bold text-red-600 mt-2">
                        {loading ? "..." : dashboardData.criticalHelmets}
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                        Immediate action required
                    </p>

                </div>


                {/* Alerts */}

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Active Alerts
                    </p>

                    <h2 className="text-3xl font-bold text-orange-500 mt-2">
                        {loading ? "..." : dashboardData.activeAlerts}
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                        Unresolved alerts
                    </p>

                </div>

            </section>


            {/* Demo Simulator */}

            <DemoSensorSimulator />


            {/* Helmet Monitoring */}

            <section>

                <div className="flex items-center justify-between mb-5">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Helmet Monitoring
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Live sensor data from miner helmets
                        </p>
                    </div>


                    <button
                        onClick={() => navigate("/helmets")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        View All →
                    </button>

                </div>


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {loading ? (

                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            Loading helmet data...
                        </div>

                    ) : helmets.length === 0 ? (

                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            No helmets found.
                        </div>

                    ) : (

                        helmets.map((helmet) => (

                            <div
                                key={helmet.id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                            >

                                {/* Helmet Header */}

                                <div className="flex items-center justify-between p-5 border-b border-slate-100">

                                    <div>

                                        <h3 className="text-lg font-bold text-slate-800">
                                            {helmet.id}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Miner: {helmet.miner}
                                        </p>

                                    </div>


                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            helmet.status === "SAFE"
                                                ? "bg-green-100 text-green-700"
                                                : helmet.status === "WARNING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : helmet.status === "CRITICAL"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        {helmet.status}
                                    </span>

                                </div>


                                {/* Sensors */}

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">

                                    <Sensor
                                        name="Temperature"
                                        value={helmet.temperature}
                                    />

                                    <Sensor
                                        name="Humidity"
                                        value={helmet.humidity}
                                    />

                                    <Sensor
                                        name="Gas"
                                        value={helmet.gas}
                                    />

                                    <Sensor
                                        name="CO"
                                        value={helmet.co}
                                    />

                                    <Sensor
                                        name="CH₄"
                                        value={helmet.ch4}
                                    />

                                    <Sensor
                                        name="O₂"
                                        value={helmet.o2}
                                    />

                                    <Sensor
                                        name="Heart Rate"
                                        value={helmet.heartRate}
                                    />

                                    <Sensor
                                        name="SpO₂"
                                        value={helmet.spo2}
                                    />

                                    <Sensor
                                        name="Battery"
                                        value={helmet.battery}
                                    />

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>


            {/* Recent Alerts */}

            <section>

                <div className="flex items-center justify-between mb-5">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Recent Alerts
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Latest safety incidents
                        </p>
                    </div>


                    <button
                        onClick={() => navigate("/alerts")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        View All →
                    </button>

                </div>


                <div className="space-y-3">

                    {alerts.length === 0 ? (

                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-500">
                            No active alerts.
                        </div>

                    ) : (

                        alerts.slice(0, 5).map((alert) => (

                            <div
                                key={alert._id}
                                className={`bg-white border rounded-xl p-5 flex items-center justify-between shadow-sm ${
                                    alert.severity === "EMERGENCY"
                                        ? "border-red-300"
                                        : alert.severity === "CRITICAL"
                                            ? "border-red-200"
                                            : "border-yellow-200"
                                }`}
                            >

                                <div className="flex items-center gap-4">

                                    <div
                                        className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${
                                            alert.severity === "EMERGENCY"
                                                ? "bg-red-100"
                                                : alert.severity === "CRITICAL"
                                                    ? "bg-red-100"
                                                    : "bg-yellow-100"
                                        }`}
                                    >
                                        {alert.severity === "EMERGENCY"
                                            ? "🚨"
                                            : alert.severity === "CRITICAL"
                                                ? "🔴"
                                                : "⚠️"}
                                    </div>


                                    <div>

                                        <h3 className="font-semibold text-slate-800">
                                            {alert.type.replaceAll("_", " ")}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Helmet {alert.helmetId} — Miner: {alert.minerName}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            {alert.message}
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        alert.severity === "EMERGENCY"
                                            ? "bg-red-100 text-red-700"
                                            : alert.severity === "CRITICAL"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {alert.severity}
                                </span>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </div>
    );
}


/* Sensor Component */

function Sensor({ name, value }) {

    return (
        <div className="bg-slate-50 rounded-lg p-3">

            <p className="text-xs text-slate-500">
                {name}
            </p>

            <p className="text-base font-bold text-slate-800 mt-1">
                {value}
            </p>

        </div>
    );
}


export default Dashboard;
