import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center md:justify-start min-h-screen bg-[#FFF0F5] md:bg-gray-50 text-slate-800">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 max-w-md md:max-w-7xl mx-auto w-full bg-white md:bg-transparent min-h-screen relative pb-20 md:pb-0">
        <div className="md:p-8 h-full">
          <main className="p-4 md:p-6 md:bg-white md:rounded-3xl md:shadow-sm md:border border-gray-200 min-h-full">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
