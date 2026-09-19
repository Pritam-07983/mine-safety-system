import { useEffect, useState } from "react";
import API from "../services/api";

function Rescue() {
    const [rescueActive, setRescueActive] = useState(false);
    const [selectedMiner, setSelectedMiner] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("Team Alpha");
    const [selectedPriority, setSelectedPriority] = useState("Emergency");

    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHelmetId, setSelectedHelmetId] = useState(null);

    const fetchEmergencies = async () => {
        try {
            setLoading(true);

            const response = await API.get("/alerts/active");

            // Only serious alerts are shown in Rescue Operations
            const emergencyAlerts = response.data.filter(
                (alert) =>
                    alert.severity === "CRITICAL" ||
                    alert.severity === "EMERGENCY"
            );

            setEmergencies(emergencyAlerts);

            // Select first miner automatically
            if (emergencyAlerts.length > 0) {
                setSelectedMiner(emergencyAlerts[0].minerName);
            } else {
                setSelectedMiner("");
            }

        } catch (error) {
            console.error(
                "Failed to fetch rescue emergencies:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const startRescue = () => {
        if (!selectedMiner) {
            alert("Please select a miner first.");
            return;
        }

        const selectedEmergency = emergencies.find(
            (emergency) => emergency.minerName === selectedMiner
        );

        if (!selectedEmergency) {
            alert("No active emergency found for this miner.");
            return;
        }

        setSelectedHelmetId(selectedEmergency.helmetId);
        setRescueActive(true);
    };

    const handleEmergencyRescue = (emergency) => {
        setSelectedMiner(emergency.minerName);
        setSelectedHelmetId(emergency.helmetId);

        setSelectedPriority(
            emergency.severity === "EMERGENCY"
                ? "Emergency"
                : "Critical"
        );

        setRescueActive(true);
    };

const endRescue = async () => {
    try {
        if (!selectedHelmetId) {
            alert("No helmet selected for rescue.");
            return;
        }

        console.log(
            "Resolving alerts for helmet:",
            selectedHelmetId
        );

        const response = await API.patch(
            `/alerts/helmet/${selectedHelmetId}/resolve`
        );

        console.log("Resolve response:", response.data);

        setRescueActive(false);
        setSelectedHelmetId(null);
        setSelectedMiner("");

        await fetchEmergencies();

        alert(
            "Rescue completed. All alerts for this helmet are resolved."
        );

    } catch (error) {
        console.error(
            "Failed to complete rescue:",
            error
        );

        console.error(
            "Backend response:",
            error.response?.data
        );

        alert(
            error.response?.data?.message ||
            "Failed to complete rescue operation"
        );
    }
};

    const formatTime = (timestamp) => {
        if (!timestamp) return "Unknown";

        const date = new Date(timestamp);

        if (isNaN(date.getTime())) {
            return "Unknown";
        }

        return date.toLocaleString();
    };


    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Rescue Operations
                </h1>

                <p className="text-slate-500 mt-1">
                    Emergency response and miner rescue management
                </p>
            </div>


            {/* Emergency Status */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                            🚨
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-red-800">
                                Emergency Response Center
                            </h2>

                            <p className="text-sm text-red-600 mt-1">
                                {emergencies.length} serious emergency{" "}
                                {emergencies.length === 1
                                    ? "situation"
                                    : "situations"}{" "}
                                detected
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                        Emergency Monitoring Active
                    </div>

                </div>

            </div>


            {/* Rescue Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <StatCard
                    title="Active Emergencies"
                    value={emergencies.length}
                    icon="🚨"
                    color="red"
                />

                <StatCard
                    title="Miners at Risk"
                    value={
                        new Set(
                            emergencies.map(
                                (emergency) => emergency.helmetId
                            )
                        ).size
                    }
                    icon="👷"
                    color="orange"
                />

                <StatCard
                    title="Rescue Teams"
                    value="3"
                    icon="🛟"
                    color="blue"
                />

            </div>


            {/* Emergency Cases */}
            <section>

                <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Active Emergency Cases
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Immediate attention required
                        </p>
                    </div>

                    <button
                        onClick={fetchEmergencies}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                        ↻ Refresh
                    </button>

                </div>


                {loading ? (

                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                        <p className="text-slate-500">
                            Loading emergency cases...
                        </p>
                    </div>

                ) : emergencies.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                        <div className="text-4xl mb-3">
                            ✅
                        </div>

                        <p className="font-semibold text-slate-700">
                            No active emergency cases
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                            All miners are currently outside the critical
                            emergency state.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {emergencies.map((emergency) => (

                            <div
                                key={emergency._id}
                                className="bg-white border border-red-200 rounded-xl p-5 shadow-sm"
                            >

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                    {/* Emergency Info */}
                                    <div className="flex items-start gap-4">

                                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-xl">
                                            🚨
                                        </div>

                                        <div>

                                            <div className="flex flex-wrap items-center gap-2">

                                                <h3 className="font-bold text-slate-800">
                                                    {emergency.minerName ||
                                                        "Unknown Miner"}
                                                </h3>

                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        emergency.severity ===
                                                        "EMERGENCY"
                                                            ? "bg-red-600 text-white"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {emergency.severity}
                                                </span>

                                            </div>

                                            <div className="mt-2 space-y-1">

                                                <p className="text-sm text-slate-600">
                                                    Helmet:{" "}
                                                    <strong>
                                                        {emergency.helmetId}
                                                    </strong>
                                                </p>

                                                <p className="text-sm text-red-600 font-medium">
                                                    Issue:{" "}
                                                    {emergency.message}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    Detected:{" "}
                                                    {formatTime(
                                                        emergency.timestamp
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Action */}
                                    <button
                                        onClick={() =>
                                            handleEmergencyRescue(emergency)
                                        }
                                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                    >
                                        🚨 Start Rescue
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* Rescue Control Panel */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm">

                <div className="p-6 border-b border-slate-100">

                    <h2 className="text-xl font-bold text-slate-800">
                        Rescue Control Panel
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Coordinate emergency response teams
                    </p>

                </div>


                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left */}
                    <div className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select Miner
                            </label>

                            <select
                                value={selectedMiner}
                                onChange={(e) =>
                                    setSelectedMiner(e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                {emergencies.length === 0 ? (
                                    <option value="">
                                        No miner available
                                    </option>
                                ) : (
                                    emergencies.map((emergency) => (
                                        <option
                                            key={emergency._id}
                                            value={emergency.minerName}
                                        >
                                            {emergency.minerName} —{" "}
                                            {emergency.helmetId}
                                        </option>
                                    ))
                                )}

                            </select>

                        </div>


                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Rescue Team
                            </label>

                            <select
                                value={selectedTeam}
                                onChange={(e) =>
                                    setSelectedTeam(e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Team Alpha">
                                    Team Alpha
                                </option>

                                <option value="Team Bravo">
                                    Team Bravo
                                </option>

                                <option value="Team Charlie">
                                    Team Charlie
                                </option>
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Rescue Priority
                            </label>

                            <select
                                value={selectedPriority}
                                onChange={(e) =>
                                    setSelectedPriority(e.target.value)
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Emergency">
                                    Emergency
                                </option>

                                <option value="Critical">
                                    Critical
                                </option>

                                <option value="High">
                                    High
                                </option>
                            </select>
                        </div>


                        <button
                            onClick={startRescue}
                            disabled={!selectedMiner}
                            className={`w-full py-3 rounded-lg font-semibold transition ${
                                selectedMiner
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                            }`}
                        >
                            🚨 Dispatch Rescue Team
                        </button>

                    </div>


                    {/* Right */}
                    <div className="bg-slate-50 rounded-xl p-5">

                        <h3 className="font-bold text-slate-800 mb-5">
                            Rescue Operation Status
                        </h3>

                        {!rescueActive ? (

                            <div className="text-center py-10">

                                <div className="text-4xl mb-3">
                                    🛟
                                </div>

                                <p className="font-semibold text-slate-700">
                                    No rescue operation started
                                </p>

                                <p className="text-sm text-slate-500 mt-1">
                                    Select an emergency and dispatch a rescue
                                    team.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                <div className="flex items-center gap-3">

                                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>

                                    <span className="font-semibold text-red-600">
                                        Rescue Operation Active
                                    </span>

                                </div>


                                <Info
                                    label="Miner"
                                    value={selectedMiner}
                                />

                                <Info
                                    label="Rescue Team"
                                    value={selectedTeam}
                                />

                                <Info
                                    label="Status"
                                    value="Team Dispatched"
                                />

                                <Info
                                    label="Priority"
                                    value={selectedPriority}
                                />

                                <Info
                                    label="Estimated Response"
                                    value="5–10 minutes"
                                />


                                <button
                                    onClick={endRescue}
                                    className="w-full border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition"
                                >
                                    ✓ Complete Rescue Operation
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* Rescue Procedure */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                <h2 className="text-xl font-bold text-slate-800 mb-6">
                    Emergency Response Procedure
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                    <Step
                        number="01"
                        title="Detect"
                        description="Sensors detect a dangerous condition."
                        icon="📡"
                    />

                    <Step
                        number="02"
                        title="Alert"
                        description="Control center receives an emergency alert."
                        icon="🚨"
                    />

                    <Step
                        number="03"
                        title="Dispatch"
                        description="Rescue team is assigned to the incident."
                        icon="🛟"
                    />

                    <Step
                        number="04"
                        title="Rescue"
                        description="Team reaches the miner and performs rescue."
                        icon="👷"
                    />

                </div>

            </section>

        </div>
    );
}


/* Statistics Card */

function StatCard({ title, value, icon, color }) {

    const styles = {
        red: "bg-red-50 text-red-600",
        orange: "bg-orange-50 text-orange-600",
        blue: "bg-blue-50 text-blue-600",
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
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${styles[color]}`}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}


/* Info Row */

function Info({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">

            <span className="text-sm text-slate-500">
                {label}
            </span>

            <span className="text-sm font-semibold text-slate-800">
                {value}
            </span>

        </div>
    );
}


/* Procedure Step */

function Step({ number, title, description, icon }) {
    return (
        <div className="bg-slate-50 rounded-xl p-5">

            <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-blue-600">
                    STEP {number}
                </span>

                <span className="text-xl">
                    {icon}
                </span>

            </div>

            <h3 className="font-bold text-slate-800 mt-4">
                {title}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
                {description}
            </p>

        </div>
    );
}

export default Rescue;