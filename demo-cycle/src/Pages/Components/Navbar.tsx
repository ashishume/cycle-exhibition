import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Home,
  Users, Settings
} from "lucide-react";
import { loadCartFromStorage } from "../../utils/Localstorage";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const cartItems = loadCartFromStorage();
  // If we're on the presentation page, don't render anything
  if (location.pathname === "/presentation") {
    return null;
  }
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Customers", href: "/customer-form", icon: Users },
    // { name: "Add Product", href: "/cycle-form", icon: Package },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bg-black/10 top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            {/* <Package className="h-8 w-8 text-white" /> */}

            <NavLink to={"/"}>
              <span className="ml-2 text-xl font-bold text-white flex items-center">
                <img src="/logo.png" height={100} width={100} />
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item?.name}
                  to={item?.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                    isActive(item?.href)
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item?.name}
                </NavLink>
              );
            })}

            {/* Cart Icon with Badge */}
            <NavLink
              to="/cart"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 relative ${
                isActive("/cart")
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md border-b border-white/20">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}

            {/* Mobile Cart Link */}
            <NavLink
              to="/cart"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center gap-2 transition-all duration-300 relative ${
                isActive("/cart")
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute top-2 left-24 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

// Create a wrapper component that handles the conditional rendering
const NavbarWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const showNavbar = !location.pathname.includes("/presentation");
  const isPresentationPage = location.pathname.includes("/presentation");

  return (
    <div className={isPresentationPage ? "h-screen overflow-hidden" : ""}>
      {showNavbar && <Navbar />}
      <div
        className={`${showNavbar ? "pt-16" : ""} ${
          isPresentationPage ? "h-full" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default NavbarWrapper;
