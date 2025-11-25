import React, { useState, useEffect,  } from "react";
import { Link, useLocation, Outlet } from "react-router";
import {
  Menu,
  X,
  Users,
  Home,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

type AppLayoutProps = {
  children?: '';
};

const topNavItems = [
  { name: "Annotation", href: "/annotation" },
  { name: "API", href: "/api" },
  { name: "Billing", href: "/billing" },
  { name: "Clients", href: "/clients" },
  { name: "Exports", href: "/exports" },
  { name: "Imports", href: "/imports" },
  { name: "QC", href: "/qc" },
];

const sidebarItems = [
  { name: "Resellers", href: "/resellers", icon: Users },
  { name: "All Clients", href: "/clients", icon: Home },
  { name: "Inactive Resellers", href: "/resellers/inactive", icon: Users },
  { name: "CarBravo FTP List", href: "/ftp-list", icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setMobileMenuOpen(desktop);
    }
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    if (!isDesktop) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isDesktop]);

  // ESC closes menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const toggleMenu = () => setMobileMenuOpen((x) => !x);
  const close = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-lg h-12">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="p-1 rounded-md hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-base font-semibold">Double4 AI</h1>
          </div>

          <nav className="hidden md:flex gap-5 text-sm">
            {topNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="hover:text-gray-300 px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm">SUPADMIN</span>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ChevronDown className="w-4 h-4 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-12 left-0 bottom-0 w-64 bg-white border-r shadow transition-transform duration-300 z-40 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-4">
            Global Actions
          </h3>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={!isDesktop ? close : undefined}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
                    active
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t p-5">
          <Link
            to="/logout"
            onClick={!isDesktop ? close : undefined}
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* BACKDROP */}
      {mobileMenuOpen && !isDesktop && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={close} />
      )}

      {/* MAIN */}
      <main className="pt-12 min-h-screen transition-all">
        <div className="p-6">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}
