import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    User,
    ClipboardList,
    Settings,
    LogOut,
    MessageSquare,
    Wallet,
    Calendar,
    FileSpreadsheet
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: User, label: 'Gestión de Leads', path: '/admin/leads' },
        { icon: Users, label: 'Equipo Comercial', path: '/admin/equipo' },
        { icon: Wallet, label: 'Liquidación', path: '/admin/liquidacion' },
    ];

    const handleLogout = () => {
        // Aquí podrías limpiar el localStorage si usas auth
        navigate('/');
    };

    return (
        <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white p-6 flex flex-col shadow-2xl z-50">
            {/* Logo o Título */}
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-black tracking-tighter text-orange-500">
                    GoDream<span className="text-white">Admin</span>
                </h1>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold ${
                                isActive
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Botón Cerrar Sesión */}
            <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold"
            >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
            </button>
        </aside>
    );
};

export default Sidebar;