function Navbar() {
    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

            {/* Left */}
            <div>
                <h2 className="text-xl font-semibold text-slate-800">
                    Mine Safety Monitoring
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    AI-Powered Underground Mine Safety System
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">

                {/* Notification */}
                <button className="relative text-xl text-slate-600 hover:text-slate-900">
                    🔔

                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Admin */}
                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        A
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            Admin
                        </p>

                        <p className="text-xs text-slate-500">
                            Operator
                        </p>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default Navbar;