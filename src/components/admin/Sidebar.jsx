import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Añadimos useNavigate
import {
    LayoutDashboard,
    Users,
    Wallet,
    LogOut,
    BarChart3
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Inicializamos el navegador

    const menuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Gestión Leads', path: '/admin' },
        { icon: <Users size={22} />, label: 'Mi Equipo', path: '/admin/equipo' },
        { icon: <Wallet size={22} />, label: 'Liquidación', path: '/admin/liquidacion' },
    ];

    const handleLogout = () => {
        // Aquí podrías limpiar tokens de sesión si los tuvieras más adelante
        navigate('/'); // Nos manda a la página principal
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 flex flex-col z-40">
            <div className="mb-12 px-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                    <BarChart3 className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-black tracking-tighter uppercase italic">GoDream</h2>
            </div>

            <nav className="flex-1 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-4">Menú Principal</p>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-[24px] font-bold transition-all duration-300 ${
                                isActive
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 translate-x-2'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-800">
                {/* Añadimos el onClick al botón */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-4 rounded-[24px] text-slate-500 font-bold hover:bg-red-500/10 hover:text-red-500 transition-all w-full group"
                >
                    <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;