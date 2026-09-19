import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100">

            <Sidebar />

            <div className="ml-64 min-h-screen flex flex-col">

                <Navbar />

                <main className="flex-1 p-8">
                    {children}
                </main>

                <Footer />

            </div>

        </div>
    );
}

export default DashboardLayout;