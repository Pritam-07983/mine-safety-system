import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Helmets() {
    const navigate = useNavigate();

    const [helmets, setHelmets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHelmets = async () => {
        try {
            setLoading(true);

            const response = await API.get("/helmets");

            const helmetList = response.data;

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
                        temperature: sensor
                            ? `${sensor.temperature}°C`
                            : "--",
                        co: sensor
                            ? `${sensor.co} ppm`
                            : "--",
                        ch4: sensor
                            ? `${sensor.ch4}%`
                            : "--",
                        o2: sensor
                            ? `${sensor.o2}%`
                            : "--",
                        heartRate: sensor
                            ? `${sensor.heartRate} BPM`
                            : "--",
                        spo2: sensor
                            ? `${sensor.spo2}%`
                            : "--",
                        battery: `${helmet.battery}%`,
                    };
                })
            );

            setHelmets(updatedHelmets);

        } catch (error) {
            console.error("Failed to fetch helmets:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchHelmets();
    }, []);


    const total = helmets.length;

    const safe = helmets.filter(
        (helmet) => helmet.status === "SAFE"
    ).length;

    const warning = helmets.filter(
        (helmet) => helmet.status === "WARNING"
    ).length;

    const critical = helmets.filter(
        (helmet) => helmet.status === "CRITICAL"
    ).length;


    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Helmet Monitoring
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Monitor all connected smart helmets
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <button
                        onClick={fetchHelmets}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition"
                    >
                        ↻ Refresh
                    </button>

                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                        {total} Helmets
                    </div>

                </div>

            </div>


            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                <Stat
                    title="Total"
                    value={total}
                    text="Registered"
                    icon="⛑️"
                />

                <Stat
                    title="Safe"
                    value={safe}
                    text="Normal"
                    icon="🟢"
                />

                <Stat
                    title="Warning"
                    value={warning}
                    text="Attention"
                    icon="🟡"
                />

                <Stat
                    title="Critical"
                    value={critical}
                    text="Immediate action"
                    icon="🔴"
                />

            </div>


            {/* Helmet Cards */}

            {loading ? (

                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                    <div className="text-3xl mb-3">
                        ⏳
                    </div>

                    <h3 className="font-semibold text-slate-800">
                        Loading Helmets...
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        Fetching helmet and sensor data.
                    </p>

                </div>

            ) : helmets.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                    <div className="text-4xl mb-3">
                        ⛑️
                    </div>

                    <h3 className="font-semibold text-slate-800">
                        No Helmets Found
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        No registered helmets are available.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {helmets.map((helmet) => (

                        <div
                            key={helmet.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                        >

                            {/* Card Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                                        ⛑️
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">
                                            {helmet.id}
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Miner: {helmet.miner}
                                        </p>
                                    </div>

                                </div>

                                <StatusBadge status={helmet.status} />

                            </div>


                            {/* Sensor Data */}
                            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">

                                <Sensor
                                    label="Temperature"
                                    value={helmet.temperature}
                                />

                                <Sensor
                                    label="CO"
                                    value={helmet.co}
                                />

                                <Sensor
                                    label="CH₄"
                                    value={helmet.ch4}
                                />

                                <Sensor
                                    label="O₂"
                                    value={helmet.o2}
                                />

                                <Sensor
                                    label="Heart Rate"
                                    value={helmet.heartRate}
                                />

                                <Sensor
                                    label="SpO₂"
                                    value={helmet.spo2}
                                />

                            </div>


                            {/* Footer */}
                            <div className="px-5 pb-5 flex items-center justify-between">

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Battery
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700">
                                        🔋 {helmet.battery}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate(`/helmets/${helmet.id}`)
                                    }
                                    className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition"
                                >
                                    View Details →
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}


/* Statistics */

function Stat({ title, value, text, icon }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                    {title}
                </p>

                <span className="text-xl">
                    {icon}
                </span>

            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {value}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
                {text}
            </p>

        </div>
    );
}


/* Sensor */

function Sensor({ label, value }) {
    return (
        <div className="bg-slate-50 rounded-lg p-3">

            <p className="text-xs text-slate-500">
                {label}
            </p>

            <p className="text-sm font-bold text-slate-800 mt-1">
                {value}
            </p>

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

export default Helmets;
