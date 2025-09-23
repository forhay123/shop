import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Package, Star, Monitor, Home, Box, Phone, Info, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchProducts } from "@/utils/api";
import { Button } from "@/components/ui/button";

export default function ResponsiveNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const productsData = await fetchProducts();
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))].sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
    setIsOpen(false);
    setShowCategories(false);
  };

  // Check for both 'admin' and 'read_admin' roles for the home link
  const homeLinkTo = user
    ? (user.role === "admin" || user.role === "read_admin" ? "/admin-dashboard" : "/dashboard")
    : "/";

  const publicLinks = [
    { name: "Home", to: homeLinkTo, icon: <Home size={18} /> },
    { name: "About", to: "/about", icon: <Info size={18} /> },
    { name: "Contact", to: "/contact", icon: <Phone size={18} /> },
  ];

  const commonLoggedInLinks = [
    { name: "Home", to: homeLinkTo, icon: <Home size={18} /> },
  ];

  const userLinks = [
    { name: "My Cart", to: "/cart", icon: <ShoppingCart size={18} /> },
    { name: "My Orders", to: "/orders", icon: <Package size={18} /> },
  ];

  const adminLinks = [
    { name: "Dashboard", to: "/admin-dashboard", icon: <Monitor size={18} /> },
    { name: "Products", to: "/admin/products", icon: <Package size={18} /> },
    { name: "Orders", to: "/admin/orders", icon: <ShoppingCart size={18} /> },
    { name: "Inventory", to: "/admin/inventory", icon: <Star size={18} /> },
    { name: "Users", to: "/admin/users", icon: <Star size={18} /> },
    { name: "Analytics", to: "/admin/financials", icon: <Star size={18} /> },
    { name: "Reviews", to: "/reviews/admin", icon: <Star size={18} /> },
  ];

  let finalNavLinks = [];
  if (user) {
    // Check for both 'admin' and 'read_admin' roles
    if (user.role === "admin" || user.role === "read_admin") {
      finalNavLinks = adminLinks;
    } else {
      finalNavLinks = [...commonLoggedInLinks, ...userLinks];
    }
  } else {
    finalNavLinks = publicLinks;
  }

  const isActive = (path) => location.pathname === path;

  const renderCategoryDropdown = (isMobile = false) => (
    <div key="Categories" className={`relative ${isMobile ? 'w-full' : ''}`}>
      <Button
        variant="ghost"
        onClick={() => setShowCategories(!showCategories)}
        className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 text-foreground hover:text-primary hover:bg-primary/5 ${isMobile ? 'w-full justify-start' : ''}`}
      >
        <span className="text-primary"><Box size={18} /></span>
        Categories
        <ChevronDown size={16} className={`${isMobile ? 'ml-auto' : 'ml-1'} transition-transform ${showCategories ? 'rotate-180' : 'rotate-0'}`} />
      </Button>
      {showCategories && (
        <div className={`${isMobile ? 'relative mt-2 pl-4' : 'absolute top-full mt-2 w-56 p-2 rounded-xl glass-effect shadow-elegant border border-border/50 animate-fade-in origin-top-right'}`}>
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="w-full justify-start text-left font-normal capitalize hover:bg-primary/10 transition-colors"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="glass-effect fixed w-full z-50 shadow-medium border-b">
      <div className="container mx-auto flex justify-between items-center px-8 py-3">
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <img
              src="/icon-152.png"
              alt="CODED AB TECH logo"
              className="w-12 h-12 rounded-xl group-hover:scale-110 transition-all duration-500"
            />
          </div>
          <div className="flex flex-col ml-3">
            <span className="text-sm font-semibold text-primary">
              CODED AB TECH
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {finalNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                isActive(link.to)
                  ? "text-primary bg-primary/10 shadow-soft"
                  : "text-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              {link.icon && <span className="text-primary">{link.icon}</span>}
              {link.name}
              {isActive(link.to) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-primary rounded-full"></div>
              )}
            </Link>
          ))}
          {user && user.role !== "admin" && user.role !== "read_admin" && renderCategoryDropdown()}
          {!user && renderCategoryDropdown()}
        </nav>

        {/* Auth Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-card rounded-xl border shadow-soft">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-6 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-all duration-300 shadow-soft hover:shadow-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary py-2.5"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-card border shadow-soft hover:shadow-medium transition-all duration-300 focus:outline-none hover:scale-105"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass-effect border-t animate-fade-in">
          <div className="container mx-auto px-8 py-6">
            {user && (
              <div className="flex items-center space-x-4 pb-4 mb-4 border-b border-border">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl"></div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {user.role} Account
                  </span>
                </div>
              </div>
            )}
            <div className="grid gap-2 mb-6">
              {finalNavLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 animate-fade-in ${
                    isActive(link.to)
                      ? "text-primary bg-primary/10 border border-primary/20 shadow-soft"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <span className="text-primary">{link.icon}</span>}
                  {link.name}
                </Link>
              ))}
              {user && user.role !== "admin" && user.role !== "read_admin" && renderCategoryDropdown(true)}
              {!user && renderCategoryDropdown(true)}
            </div>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="w-full px-6 py-3 text-center rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-all duration-300 shadow-soft"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center btn-primary py-3"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
