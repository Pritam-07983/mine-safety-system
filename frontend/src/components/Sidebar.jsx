import { NavLink } from "react-router-dom";

function Sidebar() {
    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "📊",
        },
        {
            name: "Helmets",
            path: "/helmets",
            icon: "⛑️",
        },
        {
            name: "Alerts",
            path: "/alerts",
            icon: "🚨",
        },
        {
            name: "Rescue",
            path: "/rescue",
            icon: "🛟",
        },
        {
            name: "Miners",
            path: "/miners",
            icon: "👷"
        }
    ];

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-950 text-white flex flex-col z-50">

            {/* Logo */}
            <div className="px-6 py-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold">
                    ⛏ MineSafe
                </h1>

                <p className="text-xs text-slate-400 mt-1">
                    Underground Safety System
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">

                <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">
                    Main Menu
                </p>

                <div className="space-y-2">

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <span className="text-lg">
                                {item.icon}
                            </span>

                            <span className="font-medium">
                                {item.name}
                            </span>
                        </NavLink>
                    ))}

                </div>

            </nav>

            {/* System Status */}
            <div className="p-4 border-t border-slate-800">

                <div className="bg-slate-900 rounded-lg p-4">

                    <div className="flex items-center gap-2">

                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>

                        <span className="text-sm font-medium">
                            System Online
                        </span>

                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                        All systems operational
                    </p>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;