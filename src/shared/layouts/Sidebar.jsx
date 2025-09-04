import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  selectSidebar,
  selectNavigation,
  selectLayoutType,
  selectSidebarColor,
  toggleSidebar,
  toggleSidebarCollapse,
  // Remove Redux menu actions
  closeAllMenus,
  LAYOUT_TYPES,
} from "../../store/slices/layoutSlice";
import { useDynamicColors } from "../../hooks/useDynamicColors";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useNavigation } from "../../utils/navigation";
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  TagIcon,
  Squares2X2Icon,
  CubeIcon,
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { navigation } from "../../config/menu.config";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector(selectSidebar);
  // const navigation = useAppSelector(selectNavigation);
  const layoutType = useAppSelector(selectLayoutType);
  const selectedColor = useAppSelector(selectSidebarColor);
  const { sidebarGradient } = useDynamicColors();
  const { navigate, currentPath, isActivePath } = useNavigation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  
  // Local state for managing open menus instead of Redux
  const [openMenus, setOpenMenus] = useState(new Set());

  // Animation completion handler
  useEffect(() => {
    setIsAnimationComplete(false);
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [sidebar.isOpen]);

  // Reset hovered item when sidebar toggles
  useEffect(() => {
    setHoveredItem(null);
  }, [sidebar.isOpen]);

  // Auto-open parent menus based on current URL
  useEffect(() => {
    // Prevent running if currentPath is not available yet
    if (!currentPath) return;
    
    const autoOpenMenus = () => {
      const newOpenMenus = new Set();
      
      // Check each menu item to see if any of its subitems match the current path
      navigation.items.forEach(item => {
        if (item.type === "menu" && item.items) {
          const hasActiveSubItem = item.items.some(subItem => 
            currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
          );
          if (hasActiveSubItem) {
            newOpenMenus.add(item.id);
          }
        }
      });
      
      setOpenMenus(newOpenMenus);
    };

    // Run on mount and when currentPath changes
    autoOpenMenus();
  }, [currentPath]); // Remove isActivePath dependency to prevent infinite loops

  // Icon mapping
  const iconMap = {
    HomeIcon,
    UsersIcon,
    ChartBarIcon,
    CogIcon,
    BuildingOfficeIcon,
    BuildingStorefrontIcon,
    ShieldCheckIcon,
    TagIcon,
    Squares2X2Icon,
    CubeIcon,
  };

  // Get sidebar classes based on layout type and selected color
  const getSidebarClasses = () => {
    const baseClasses =
      "transition-all duration-300 ease-in-out backdrop-blur-sm shadow-lg border-r border-white/10";

    switch (layoutType) {
      case LAYOUT_TYPES.CLASSIC:
        return `${baseClasses} ${
          sidebar.isOpen ? "w-64" : "w-16"
        } bg-gradient-to-b ${sidebarGradient}`;
      case LAYOUT_TYPES.MODERN:
        return `${baseClasses} ${
          sidebar.isOpen ? "w-72" : "w-20"
        } bg-gradient-to-b ${sidebarGradient}`;
      case LAYOUT_TYPES.STACKED_SIDE:
        return `${baseClasses} w-full bg-gradient-to-b ${sidebarGradient}`;
      case LAYOUT_TYPES.DECKED:
        return `${baseClasses} lg:col-span-3 bg-gradient-to-b ${sidebarGradient}`;
      case LAYOUT_TYPES.SIMPLE:
        return `${baseClasses} w-64 bg-gradient-to-b ${sidebarGradient}`;
      case LAYOUT_TYPES.COMPACT:
        return `${baseClasses} ${
          sidebar.isOpen ? "w-48" : "w-12"
        } bg-gradient-to-b ${sidebarGradient}`;
      case LAYOUT_TYPES.FLUID:
        return `${baseClasses} ${
          sidebar.isOpen ? "w-80" : "w-24"
        } bg-gradient-to-b ${sidebarGradient}`;
      default:
        return `${baseClasses} ${
          sidebar.isOpen ? "w-64" : "w-16"
        } bg-gradient-to-b ${sidebarGradient}`;
    }
  };

  // Get navigation item classes
  const getNavItemClasses = (isActive = false) => {
    const baseClasses =
      "flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm relative w-full justify-between";

    if (isActive) {
      return `${baseClasses} bg-white text-blue-600 shadow-md`;
    }

    return `${baseClasses} text-white hover:bg-white/10 hover:shadow-sm`;
  };

  // Get submenu item classes
  const getSubmenuItemClasses = (isActive = false) => {
    const baseClasses =
      "flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ml-8";

    if (isActive) {
      return `${baseClasses} bg-white/20 shadow-sm`;
    }

    return `${baseClasses} text-white/80 hover:bg-white/10`;
  };

  // Get icon classes
  const getIconClasses = (isActive = false) => {
    const baseClasses = "flex-shrink-0 w-5 h-5";

    if (isActive) {
      return `${baseClasses} text-blue-600`;
    }

    return `${baseClasses} text-white`;
  };

  // Get text classes
  const getTextClasses = () => {
    const baseClasses = "ml-3 font-medium";

    if (!sidebar.isOpen && layoutType !== LAYOUT_TYPES.STACKED_SIDE) {
      return `${baseClasses} opacity-0 pointer-events-none`;
    }

    return baseClasses;
  };

  // Handle menu toggle using local state instead of Redux
  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Handle navigation click
  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    // Don't close all menus - let the useEffect handle menu state based on URL
    // This allows submenus to stay open when navigating between related pages
  };

  // Check if a menu is open using local state
  const isMenuOpen = (menuId) => {
    return openMenus.has(menuId);
  };

  // Render navigation item
  const renderNavItem = (item, index = 0) => {
    const IconComponent = iconMap[item.icon];
    const isActive = isActivePath(item.path);
    const itemId = `item-${index}`;

    if (item.type === "menu") {
      const menuIsOpen = isMenuOpen(item.id);
      
      return (
        <div key={item.id} className="relative">
          <div className="relative">
            <button
              onClick={() => handleMenuToggle(item.id)}
              onMouseEnter={() =>
                !sidebar.isOpen && setHoveredItem(`menu-${index}`)
              }
              onMouseLeave={() => setHoveredItem(null)}
              className={getNavItemClasses()}
            >
              <div className="flex items-center w-full">
                {IconComponent && (
                  <IconComponent className={getIconClasses(isActive)} />
                )}

                <span className={getTextClasses()}>{item.label}</span>
              </div>

              {sidebar.isOpen && (
                <div className="flex items-center">
                  {menuIsOpen ? (
                    <ChevronUpIcon className="w-4 h-4 text-white/60 transition-transform duration-300" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-white/60 transition-transform duration-300" />
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {!sidebar.isOpen && hoveredItem === `menu-${index}` && (
                <div className="absolute left-14 z-50 px-3 py-2 bg-white bg-opacity-90 rounded-md shadow-lg whitespace-nowrap animate-in fade-in-50 slide-in-from-left-5 duration-200">
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                </div>
              )}
            </button>

            {/* Invisible hover connector for menu */}
            {!sidebar.isOpen && hoveredItem === `menu-${index}` && (
              <div
                className="absolute left-[64px] top-0 w-4 h-full"
                onMouseEnter={() => setHoveredItem(`menu-${index}`)}
              />
            )}
          </div>

          {/* Submenu for expanded sidebar */}
          {menuIsOpen &&
            sidebar.isOpen &&
            item.items &&
            isAnimationComplete && (
              <div className="ml-4 pl-3 mt-2 space-y-1 animate-in fade-in-50 slide-in-from-top-3 duration-200">
                {item.items.map((subItem, subIndex) =>
                  renderNavItem(subItem, `${index}-${subIndex}`)
                )}
              </div>
            )}

          {/* Submenu for collapsed sidebar */}
          {!sidebar.isOpen &&
            (hoveredItem === `menu-${index}` || menuIsOpen) &&
            isAnimationComplete && (
              <div
                className="fixed left-[64px] top-0 mt-2 ml-2 px-1 py-1 z-40 bg-white rounded-lg shadow-[-5px_5px_25px_rgba(0,0,0,0.2)] min-w-[180px] animate-in fade-in-50 slide-in-from-left-5 duration-200"
                style={{ top: `${index * 48 + 120}px` }}
                onMouseEnter={() => setHoveredItem(`menu-${index}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="absolute -left-2 top-5 w-0 h-0 border-t-8 border-r-8 border-b-8 border-transparent border-r-white" />
                {item.items.map((subItem, subIndex) => {
                  const subIsActive = isActivePath(subItem.path);
                  const SubIconComponent = iconMap[subItem.icon];

                  return (
                    <a
                      key={subIndex}
                      href={subItem.path}
                      onClick={(e) => handleNavClick(e, subItem.path)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                        subIsActive
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {SubIconComponent && (
                        <SubIconComponent
                          className={`w-3.5 h-3.5 ${
                            subIsActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        />
                      )}
                      <span className="font-medium">{subItem.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
        </div>
      );
    }

    // Regular navigation item
    return (
      <a
        key={item.id}
        href={item.path}
        onClick={(e) => handleNavClick(e, item.path)}
        onMouseEnter={() => !sidebar.isOpen && setHoveredItem(itemId)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`${getNavItemClasses(isActive)} ${
          !sidebar.isOpen && layoutType !== LAYOUT_TYPES.STACKED_SIDE
            ? "justify-center"
            : ""
        }`}
      >
        <div className="flex items-center w-full">
          {IconComponent && (
            <IconComponent className={getIconClasses(isActive)} />
          )}

          <span className={getTextClasses()}>{item.label}</span>
        </div>

        {item.badge && sidebar.isOpen && (
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
            {item.badge}
          </Badge>
        )}

        {/* Tooltip for collapsed state */}
        {!sidebar.isOpen && hoveredItem === itemId && (
          <div className="absolute left-14 z-50 px-3 py-2 bg-white bg-opacity-90 rounded-md shadow-lg whitespace-nowrap animate-in fade-in-50 slide-in-from-left-5 duration-200">
            <span className="text-sm font-medium text-gray-900">
              {item.label}
            </span>
          </div>
        )}
      </a>
    );
  };

  return (
    <aside
      key={`sidebar-${selectedColor}`}
      className={`h-screen fixed top-0 left-0 flex flex-col justify-between z-50 ${getSidebarClasses()} ${
        !sidebar.isOpen ? "lg:translate-x-0 -translate-x-full" : "translate-x-0"
      } lg:translate-x-0`}
    >
      {/* Mobile overlay backdrop */}
      {sidebar.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Decorative Vector Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top right circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm"></div>

        {/* Bottom left circle */}
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 backdrop-blur-sm"></div>

        {/* Middle hexagon */}
        <div className="absolute top-1/3 -right-10 w-40 h-40 rotate-45 bg-white/3 backdrop-blur-sm rounded-lg"></div>

        {/* Animated floating lines */}
        <div className="absolute left-0 top-10 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40"></div>
        <div className="absolute left-0 top-1/3 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
        <div className="absolute left-0 top-2/3 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-20"></div>

        {/* Glowing dots */}
        <div className="absolute top-20 left-10 w-1 h-1 rounded-full bg-white/50 shadow-[0_0_8px_2px_rgba(255,255,255,0.3)]"></div>
        <div className="absolute top-40 left-4 w-1.5 h-1.5 rounded-full bg-white/50 shadow-[0_0_8px_2px_rgba(255,255,255,0.3)]"></div>
        <div className="absolute bottom-40 left-6 w-1 h-1 rounded-full bg-white/50 shadow-[0_0_8px_2px_rgba(255,255,255,0.3)]"></div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col relative z-10">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          {sidebar.isOpen && layoutType !== LAYOUT_TYPES.STACKED_SIDE ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">EMI Frontend</h2>
                <p className="text-xs text-white/70">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {layoutType !== LAYOUT_TYPES.STACKED_SIDE && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(toggleSidebarCollapse())}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                {sidebar.isCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4" />
                ) : (
                  <ChevronLeftIcon className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white lg:hidden"
            >
              <Bars3Icon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2 relative">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-4">
              {sidebar.isOpen ? "Navigation" : ""}
            </h3>
            <div className="space-y-1">
              {navigation.items.map((item, index) =>
                renderNavItem(item, index)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {sidebar.isOpen && layoutType !== LAYOUT_TYPES.STACKED_SIDE && (
        <div className="p-4 space-y-3 border-t border-white/10 relative z-10">
          <div className="px-4 py-4 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/80">Theme</span>
              <div className="w-8 h-4 bg-white/20 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="cursor-pointer transition-colors text-white/60 hover:text-white">
                Privacy
              </span>
              <span className="cursor-pointer transition-colors text-white/60 hover:text-white">
                Terms
              </span>
            </div>
          </div>

          <a
            href="/account-settings"
            onMouseEnter={() => !sidebar.isOpen && setHoveredItem("account")}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all text-white"
          >
            <UserCircleIcon className="w-5 h-5" />
            {sidebar.isOpen && (
              <span className="text-sm font-medium">Account Settings</span>
            )}

            {!sidebar.isOpen && hoveredItem === "account" && (
              <div className="absolute left-14 z-50 px-3 py-2 bg-white bg-opacity-90 rounded-md shadow-lg whitespace-nowrap animate-in fade-in-50 slide-in-from-left-5 duration-200">
                <span className="text-sm font-medium text-gray-900">
                  Account Settings
                </span>
              </div>
            )}
          </a>

          <button
            onClick={() => {
              // Handle logout logic here
              console.log("Logout clicked");
            }}
            onMouseEnter={() => !sidebar.isOpen && setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative w-full flex items-center gap-3 p-3 rounded-lg text-red-300 hover:bg-red-500/20 hover:shadow-sm transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {sidebar.isOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}

            {!sidebar.isOpen && hoveredItem === "logout" && (
              <div className="absolute left-14 z-50 px-3 py-2 bg-white text-red-500 bg-opacity-90 rounded-md shadow-lg whitespace-nowrap animate-in fade-in-50 slide-in-from-left-5 duration-200">
                <span className="text-sm font-medium">Logout</span>
              </div>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
