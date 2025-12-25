import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// ✅ CORRECT IMPORT: Standard sidebar only
import { Sidebar as PrimeSidebarPopup } from 'primereact/sidebar';

// Import your local components
import SidebarContent from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    // --- 1. STATE MANAGEMENT ---
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);

    // --- 2. DARK MODE LOGIC (Tailwind Only) ---
    // This is safer and works on all versions of PrimeReact
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // --- 3. LAYOUT RENDER ---
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
            {/* Desktop Sidebar */}
            <div className={`hidden lg:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <SidebarContent collapsed={isCollapsed} />
            </div>

            {/* Mobile Sidebar (Popup) */}
            <PrimeSidebarPopup
                visible={mobileVisible}
                onHide={() => setMobileVisible(false)}
                className="w-72 p-0"
                showCloseIcon={false}
            >
                <SidebarContent collapsed={false} onLinkClick={() => setMobileVisible(false)} />
            </PrimeSidebarPopup>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Navbar
                    isCollapsed={isCollapsed}
                    onMobileToggle={() => setMobileVisible(true)}
                    onDesktopToggle={() => setIsCollapsed(!isCollapsed)}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                />

                <div className="flex-1 overflow-y-auto p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;