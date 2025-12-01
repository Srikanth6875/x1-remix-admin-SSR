import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { Menu, X, Users, Home, LogOut, ChevronDown } from "lucide-react";

type AppLayoutProps = {
  children?: ReactNode;
};

const topNavItems = [
  { name: "Reseller", href: "/reflection", search: { app_type: "RESELLER", run_type: "GET_RESELLER" } },
  { name: "Clients", href: "/clients", search: { app_type: "CLIENTS", run_type: "GET_CLIENTS" } },
  { name: "Exports", href: "/exports", },
  { name: "Imports", href: "/imports", },
];

const sidebarItems = [
  { name: "All Clients", href: "/clients-List", icon: Home, search: { app_type: "CLIENTS", run_type: "GET_CLIENTS" } },
  { name: "inActive reseller", href: "/in-Active-reseller", icon: Users, search: { app_type: "RESELLER", run_type: "IN_ACTIVE_RESELLER" }  },
];

const buildSearch = (search?: Record<string, string>) => search ? `?${new URLSearchParams(search).toString()}` : "";

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") closeSidebar(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-gray-800 text-white shadow-lg flex items-center justify-between px-4">
        <div className="flex items-center gap-15">
          <h1 className="text-base font-semibold ml-[80px] text-[20px]">X1</h1>
          {/* Hamburger */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-600 transition-colors ml-[20px]"
          >
            {sidebarOpen ? <Menu className="w-8 h-7" /> : <Menu className="w-8 h-7" />}
          </button>

          {/* Top Navigation */}
          <nav className="hidden md:flex gap-3 text-sm ml-[-40px]">
            {topNavItems.map((item) => (
              <Link
                key={item.name}
                to={{
                  pathname: item.href,
                  search: buildSearch(item.search),
                }}
                className="hover:text-gray-300 transition-colors px-2"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm font-medium">Admin</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <ChevronDown className="w-4 h-4 hidden sm:block" />
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={` fixed top-12 left-0 bottom-0 w-60 bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={{
                      pathname: item.href,
                      search: buildSearch(item.search),
                    }}
                    onClick={isMobile ? closeSidebar : undefined}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <Icon className="w-5 h-5" /> {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-5">
            <Link to="/logout" onClick={isMobile ? closeSidebar : undefined}
              className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* BACKDROP */}
      {sidebarOpen && isMobile && (<div className="fixed inset-0 bg-black/50 z-30" onClick={closeSidebar} />)}

      {/* MAIN */}
      <main className={`flex-1 pt-10 transition-all duration-300 ${sidebarOpen ? "md:pl-58" : "md:pl-0"}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
