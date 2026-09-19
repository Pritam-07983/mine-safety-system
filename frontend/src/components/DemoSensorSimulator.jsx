import { useEffect, useState } from "react";
import API from "../services/api";

function DemoSensorSimulator() {

    // =========================
    // Helmet List
    // =========================

    const [helmets, setHelmets] = useState([]);
    const [loadingHelmets, setLoadingHelmets] = useState(true);

    const [helmetId, setHelmetId] = useState("");

    // =========================
    // Mode
    // =========================

    const [mode, setMode] = useState("scenario");

    const [scenario, setScenario] = useState("normal");

    // =========================
    // Scenario Data
    // =========================

    const scenarios = {

        normal: {
            gas: 20,
            flameDetected: false,
            humidity: 60,
            temperature: 30,
            co: 20,
            ch4: 0.5,
            o2: 20.5,
            heartRate: 75,
            spo2: 98,
            fallDetected: false
        },

        gasLeak: {
            gas: 85,
            flameDetected: false,
            humidity: 65,
            temperature: 30,
            co: 20,
            ch4: 0.5,
            o2: 20.5,
            heartRate: 75,
            spo2: 98,
            fallDetected: false
        },

        flameDetected: {
            gas: 30,
            flameDetected: true,
            humidity: 62,
            temperature: 30,
            co: 20,
            ch4: 0.5,
            o2: 20.5,
            heartRate: 75,
            spo2: 98,
            fallDetected: false
        },

        highHumidity: {
            gas: 25,
            flameDetected: false,
            humidity: 92,
            temperature: 30,
            co: 20,
            ch4: 0.5,
            o2: 20.5,
            heartRate: 75,
            spo2: 98,
            fallDetected: false
        },

        emergency: {
            gas: 95,
            flameDetected: true,
            humidity: 90,
            temperature: 30,
            co: 20,
            ch4: 0.5,
            o2: 20.5,
            heartRate: 75,
            spo2: 98,
            fallDetected: false
        }
    };


    // =========================
    // Manual Sensor Data
    // =========================

    const [manualData, setManualData] = useState({
        gas: 20,
        flameDetected: false,
        humidity: 60,
        temperature: 30,
        co: 20,
        ch4: 0.5,
        o2: 20.5,
        heartRate: 75,
        spo2: 98,
        fallDetected: false
    });


    // =========================
    // Fetch Helmets
    // =========================

    const fetchHelmets = async () => {

        try {

            setLoadingHelmets(true);

            const response = await API.get("/helmets");

            setHelmets(response.data);

            // Automatically select first helmet
            if (
                response.data.length > 0 &&
                !helmetId
            ) {
                setHelmetId(response.data[0].helmetId);
            }

        } catch (error) {

            console.error(
                "Failed to fetch helmets:",
                error
            );

        } finally {

            setLoadingHelmets(false);
        }
    };


    useEffect(() => {

        fetchHelmets();

    }, []);


    // =========================
    // Manual Input Handler
    // =========================

    const handleManualChange = (e) => {

        const { name, value, type, checked } = e.target;

        setManualData((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    // =========================
    // Current Sensor Data
    // =========================

    const currentData =
        mode === "scenario"
            ? scenarios[scenario]
            : {
                gas: Number(manualData.gas),
                flameDetected: manualData.flameDetected,
                humidity: Number(manualData.humidity),
                temperature: Number(manualData.temperature),
                co: Number(manualData.co),
                ch4: Number(manualData.ch4),
                o2: Number(manualData.o2),
                heartRate: Number(manualData.heartRate),
                spo2: Number(manualData.spo2),
                fallDetected: manualData.fallDetected
            };


    // =========================
    // Send Sensor Data
    // =========================

    const handleSimulate = async () => {

        if (!helmetId) {

            alert("Please select a helmet first.");

            return;
        }

        try {

            const response = await API.post(
                "/sensors",
                {
                    helmetId,
                    ...currentData
                }
            );

            console.log(response.data);

            alert(
                `Sensor data sent successfully!\n\nHelmet: ${helmetId}\nStatus: ${response.data.helmetStatus}`
            );

            // Refresh helmet status
            await fetchHelmets();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to send sensor data"
            );
        }
    };


    // =========================
    // Reset Manual Data
    // =========================

    const resetManualData = () => {

        setManualData({
            gas: 20,
            flameDetected: false,
            humidity: 60,
            temperature: 30,
            co: 20,
            ch4: 0.5,
            o2: 20.5,
            heartRate: 75,
            spo2: 98,
            fallDetected: false
        });
    };


    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            {/* ================= HEADER ================= */}

            <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-800">
                    Demo Sensor Simulator
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    Simulate underground helmet sensor data
                </p>

            </div>


            {/* ================= HELMET + MODE ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Helmet */}

                <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Helmet
                    </label>

                    <select
                        value={helmetId}
                        onChange={(e) =>
                            setHelmetId(e.target.value)
                        }
                        disabled={loadingHelmets}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    >

                        {loadingHelmets ? (

                            <option>
                                Loading helmets...
                            </option>

                        ) : helmets.length === 0 ? (

                            <option>
                                No helmets registered
                            </option>

                        ) : (

                            helmets.map((helmet) => (

                                <option
                                    key={helmet._id}
                                    value={helmet.helmetId}
                                >
                                    {helmet.helmetId} - {helmet.minerName}
                                </option>

                            ))

                        )}

                    </select>

                </div>


                {/* Mode */}

                <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Simulation Mode
                    </label>

                    <select
                        value={mode}
                        onChange={(e) =>
                            setMode(e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="scenario">
                            🎯 Preset Scenario
                        </option>

                        <option value="manual">
                            ✏️ Manual Sensor Data
                        </option>

                    </select>

                </div>

            </div>


            {/* ================= SCENARIO MODE ================= */}

            {mode === "scenario" && (

                <div className="mt-6">

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Scenario
                    </label>

                    <select
                        value={scenario}
                        onChange={(e) =>
                            setScenario(e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="normal">
                            🟢 Normal
                        </option>

                        <option value="gasLeak">
                            🟠 Gas Leak
                        </option>

                        <option value="flameDetected">
                            🔥 Flame Detected
                        </option>

                        <option value="highHumidity">
                            💧 High Humidity
                        </option>

                        <option value="emergency">
                            🚨 Emergency
                        </option>

                    </select>

                </div>

            )}


            {/* ================= MANUAL MODE ================= */}

            {mode === "manual" && (

                <div className="mt-6">

                    <div className="flex items-center justify-between mb-4">

                        <div>

                            <h3 className="text-sm font-semibold text-slate-700">
                                Manual Sensor Values
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                Enter custom sensor readings for testing.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={resetManualData}
                            className="text-sm px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                        >
                            Reset
                        </button>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Gas */}

                        <InputField
                            label="Gas Level"
                            name="gas"
                            value={manualData.gas}
                            onChange={handleManualChange}
                            unit="ppm"
                        />


                        {/* Humidity */}

                        <InputField
                            label="Humidity"
                            name="humidity"
                            value={manualData.humidity}
                            onChange={handleManualChange}
                            unit="%"
                        />


                        {/* Temperature */}

                        <InputField
                            label="Temperature"
                            name="temperature"
                            value={manualData.temperature}
                            onChange={handleManualChange}
                            unit="°C"
                        />


                        {/* CO */}

                        <InputField
                            label="CO"
                            name="co"
                            value={manualData.co}
                            onChange={handleManualChange}
                            unit="ppm"
                        />


                        {/* CH4 */}

                        <InputField
                            label="CH4"
                            name="ch4"
                            value={manualData.ch4}
                            onChange={handleManualChange}
                            unit="%"
                            step="0.1"
                        />


                        {/* O2 */}

                        <InputField
                            label="O2"
                            name="o2"
                            value={manualData.o2}
                            onChange={handleManualChange}
                            unit="%"
                            step="0.1"
                        />


                        {/* Heart Rate */}

                        <InputField
                            label="Heart Rate"
                            name="heartRate"
                            value={manualData.heartRate}
                            onChange={handleManualChange}
                            unit="BPM"
                        />


                        {/* SpO2 */}

                        <InputField
                            label="SpO2"
                            name="spo2"
                            value={manualData.spo2}
                            onChange={handleManualChange}
                            unit="%"
                        />

                    </div>


                    {/* Boolean Sensors */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                        {/* Flame */}

                        <label className="flex items-center justify-between border border-slate-200 rounded-xl p-4 cursor-pointer hover:bg-slate-50">

                            <div>

                                <p className="font-medium text-slate-700">
                                    Flame Detection
                                </p>

                                <p className="text-xs text-slate-500">
                                    Is flame detected?
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                name="flameDetected"
                                checked={manualData.flameDetected}
                                onChange={handleManualChange}
                                className="w-5 h-5"
                            />

                        </label>


                        {/* Fall */}

                        <label className="flex items-center justify-between border border-slate-200 rounded-xl p-4 cursor-pointer hover:bg-slate-50">

                            <div>

                                <p className="font-medium text-slate-700">
                                    Fall Detection
                                </p>

                                <p className="text-xs text-slate-500">
                                    Is a possible fall detected?
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                name="fallDetected"
                                checked={manualData.fallDetected}
                                onChange={handleManualChange}
                                className="w-5 h-5"
                            />

                        </label>

                    </div>

                </div>

            )}


            {/* ================= SENSOR PREVIEW ================= */}

            <div className="mt-6">

                <div className="flex items-center justify-between mb-3">

                    <h3 className="text-sm font-semibold text-slate-700">
                        Sensor Preview
                    </h3>

                    <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {mode === "scenario"
                            ? "Preset Data"
                            : "Manual Data"}
                    </span>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <PreviewCard
                        label="Gas"
                        value={`${currentData.gas} ppm`}
                    />

                    <PreviewCard
                        label="Flame"
                        value={
                            currentData.flameDetected
                                ? "🔥 Detected"
                                : "✓ Normal"
                        }
                    />

                    <PreviewCard
                        label="Humidity"
                        value={`${currentData.humidity}%`}
                    />

                    <PreviewCard
                        label="Temperature"
                        value={`${currentData.temperature}°C`}
                    />

                    <PreviewCard
                        label="CO"
                        value={`${currentData.co} ppm`}
                    />

                    <PreviewCard
                        label="CH4"
                        value={`${currentData.ch4}%`}
                    />

                    <PreviewCard
                        label="O2"
                        value={`${currentData.o2}%`}
                    />

                    <PreviewCard
                        label="Heart Rate"
                        value={`${currentData.heartRate} BPM`}
                    />

                    <PreviewCard
                        label="SpO2"
                        value={`${currentData.spo2}%`}
                    />

                    <PreviewCard
                        label="Fall Detection"
                        value={
                            currentData.fallDetected
                                ? "⚠️ Detected"
                                : "✓ Normal"
                        }
                    />

                </div>

            </div>


            {/* ================= SIMULATE ================= */}

            <div className="mt-6">

                <button
                    onClick={handleSimulate}
                    disabled={
                        loadingHelmets ||
                        helmets.length === 0
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                >
                    🚀 Send Sensor Data
                </button>

            </div>

        </div>
    );
}


// =====================================================
// Input Field
// =====================================================

function InputField({
    label,
    name,
    value,
    onChange,
    unit,
    step = "1"
}) {

    return (
        <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <div className="relative">

                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    step={step}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {unit}
                </span>

            </div>

        </div>
    );
}


// =====================================================
// Preview Card
// =====================================================

function PreviewCard({ label, value }) {

    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">
                {value}
            </p>

        </div>
    );
}


export default DemoSensorSimulator;