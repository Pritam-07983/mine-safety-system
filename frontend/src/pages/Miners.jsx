import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Miners() {
    const navigate = useNavigate();

    const [helmets, setHelmets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        minerName: "",
        helmetId: "",
        battery: 100
    });

    const [submitting, setSubmitting] = useState(false);

    // Fetch all miners / helmets
    const fetchMiners = async () => {
        try {
            setLoading(true);

            const response = await API.get("/helmets");

            setHelmets(response.data);
        } catch (error) {
            console.error("Failed to fetch miners:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load miners"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMiners();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Register miner + assign helmet
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.minerName.trim()) {
            alert("Please enter miner name.");
            return;
        }

        if (!formData.helmetId.trim()) {
            alert("Please enter helmet ID.");
            return;
        }

        // Prevent duplicate helmet assignment
        const alreadyExists = helmets.some(
            (helmet) =>
                helmet.helmetId.toLowerCase() ===
                formData.helmetId.trim().toLowerCase()
        );

        if (alreadyExists) {
            alert(
                `Helmet ${formData.helmetId} is already assigned.`
            );
            return;
        }

        try {
            setSubmitting(true);

            await API.post("/helmets", {
                minerName: formData.minerName.trim(),
                helmetId: formData.helmetId.trim(),
                battery: Number(formData.battery),
                status: "OFFLINE"
            });

            alert("Miner added and helmet assigned successfully!");

            // Reset form
            setFormData({
                minerName: "",
                helmetId: "",
                battery: 100
            });

            setShowForm(false);

            // Refresh list
            await fetchMiners();

        } catch (error) {
            console.error("Failed to add miner:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add miner"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "SAFE":
                return "bg-green-100 text-green-700";

            case "WARNING":
                return "bg-yellow-100 text-yellow-700";

            case "CRITICAL":
                return "bg-red-100 text-red-700";

            case "OFFLINE":
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const formatLastSeen = (date) => {
        if (!date) return "Never";

        return new Date(date).toLocaleString();
    };

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Miner Management
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage miners and assign safety helmets
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition"
                >
                    {showForm ? "✕ Close" : "+ Add Miner"}
                </button>

            </div>


            {/* Add Miner Form */}
            {showForm && (
                <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            Add New Miner
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Assign a safety helmet to a new miner.
                        </p>
                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-5"
                    >

                        {/* Miner Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Miner Name
                            </label>

                            <input
                                type="text"
                                name="minerName"
                                value={formData.minerName}
                                onChange={handleChange}
                                placeholder="Enter miner name"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                            />
                        </div>


                        {/* Helmet ID */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Helmet ID
                            </label>

                            <input
                                type="text"
                                name="helmetId"
                                value={formData.helmetId}
                                onChange={handleChange}
                                placeholder="Example: HM005"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                            />
                        </div>


                        {/* Battery */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Initial Battery
                            </label>

                            <input
                                type="number"
                                name="battery"
                                value={formData.battery}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                            />
                        </div>


                        {/* Submit */}
                        <div className="md:col-span-3 flex justify-end">

                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {submitting
                                    ? "Adding..."
                                    : "✓ Add Miner & Assign Helmet"}
                            </button>

                        </div>

                    </form>

                </section>
            )}


            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <StatCard
                    title="Total Miners"
                    value={helmets.length}
                    icon="👷"
                />

                <StatCard
                    title="Safe"
                    value={
                        helmets.filter(
                            (helmet) => helmet.status === "SAFE"
                        ).length
                    }
                    icon="🟢"
                />

                <StatCard
                    title="Warning"
                    value={
                        helmets.filter(
                            (helmet) => helmet.status === "WARNING"
                        ).length
                    }
                    icon="🟡"
                />

                <StatCard
                    title="Critical"
                    value={
                        helmets.filter(
                            (helmet) => helmet.status === "CRITICAL"
                        ).length
                    }
                    icon="🔴"
                />

            </div>


            {/* Miner List */}
            <section>

                <div className="flex items-center justify-between mb-5">

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Registered Miners
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Miners currently registered with safety helmets
                        </p>
                    </div>

                    <button
                        onClick={fetchMiners}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
                    >
                        ↻ Refresh
                    </button>

                </div>


                {loading ? (

                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                        <div className="text-3xl mb-3">⏳</div>

                        <h3 className="font-semibold text-slate-800">
                            Loading Miners...
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            Fetching registered miners from server.
                        </p>
                    </div>

                ) : helmets.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                        <div className="text-4xl mb-3">
                            👷
                        </div>

                        <h3 className="font-semibold text-slate-800">
                            No Miners Registered
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            Add a miner and assign a helmet to start monitoring.
                        </p>

                    </div>

                ) : (

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="bg-slate-50 border-b border-slate-200">

                                    <tr>
                                        <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                            Helmet ID
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                            Miner
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                            Status
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                            Battery
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold text-slate-600">
                                            Last Seen
                                        </th>

                                        <th className="text-right px-6 py-4 font-semibold text-slate-600">
                                            Action
                                        </th>
                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {helmets.map((helmet) => (

                                        <tr
                                            key={helmet._id}
                                            className="hover:bg-slate-50 transition"
                                        >

                                            <td className="px-6 py-4">

                                                <span className="font-bold text-slate-800">
                                                    {helmet.helmetId}
                                                </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                                                        👷
                                                    </div>

                                                    <span className="font-medium text-slate-700">
                                                        {helmet.minerName}
                                                    </span>

                                                </div>

                                            </td>


                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                                                        helmet.status
                                                    )}`}
                                                >
                                                    {helmet.status === "OFFLINE"
                                                        ? "⚫ OFFLINE"
                                                        : `🟢 ACTIVE • ${helmet.status}`}
                                                </span>


                                            </td>


                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2">

                                                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">

                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{
                                                                width: `${helmet.battery}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <span className="text-slate-600">
                                                        {helmet.battery}%
                                                    </span>

                                                </div>

                                            </td>


                                            <td className="px-6 py-4 text-slate-500">
                                                {formatLastSeen(
                                                    helmet.lastSeen
                                                )}
                                            </td>


                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/helmets/${helmet.helmetId}`
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
                                                >
                                                    View Details
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </section>


            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                <div className="flex gap-3">

                    <div className="text-xl">
                        ℹ️
                    </div>

                    <div>

                        <h3 className="font-semibold text-blue-900">
                            Miner & Helmet Assignment
                        </h3>

                        <p className="text-sm text-blue-700 mt-1">
                            Each miner is identified by the helmet assigned
                            to them. Sensor data received from that helmet
                            is automatically associated with the assigned
                            miner.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


function StatCard({ title, value, icon }) {
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

                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    {icon}
                </div>

            </div>

        </div>
    );
}


export default Miners;