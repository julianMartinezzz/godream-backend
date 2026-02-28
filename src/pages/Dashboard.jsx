import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- CONFIGURACIÓN DE COLORES Y DATOS ---
const COLORS = ['#FDBA74', '#EA580C'];
const dataVentas = [
    { name: 'Sep', ventas: 12 }, { name: 'Oct', ventas: 18 }, { name: 'Nov', ventas: 15 },
    { name: 'Dic', ventas: 22 }, { name: 'Ene', ventas: 28 }, { name: 'Feb', ventas: 14 },
];
const dataPlanes = [{ name: '500 Mbps', value: 35 }, { name: '1 Gbps', value: 65 }];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            {/* HEADER PRINCIPAL */}
            <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-100">📶</div>
                    <div>
                        <span className="font-black text-slate-900 text-lg">GoDream</span>
                        <span className="text-slate-400 text-sm ml-2 font-medium">Admin</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">Carlos Mendoza</p>
                        <p className="text-xs text-slate-400 font-medium">Admin</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
                {/* BARRA DE NAVEGACIÓN */}
                <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
                    {['Dashboard', 'Leads', 'Ventas', 'Comisiones'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* --- RENDERIZADO CONDICIONAL DE MÓDULOS --- */}

                {/* 1. VISTA DASHBOARD */}
                {activeTab === 'Dashboard' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Leads totales', val: '47', trend: '↑ +12%', color: 'text-green-500', icon: '👥' },
                                { label: 'Ventas del mes', val: '14', trend: '↑ +8%', color: 'text-green-500', icon: '📈' },
                                { label: 'Ingresos', val: '$567', trend: '↑ +15%', color: 'text-green-500', icon: '💰' },
                                { label: 'Comisiones', val: '$106', trend: '↓ -3%', color: 'text-red-500', icon: '🔸' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl p-2 bg-slate-50 rounded-xl">{s.icon}</span>
                                        <span className={`text-xs font-black ${s.color}`}>{s.trend}</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900">{s.val}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                                <h3 className="font-black text-slate-800 mb-8 text-xl">Ventas mensuales</h3>
                                <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={dataVentas}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="ventas" fill="#EA580C" radius={[8, 8, 0, 0]} barSize={45} /></BarChart></ResponsiveContainer></div>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                                <h3 className="font-black text-slate-800 mb-4 text-xl">Distribución de planes</h3>
                                <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dataPlanes} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">{dataPlanes.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. VISTA LEADS */}
                {activeTab === 'Leads' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-black text-slate-900">Potenciales Clientes</h2>
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50">
                                <tr><th className="px-8 py-5">Contacto</th><th className="px-8 py-5">Teléfono</th><th className="px-8 py-5">Estado</th><th className="px-8 py-5">Origen</th><th className="px-8 py-5 text-right">Acción</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {['María López', 'Juan Pérez', 'Ana Martínez'].map((n, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50"><td className="px-8 py-5 font-bold">{n}</td><td className="px-8 py-5 text-slate-500">+1 555-010{i}</td><td className="px-8 py-5"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Nuevo</span></td><td className="px-8 py-5 text-slate-400">Web</td><td className="px-8 py-5 text-right">📞 ✉️</td></tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. VISTA VENTAS */}
                {activeTab === 'Ventas' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center"><p className="text-slate-400 text-xs font-bold uppercase mb-1">Ventas activas</p><p className="text-4xl font-black text-slate-900">6</p></div>
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center"><p className="text-slate-400 text-xs font-bold uppercase mb-1">Ingresos</p><p className="text-4xl font-black text-slate-900">$274</p></div>
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center"><p className="text-slate-400 text-xs font-bold uppercase mb-1">Comisiones</p><p className="text-4xl font-black text-slate-900">$91</p></div>
                        </div>
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50">
                                <tr><th className="px-8 py-5">Cliente</th><th className="px-8 py-5">Monto</th><th className="px-8 py-5">Estado</th><th className="px-8 py-5">Vendedor</th><th className="px-8 py-5 text-right">Comisión</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {[{c:'Fernando Díaz', m:'$49', e:'Activa', v:'Ana García', co:'$15'}, {c:'Diego Romero', m:'$49', e:'Activa', v:'Carlos Mendoza', co:'$15'}].map((v, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50"><td className="px-8 py-5 font-bold">{v.c}</td><td className="px-8 py-5 font-black">{v.m}</td><td className="px-8 py-5"><span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Activa</span></td><td className="px-8 py-5 text-slate-500">{v.v}</td><td className="px-8 py-5 text-right font-black text-emerald-600">{v.co}</td></tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 4. VISTA COMISIONES */}
                {activeTab === 'Comisiones' && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-black text-slate-900">Resumen de comisiones por vendedor</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-orange-600 p-8 rounded-[32px] text-white shadow-xl shadow-orange-100">
                                <p className="font-bold opacity-80 mb-2 uppercase text-xs tracking-widest">Total comisiones pendientes</p>
                                <p className="text-5xl font-black mb-1">$106</p>
                                <p className="text-sm font-medium opacity-90">2 periodos pendientes</p>
                            </div>
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                                <p className="text-slate-400 font-bold mb-2 uppercase text-xs tracking-widest">Total comisiones pagadas</p>
                                <p className="text-5xl font-black text-emerald-500 mb-1">$261</p>
                                <p className="text-sm font-medium text-slate-400">3 periodos pagados</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black border-b border-slate-50">
                                <tr><th className="px-8 py-5">Vendedor</th><th className="px-8 py-5">Periodo</th><th className="px-8 py-5">Ventas</th><th className="px-8 py-5">Total Vendido</th><th className="px-8 py-5">Comisión</th><th className="px-8 py-5 text-right">Estado</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {[
                                    {v:'Ana García', p:'Febrero 2026', s:'5 ventas', t:'$225', c:'$61', e:'Pendiente', ec:'text-amber-600 bg-amber-50'},
                                    {v:'Carlos Mendoza', p:'Febrero 2026', s:'3 ventas', t:'$147', c:'$45', e:'Pendiente', ec:'text-amber-600 bg-amber-50'},
                                    {v:'Ana García', p:'Enero 2026', s:'8 ventas', t:'$352', c:'$96', e:'Pagada', ec:'text-emerald-600 bg-emerald-50'},
                                ].map((com, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="px-8 py-5 font-bold">{com.v}</td>
                                        <td className="px-8 py-5 text-slate-500">{com.p}</td>
                                        <td className="px-8 py-5 text-slate-400 font-medium">{com.s}</td>
                                        <td className="px-8 py-5 font-black text-slate-900">{com.t}</td>
                                        <td className="px-8 py-5 font-black text-orange-600">{com.c}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${com.ec}`}>{com.e}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}