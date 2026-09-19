function Footer() {
    return (
        <footer className="bg-slate-950 text-white mt-auto">

            {/* Main Footer */}
            <div className="px-8 py-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                    {/* Project Branding */}
                    <div className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-2xl shadow-lg">
                            ⛑️
                        </div>

                        <div>
                            <h2 className="text-lg font-bold">
                                MineSafe
                            </h2>

                            <p className="text-sm text-slate-400 mt-1 max-w-md">
                                AI-Powered Underground Mine Safety,
                                Monitoring & Rescue System
                            </p>
                        </div>

                    </div>


                    {/* System Status */}
                    <div className="flex items-center gap-3">

                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800">

                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>

                            <div>
                                <p className="text-xs font-semibold text-slate-200">
                                    System Online
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    Monitoring Active
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* Divider */}
                <div className="border-t border-slate-800 mt-7 pt-5">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                        <p className="text-xs text-slate-500 text-center sm:text-left">
                            © 2026 MineSafe. Underground Safety Monitoring System.
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Powered by</span>

                            <span className="font-semibold text-slate-300">
                                AI • IoT • MERN
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;