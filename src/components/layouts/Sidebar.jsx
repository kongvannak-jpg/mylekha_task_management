import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar } from 'primereact/avatar';
import { MENU_ITEMS, ACCOUNT_ITEMS } from '../../data/menuData';
const MenuItem = ({ item, isChild = false, collapsed, onLinkClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const active = location.pathname === item.path;

    const baseClass = `w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 border-l-4`;
    const activeClass = `bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold border-emerald-500`;
    const inactiveClass = `border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 font-medium`;
    const childClass = `pl-12 text-sm py-2`;

    return (
        <button
            onClick={() => {
                navigate(item.path);
                if (onLinkClick && window.innerWidth < 1024) onLinkClick();
            }}
            className={`${baseClass} ${isChild ? childClass : ''} ${active ? activeClass : inactiveClass} ${collapsed ? 'justify-center px-0 border-none' : ''}`}
            title={collapsed ? item.label : ''}
        >
            {item.icon && <i className={`${item.icon} ${collapsed ? 'text-xl' : 'text-lg'}`}></i>}
            {!collapsed && <span>{item.label}</span>}
        </button>
    );
};

const MenuDropdown = ({ label, icon, children, collapsed, isOpen, onToggle }) => {
    return (
        <div className="flex flex-col">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-l-4 border-transparent ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? label : ''}
            >
                <div className="flex items-center gap-3">
                    <i className={`${icon} ${collapsed ? 'text-xl' : 'text-lg'}`}></i>
                    {!collapsed && <span className="font-medium">{label}</span>}
                </div>
                {!collapsed && (
                    <i className={`pi pi-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
                )}
            </button>
            {!collapsed && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Sidebar Component ---
const Sidebar = ({ collapsed, onLinkClick }) => {
    const { t } = useTranslation();
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (key) => {
        if (collapsed) return;
        setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const renderMenu = (items) => {
        return items.map((item) => {
            if (item.children) {
                return (
                    <MenuDropdown
                        key={item.key}
                        label={t(item.label)}
                        icon={item.icon}
                        collapsed={collapsed}
                        isOpen={expandedMenus[item.key]}
                        onToggle={() => toggleMenu(item.key)}
                    >
                        {item.children.map(child => (
                            <MenuItem
                                key={child.key}
                                item={{ ...child, label: t(child.label) }}
                                isChild
                                collapsed={collapsed}
                                onLinkClick={onLinkClick}
                            />
                        ))}
                    </MenuDropdown>
                );
            }
            return (
                <MenuItem
                    key={item.key}
                    item={{ ...item, label: t(item.label) }}
                    collapsed={collapsed}
                    onLinkClick={onLinkClick}
                />
            );
        });
    };

    return (
        <aside className="flex flex-col w-full h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-colors duration-300">
            {/* Logo Area */}
            <div className={`h-16 flex items-center px-6 border-b border-gray-50 dark:border-slate-700 ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                {!collapsed && <span className="font-bold text-xl text-slate-800 dark:text-slate-400 tracking-tight">MyLekha</span>}
            </div>

            {/* Menu Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-6">
                <nav className="space-y-1">
                    {renderMenu(MENU_ITEMS)}
                </nav>
                <div className="mt-8">
                    {!collapsed && (
                        <p className="px-6 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {t('account_pages')}
                        </p>
                    )}
                    <nav className="space-y-1">
                        {renderMenu(ACCOUNT_ITEMS)}
                    </nav>
                </div>
            </div>

            {/* User Profile */}
            <div className={`p-4 border-t border-gray-100 dark:border-slate-700 ${collapsed ? 'flex justify-center' : ''}`}>
                <div className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${!collapsed ? 'hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer' : ''}`}>
                    <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" size="normal" className="border-2 border-white shadow-sm" />
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">Amy Elsner</span>
                            <span className="text-xs text-slate-400">Admin</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;