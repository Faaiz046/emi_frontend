import React, { useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  selectLayoutType, 
  selectSidebar, 
  selectNavbar, 
  selectDirection,
  selectTheme,
  setResponsiveState,
  LAYOUT_TYPES 
} from '../../store/slices/layoutSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import QuickActions from './QuickActions';
import PageLoader from '../components/ui/PageLoader';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const Layout = () => {
  const dispatch = useAppDispatch();
  const layoutType = useAppSelector(selectLayoutType);
  const sidebar = useAppSelector(selectSidebar);
  const navbar = useAppSelector(selectNavbar);
  const direction = useAppSelector(selectDirection);
  const theme = useAppSelector(selectTheme);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      dispatch(setResponsiveState({
        isMobile,
        isTablet,
        isDesktop,
        breakpoint: isMobile ? 'sm' : isTablet ? 'md' : 'lg'
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Set document direction and theme
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('data-theme', theme.mode);
  }, [direction, theme.mode]);

  // Get layout classes based on type
  const getLayoutClasses = () => {
    const baseClasses = 'min-h-screen bg-gray-50';
    
    switch (layoutType) {
      case LAYOUT_TYPES.CLASSIC:
        return `${baseClasses} flex`;
      case LAYOUT_TYPES.MODERN:
        return `${baseClasses} flex`;
      case LAYOUT_TYPES.STACKED_SIDE:
        return `${baseClasses} flex flex-col`;
      case LAYOUT_TYPES.DECKED:
        return `${baseClasses} grid grid-cols-1 lg:grid-cols-12`;
      case LAYOUT_TYPES.SIMPLE:
        return `${baseClasses} flex flex-col`;
      case LAYOUT_TYPES.COMPACT:
        return `${baseClasses} flex`;
      case LAYOUT_TYPES.FLUID:
        return `${baseClasses} flex`;
      default:
        return `${baseClasses} flex`;
    }
  };

  // Get sidebar classes
  const getSidebarClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    switch (layoutType) {
      case LAYOUT_TYPES.CLASSIC:
        return `${baseClasses} ${sidebar.isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg`;
      case LAYOUT_TYPES.MODERN:
        return `${baseClasses} ${sidebar.isOpen ? 'w-72' : 'w-20'} bg-white shadow-xl`;
      case LAYOUT_TYPES.STACKED_SIDE:
        return `${baseClasses} w-full bg-white shadow-lg`;
      case LAYOUT_TYPES.DECKED:
        return `${baseClasses} lg:col-span-3 bg-white shadow-lg`;
      case LAYOUT_TYPES.SIMPLE:
        return `${baseClasses} w-64 bg-white shadow-md`;
      case LAYOUT_TYPES.COMPACT:
        return `${baseClasses} ${sidebar.isOpen ? 'w-48' : 'w-12'} bg-gray-800`;
      case LAYOUT_TYPES.FLUID:
        return `${baseClasses} ${sidebar.isOpen ? 'w-80' : 'w-24'} bg-white shadow-lg`;
      default:
        return `${baseClasses} ${sidebar.isOpen ? 'w-64' : 'w-16'} bg-white shadow-lg`;
    }
  };

  // Get main content classes
  const getMainClasses = () => {
    const baseClasses = 'flex-1 transition-all duration-300 ease-in-out';
    
    // Get sidebar width based on state and layout type
    const getSidebarWidth = () => {
      if (layoutType === LAYOUT_TYPES.STACKED_SIDE || layoutType === LAYOUT_TYPES.DECKED) {
        return ''; // No margin for these layouts
      }
      
      // Always add margin for desktop to prevent overlay
      if (!sidebar.isOpen) {
        switch (layoutType) {
          case LAYOUT_TYPES.CLASSIC:
            return 'ml-16';
          case LAYOUT_TYPES.MODERN:
            return 'ml-20';
          case LAYOUT_TYPES.COMPACT:
            return 'ml-12';
          case LAYOUT_TYPES.FLUID:
            return 'ml-24';
          default:
            return 'ml-16';
        }
      } else {
        switch (layoutType) {
          case LAYOUT_TYPES.CLASSIC:
            return 'ml-64';
          case LAYOUT_TYPES.MODERN:
            return 'ml-72';
          case LAYOUT_TYPES.COMPACT:
            return 'ml-48';
          case LAYOUT_TYPES.FLUID:
            return 'ml-80';
          default:
            return 'ml-64';
        }
      }
    };
    
    switch (layoutType) {
      case LAYOUT_TYPES.CLASSIC:
        return `${baseClasses} flex flex-col ${getSidebarWidth()}`;
      case LAYOUT_TYPES.MODERN:
        return `${baseClasses} flex flex-col ${getSidebarWidth()}`;
      case LAYOUT_TYPES.STACKED_SIDE:
        return `${baseClasses} flex flex-col`;
      case LAYOUT_TYPES.DECKED:
        return `${baseClasses} lg:col-span-9 flex flex-col`;
      case LAYOUT_TYPES.SIMPLE:
        return `${baseClasses} flex flex-col ${getSidebarWidth()}`;
      case LAYOUT_TYPES.COMPACT:
        return `${baseClasses} flex flex-col ${getSidebarWidth()}`;
      case LAYOUT_TYPES.FLUID:
        return `${baseClasses} flex flex-col ${getSidebarWidth()}`;
      default:
        return `${baseClasses} flex flex-col ${getSidebarWidth()}`;
    }
  };

  // Get content classes
  const getContentClasses = () => {
    const baseClasses = 'flex-1 p-6';
    
    switch (layoutType) {
      case LAYOUT_TYPES.CLASSIC:
        return `${baseClasses} w-full`;
      case LAYOUT_TYPES.MODERN:
        return `${baseClasses} w-full`;
      case LAYOUT_TYPES.STACKED_SIDE:
        return `${baseClasses} w-full`;
      case LAYOUT_TYPES.DECKED:
        return `${baseClasses} w-full`;
      case LAYOUT_TYPES.SIMPLE:
        return `${baseClasses} w-full`;
      case LAYOUT_TYPES.COMPACT:
        return `${baseClasses} w-full`;
      case LAYOUT_TYPES.FLUID:
        return `${baseClasses} w-full`;
      default:
        return `${baseClasses} w-full`;
    }
  };

  const renderLayout = () => {
    switch (layoutType) {
      case LAYOUT_TYPES.STACKED_SIDE:
        return (
          <>
            <Sidebar />
            <div className={getMainClasses()}>
              {navbar.isVisible && <Navbar />}
              <main className={getContentClasses()}>
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Outlet />
                  </Suspense>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </>
        );
      
      case LAYOUT_TYPES.SIMPLE:
        return (
          <>
            <Sidebar />
            <div className={getMainClasses()}>
              {navbar.isVisible && <Navbar />}
              <main className={getContentClasses()}>
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Outlet />
                  </Suspense>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </>
        );
      
      default:
        return (
          <div className='flex flex-col min-h-screen w-full overscroll-none'>
            <Sidebar />
            <div className={getMainClasses()}>
              {navbar.isVisible && <Navbar />}
              <main className={getContentClasses()}>
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader variant='lazy'/>}>
                    <Outlet />
                  </Suspense>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {renderLayout()}
      <QuickActions />
    </div>
  );
};

export default Layout; 