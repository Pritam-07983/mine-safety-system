import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function HelmetDetails() {
    const navigate = useNavigate();
    const { helmetId } = useParams();

    const [helmet, setHelmet] = useState(null);
    const [sensor, setSensor] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchHelmetDetails = async () => {
        try {
            setLoading(true);

            const [helmetResponse, sensorResponse] = await Promise.all([
                API.get(`/helmets/${helmetId}`),
                API.get(`/sensors/${helmetId}`)
            ]);

            setHelmet(helmetResponse.data);

            if (sensorResponse.data.length > 0) {
                setSensor(sensorResponse.data[0]);
            } else {
                setSensor(null);
            }

        } catch (error) {
            console.error("Failed to fetch helmet details:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHelmetDetails();
    }, [helmetId]);


    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                <div className="text-3xl mb-3">
                    ⏳
                </div>

                <h3 className="font-semibold text-slate-800">
                    Loading Helmet Details...
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                    Fetching latest helmet and sensor data.
                </p>

            </div>
        );
    }


    if (!helmet) {
        return (
            <div className="space-y-6">

                <button
                    onClick={() => navigate("/helmets")}
                    className="text-sm text-slate-500 hover:text-blue-600 transition"
                >
                    ← Back to Helmets
                </button>

                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                    <div className="text-4xl mb-3">
                        ❌
                    </div>

                    <h3 className="font-semibold text-slate-800">
                        Helmet Not Found
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        No helmet found with ID {helmetId}.
                    </p>

                </div>

            </div>
        );
    }


    const status = helmet.status;

    const temperature = sensor
        ? `${sensor.temperature}°C`
        : "--";

    const humidity = sensor
        ? `${sensor.humidity}%`
        : "--";

    const gas = sensor
        ? sensor.gas
        : null;

    const flameDetected = sensor
        ? sensor.flameDetected
            ? "🔥 Detected"
            : "✓ Not Detected"
        : "--";

    const co = sensor
        ? `${sensor.co} ppm`
        : "--";

    const ch4 = sensor
        ? `${sensor.ch4}%`
        : "--";

    const o2 = sensor
        ? `${sensor.o2}%`
        : "--";

    const heartRate = sensor
        ? `${sensor.heartRate} BPM`
        : "--";

    const spo2 = sensor
        ? `${sensor.spo2}%`
        : "--";

    const battery = `${helmet.battery}%`;

    const lastUpdate = sensor?.timestamp
        ? new Date(sensor.timestamp).toLocaleString()
        : helmet.lastSeen
            ? new Date(helmet.lastSeen).toLocaleString()
            : "No data";


    /* Safety status */

    const gasStatus =
        !sensor
            ? "No Data"
            : gas > 80
                ? "Critical"
                : gas > 50
                    ? "Attention"
                    : "Normal";

    const humidityStatus =
        !sensor
            ? "No Data"
            : sensor.humidity > 90
                ? "Critical"
                : sensor.humidity > 80
                    ? "Attention"
                    : "Normal";

    const temperatureStatus =
        !sensor
            ? "No Data"
            : sensor.temperature > 55
                ? "Critical"
                : sensor.temperature > 45
                    ? "Attention"
                    : "Normal";

    const oxygenStatus =
        !sensor
            ? "No Data"
            : sensor.o2 < 18
                ? "Critical"
                : sensor.o2 < 19.5
                    ? "Attention"
                    : "Normal";

    const fallStatus =
        !sensor
            ? "No Data"
            : sensor.fallDetected
                ? "Fall Detected"
                : "No Fall Detected";


    return (
        <div className="space-y-8">

            {/* Back Button */}
            <div className="flex items-center justify-between">

                <button
                    onClick={() => navigate("/helmets")}
                    className="text-sm text-slate-500 hover:text-blue-600 transition"
                >
                    ← Back to Helmets
                </button>

                <button
                    onClick={fetchHelmetDetails}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
                >
                    ↻ Refresh
                </button>

            </div>


            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <div className="flex items-center gap-3">

                        <h1 className="text-3xl font-bold text-slate-800">
                            {helmet.helmetId}
                        </h1>

                        <StatusBadge status={status} />

                    </div>

                    <p className="text-slate-500 mt-2">
                        Miner:{" "}
                        <span className="font-medium text-slate-700">
                            {helmet.minerName}
                        </span>
                    </p>

                </div>


                <div className="flex gap-3">

                    <button
                        onClick={() => navigate("/alerts")}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                    >
                        View Alerts
                    </button>

                    <button
                        onClick={() => navigate("/rescue")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                    >
                        🚨 Rescue
                    </button>

                </div>

            </div>


            {/* Safety Status */}
            <div
                className={`rounded-xl p-6 border ${
                    status === "SAFE"
                        ? "bg-green-50 border-green-200"
                        : status === "WARNING"
                            ? "bg-yellow-50 border-yellow-200"
                            : status === "CRITICAL"
                                ? "bg-red-50 border-red-200"
                                : "bg-slate-50 border-slate-200"
                }`}
            >

                <div className="flex items-center gap-4">

                    <div className="text-4xl">
                        {status === "SAFE"
                            ? "🟢"
                            : status === "WARNING"
                                ? "🟡"
                                : status === "CRITICAL"
                                    ? "🔴"
                                    : "⚪"}
                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">
                            Helmet Status: {status}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            {status === "SAFE"
                                ? "All monitored parameters are currently within the configured demo thresholds."
                                : status === "WARNING"
                                    ? "One or more monitored parameters require attention."
                                    : status === "CRITICAL"
                                        ? "Critical safety conditions have been detected."
                                        : "Helmet is currently offline or has no recent sensor data."}

                        </p>

                    </div>

                </div>

            </div>


            {/* Sensor Monitoring */}
            <section>

                <div className="mb-5">

                    <h2 className="text-xl font-bold text-slate-800">
                        Live Sensor Monitoring
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Current readings from {helmet.helmetId}
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <SensorCard
                        icon="🌡️"
                        name="Temperature"
                        value={temperature}
                    />

                    <SensorCard
                        icon="💧"
                        name="Humidity"
                        value={humidity}
                    />

                    <SensorCard
                        icon="🔥"
                        name="Flame Detection"
                        value={flameDetected}
                    />

                    <SensorCard
                        icon="☁️"
                        name="Carbon Monoxide"
                        value={co}
                    />

                    <SensorCard
                        icon="🔥"
                        name="Methane (CH₄)"
                        value={ch4}
                    />

                    <SensorCard
                        icon="🫁"
                        name="Oxygen (O₂)"
                        value={o2}
                    />

                    <SensorCard
                        icon="❤️"
                        name="Heart Rate"
                        value={heartRate}
                    />

                    <SensorCard
                        icon="🩸"
                        name="SpO₂"
                        value={spo2}
                    />

                    <SensorCard
                        icon="🔋"
                        name="Battery"
                        value={battery}
                    />

                </div>

            </section>


            {/* Safety Information */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Helmet Information */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <h2 className="text-lg font-bold text-slate-800 mb-5">
                        Helmet Information
                    </h2>

                    <div className="space-y-4">

                        <InfoRow
                            label="Helmet ID"
                            value={helmet.helmetId}
                        />

                        <InfoRow
                            label="Assigned Miner"
                            value={helmet.minerName}
                        />

                        <InfoRow
                            label="Current Status"
                            value={helmet.status}
                        />

                        <InfoRow
                            label="Battery Level"
                            value={battery}
                        />

                        <InfoRow
                            label="Connection"
                            value={
                                helmet.status === "OFFLINE"
                                    ? "Offline"
                                    : "Connected"
                            }
                        />

                        <InfoRow
                            label="Last Update"
                            value={lastUpdate}
                        />

                    </div>

                </div>


                {/* Safety Checklist */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <h2 className="text-lg font-bold text-slate-800 mb-5">
                        Safety Monitoring
                    </h2>

                    <div className="space-y-4">

                        <CheckItem
                            label="Gas Level Monitoring"
                            status={gasStatus}
                        />

                        <CheckItem
                            label="Oxygen Level"
                            status={oxygenStatus}
                        />

                        <CheckItem
                            label="Temperature"
                            status={temperatureStatus}
                        />

                        <CheckItem
                            label="Humidity"
                            status={humidityStatus}
                        />

                        <CheckItem
                            label="Fall Detection"
                            status={fallStatus}
                        />

                    </div>

                </div>

            </section>

        </div>
    );
}


/* Sensor Card */

function SensorCard({ icon, name, value }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

                <span className="text-2xl">
                    {icon}
                </span>

                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>

            </div>

            <p className="text-sm text-slate-500 mt-4">
                {name}
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {value}
            </h3>

        </div>
    );
}


/* Status Badge */

function StatusBadge({ status }) {

    const styles = {
        SAFE: "bg-green-100 text-green-700",
        WARNING: "bg-yellow-100 text-yellow-700",
        CRITICAL: "bg-red-100 text-red-700",
        OFFLINE: "bg-slate-100 text-slate-500",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
                styles[status] || styles.OFFLINE
            }`}
        >
            {status}
        </span>
    );
}


/* Information Row */

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">

            <span className="text-sm text-slate-500">
                {label}
            </span>

            <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%]">
                {value}
            </span>

        </div>
    );
}


/* Checklist Item */

function CheckItem({ label, status }) {

    const isNormal = status === "Normal";

    const isNoData = status === "No Data";

    return (
        <div className="flex items-center justify-between">

            <span className="text-sm text-slate-600">
                {label}
            </span>

            <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isNormal
                        ? "bg-green-100 text-green-700"
                        : isNoData
                            ? "bg-slate-100 text-slate-500"
                            : "bg-yellow-100 text-yellow-700"
                }`}
            >
                {isNormal
                    ? "✓ "
                    : isNoData
                        ? "— "
                        : "⚠ "}

                {status}
            </span>

        </div>
    );
}

export default HelmetDetails;