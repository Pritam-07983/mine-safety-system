import { useEffect, useState } from "react";
import API from "../services/api";

function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            setLoading(true);

            const response = await API.get("/alerts/active");

            setAlerts(response.data);
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const activeAlerts = alerts.filter((alert) => !alert.resolved);

    const criticalCount = activeAlerts.filter(
        (alert) => alert.severity === "CRITICAL"
    ).length;

    const emergencyCount = activeAlerts.filter(
        (alert) => alert.severity === "EMERGENCY"
    ).length;

    const warningCount = activeAlerts.filter(
        (alert) => alert.severity === "WARNING"
    ).length;

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Safety Alerts
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Monitor underground mine safety incidents
                    </p>
                </div>

                <button
                    onClick={fetchAlerts}
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
                >
                    ↻ Refresh
                </button>
            </div>


            {/* Alert Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <AlertStat
                    title="Emergency"
                    value={emergencyCount}
                    description="Immediate response required"
                    icon="🚨"
                    style="red"
                />

                <AlertStat
                    title="Critical"
                    value={criticalCount}
                    description="Critical safety condition"
                    icon="🔴"
                    style="orange"
                />

                <AlertStat
                    title="Warning"
                    value={warningCount}
                    description="Requires attention"
                    icon="⚠️"
                    style="yellow"
                />

            </div>


            {/* Alert List */}
            <section>

                <div className="flex items-center justify-between mb-5">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Active Alerts
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            {activeAlerts.length} unresolved alerts
                        </p>
                    </div>

                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                        Live Monitoring
                    </span>

                </div>


                <div className="space-y-4">

                    {loading ? (

                        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                            <div className="text-3xl mb-3">
                                ⏳
                            </div>

                            <h3 className="font-semibold text-slate-800">
                                Loading Alerts...
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Fetching latest safety alerts from server.
                            </p>

                        </div>

                    ) : activeAlerts.length === 0 ? (

                        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                            <div className="text-4xl mb-3">
                                ✅
                            </div>

                            <h3 className="font-semibold text-slate-800">
                                No Active Alerts
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                No current safety incidents require attention.
                            </p>

                        </div>

                    ) : (

                        activeAlerts.map((alert) => (

                            <AlertCard
                                key={alert._id}
                                alert={alert}
                            />

                        ))

                    )}

                </div>

            </section>


            {/* Alert Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                <div className="flex gap-3">

                    <div className="text-xl">
                        ℹ️
                    </div>

                    <div>
                        <h3 className="font-semibold text-blue-900">
                            Safety Alert System
                        </h3>

                        <p className="text-sm text-blue-700 mt-1">
                            Alerts are generated automatically when monitored
                            sensor values cross the configured demo thresholds.
                            Emergency and critical incidents are handled through
                            the Rescue module.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}


/* Alert Card */

function AlertCard({ alert }) {

    const severityStyles = {
        EMERGENCY: {
            border: "border-red-300",
            bg: "bg-red-50",
            icon: "🚨",
            badge: "bg-red-100 text-red-700",
        },

        CRITICAL: {
            border: "border-orange-300",
            bg: "bg-orange-50",
            icon: "🔴",
            badge: "bg-orange-100 text-orange-700",
        },

        WARNING: {
            border: "border-yellow-300",
            bg: "bg-yellow-50",
            icon: "⚠️",
            badge: "bg-yellow-100 text-yellow-700",
        },
    };

    const style =
        severityStyles[alert.severity] || severityStyles.WARNING;

    const formattedType = alert.type
        ? alert.type.replaceAll("_", " ")
        : "SAFETY ALERT";

    const formattedTime = alert.timestamp
        ? new Date(alert.timestamp).toLocaleString()
        : "Unknown time";

    return (
        <div
            className={`bg-white border ${style.border} rounded-xl p-5 shadow-sm`}
        >

            <div className="flex items-start gap-4">

                {/* Alert Icon */}
                <div
                    className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center text-xl shrink-0`}
                >
                    {style.icon}
                </div>


                {/* Alert Information */}
                <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold text-slate-800">
                            {formattedType}
                        </h3>

                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${style.badge}`}
                        >
                            {alert.severity}
                        </span>

                    </div>


                    <p className="text-sm text-slate-500 mt-1">
                        {alert.message}
                    </p>


                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">

                        <span>
                            Helmet:{" "}
                            <strong className="text-slate-700">
                                {alert.helmetId}
                            </strong>
                        </span>

                        <span>
                            Miner:{" "}
                            <strong className="text-slate-700">
                                {alert.minerName}
                            </strong>
                        </span>

                        <span>
                            Type:{" "}
                            <strong className="text-slate-700">
                                {alert.type}
                            </strong>
                        </span>

                        <span>
                            {formattedTime}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* Statistics Card */

function AlertStat({
    title,
    value,
    description,
    icon,
    style,
}) {

    const styles = {
        red: "bg-red-50 text-red-600",
        orange: "bg-orange-50 text-orange-600",
        yellow: "bg-yellow-50 text-yellow-600",
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                        {value}
                    </h2>

                </div>

                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${styles[style]}`}
                >
                    {icon}
                </div>

            </div>

            <p className="text-xs text-slate-400 mt-3">
                {description}
            </p>

        </div>
    );
}

export default Alerts;