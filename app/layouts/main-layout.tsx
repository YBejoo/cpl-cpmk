import { Outlet } from "react-router";
import { Sidebar } from "~/components/sidebar";
import { Header } from "~/components/header";
import { SidebarProvider, useSidebar } from "~/contexts/sidebar-context";

function MainLayoutContent() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className={`
          flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "ml-17" : "ml-60"}
        `}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>© 2026 SI-CAP - Sistem Informasi Capaian Pembelajaran</span>
            <span>Version 1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function MainLayout() {
  return (
    <SidebarProvider>
      <MainLayoutContent />
    </SidebarProvider>
  );
}
