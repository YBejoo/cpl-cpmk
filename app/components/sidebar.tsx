import { Link, useLocation } from "react-router";
import { NAV_ITEMS } from "~/lib/constants";
import { Icons } from "~/components/ui/icons";
import { useSidebar } from "~/contexts/sidebar-context";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard: Icons.LayoutDashboard,
  BookOpen: Icons.BookOpen,
  Target: Icons.Target,
  Layers: Icons.Layers,
  Book: Icons.Book,
  Grid3X3: Icons.Grid3X3,
  FileText: Icons.FileText,
  BarChart3: Icons.BarChart3,
};

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-white dark:bg-slate-900
          flex flex-col z-50 border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-17" : "w-60"}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <Link 
            to="/" 
            className={`
              flex items-center gap-3 overflow-hidden
              transition-all duration-300
              ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
            `}
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
              SI-CAP
            </span>
          </Link>
          
          {/* Collapsed Logo */}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
              const IconComponent = iconMap[item.icon] || Icons.FileText;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 relative
                    ${isActive 
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }
                  `}
                  title={isCollapsed ? item.title : undefined}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                  )}
                  
                  <IconComponent 
                    size={20} 
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                    }`}
                  />
                  
                  <span 
                    className={`
                      font-medium text-sm whitespace-nowrap
                      transition-all duration-300
                      ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
                    `}
                  >
                    {item.title}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="
                      absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 whitespace-nowrap z-50
                      pointer-events-none
                    ">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle Button */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={toggle}
            className="
              w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
              text-slate-500 hover:text-slate-700 hover:bg-slate-100
              dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800
              transition-all duration-200
            "
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Icons.ChevronRight size={20} />
            ) : (
              <>
                <Icons.ChevronLeft size={20} />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
