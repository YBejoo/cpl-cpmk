import { useLocation } from "react-router";
import { NAV_ITEMS } from "~/lib/constants";
import { Icons } from "~/components/ui/icons";
import { useSidebar } from "~/contexts/sidebar-context";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  // Generate breadcrumb from current path
  const getBreadcrumb = () => {
    const currentNav = NAV_ITEMS.find((item) => 
      item.href === location.pathname || 
      (item.href !== "/" && location.pathname.startsWith(item.href))
    );
    const pageName = currentNav?.title || title || "Page";

    if (location.pathname === "/") {
      return ["Dashboard"];
    }

    return ["Home", pageName];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="
      h-16 bg-white dark:bg-slate-900 
      border-b border-slate-200 dark:border-slate-800
      flex items-center justify-between px-6
      sticky top-0 z-40
    ">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggle}
          className="
            lg:hidden p-2 rounded-lg
            text-slate-500 hover:text-slate-700 hover:bg-slate-100
            dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800
            transition-colors
          "
        >
          <Icons.Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <Icons.ChevronRight size={16} className="text-slate-400" />
              )}
              <span 
                className={`
                  text-sm font-medium
                  ${index === breadcrumb.length - 1 
                    ? "text-slate-900 dark:text-white" 
                    : "text-slate-500 dark:text-slate-400"
                  }
                `}
              >
                {item}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button className="
          p-2 rounded-lg text-slate-500 
          hover:text-slate-700 hover:bg-slate-100
          dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800
          transition-colors
        ">
          <Icons.Search size={20} />
        </button>

        {/* Notifications */}
        <button className="
          relative p-2 rounded-lg text-slate-500 
          hover:text-slate-700 hover:bg-slate-100
          dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800
          transition-colors
        ">
          <Icons.Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* User Profile */}
        <button className="
          flex items-center gap-3 p-1.5 pr-3 rounded-lg
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition-colors
        ">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
          <Icons.ChevronDown size={16} className="hidden sm:block text-slate-400" />
        </button>
      </div>
    </header>
  );
}
