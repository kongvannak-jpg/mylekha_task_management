import React, { useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ✅ CORRECT IMPORTS
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { ToggleButton } from 'primereact/togglebutton';
import { useAuth } from '../../hooks/useAuth';
import { Menu } from 'primereact/menu';

const Navbar = ({ onMobileToggle, onDesktopToggle, isCollapsed, isDark, onToggleTheme }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Setup Refs and Auth
    const menuRight = useRef(null);
    const { logout } = useAuth();

    const items = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
                navigate('/profile');
            }
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            className: 'text-red-500',
            command: async () => {
                await logout();
                navigate('/login');
            }
        }
    ];

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === '/' || path === '/dashboard') {
            return <span className="font-bold text-gray-900 dark:text-white mx-2">Dashboard</span>;
        }

        const pathSegments = path.split('/').filter(Boolean);

        return pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const name = segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const isLast = index === pathSegments.length - 1;

            return (
                <React.Fragment key={index}>
                    <span className="mx-2 text-gray-400">/</span>
                    {isLast ? (
                        <span className="font-bold text-gray-900 dark:text-white">{name}</span>
                    ) : (
                        <Link to={url} className="text-gray-400 hover:text-emerald-600 transition-colors">
                            {name}
                        </Link>
                    )}
                </React.Fragment>
            );
        });
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    const isKhmer = i18n.language === 'km';

    return (
        <header className="h-16 bg-white border-b dark:bg-slate-800 border-gray-100 flex items-center justify-between px-6 shrink-0 transition-colors duration-300">
            <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            <div className="flex items-center gap-4">
                <Button
                    icon={isCollapsed ? "pi pi-list" : "pi pi-bars"}
                    text
                    className="text-gray-600 dark:text-gray-300"
                    onClick={() => window.innerWidth < 1024 ? onMobileToggle() : onDesktopToggle()}
                />

                <div className="text-sm flex items-center">
                    <Link to="/" className="text-gray-400 hover:text-emerald-600 transition-colors">
                        Pages
                    </Link>
                    {getBreadcrumbs()}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <div className="relative hidden md:block mr-2">
                    <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <InputText placeholder="Type here..." className="!pl-10 !py-2 p-inputtext-sm rounded-lg bg-gray-50 border-none dark:bg-slate-700 dark:text-white" />
                </div>
                <div className="flex items-center gap-2 mr-2">
                    <ToggleButton
                        checked={isKhmer}
                        onChange={(e) => changeLanguage(e.value ? 'km' : 'en')}
                        onLabel="KH"
                        offLabel="EN"
                        className="w-16 h-8 text-xs font-bold border-none rounded"
                        pt={{
                            root: {
                                className: `transition-all duration-200 border border-gray-200 dark:border-slate-600 ${isKhmer
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-300'
                                    }`
                            }
                        }}
                    />
                </div>
                <Button
                    icon={isDark ? "pi pi-sun" : "pi pi-moon"}
                    text
                    severity="secondary"
                    className="text-gray-600 dark:text-yellow-400 !w-10 !h-10 flex items-center justify-center"
                    onClick={onToggleTheme}
                />
                <div className="relative">
                    <Button icon="pi pi-bell" text rounded severity="secondary" className="!w-10 !h-10  text-gray-600 dark:text-gray-300" />
                    <Badge value="3" severity="danger" className="absolute top-1 right-1" />
                </div>
                {/* Settings Button triggers the menu */}
                <Button
                    icon="pi pi-cog"
                    pt={{ root: { className: "!w-10 !h-10 text-gray-600 dark:text-gray-300 flex items-center justify-center" } }}
                    text
                    rounded
                    severity="secondary"
                    onClick={(event) => menuRight.current.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                />
            </div>
        </header>
    );
};

export default Navbar;