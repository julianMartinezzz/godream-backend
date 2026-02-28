import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, Clock, XCircle, Calculator } from 'lucide-react';
import Sidebar from './Sidebar';

const Liquidacion = () => {
    const [leads, setLeads] = useState([]);
    const [asesores, setAsesores] = useState([]);

    // --- TABLA DE PRECIOS (Configura aquí cuánto pagas por plan) ---
    const COMISIONES = {
        "Plan Bronce": 20000,
        "Plan Plata": 35000,
        "Plan Oro": 50000,
        "Plan Diamante": 80000,
        "Default": 15000 // Por si el plan no coincide
    };

    useEffect(() => {
        const fetchData = async () => {
            const [resL, resA] = await Promise.all([
                fetch('http://localhost:8080/api/leads'),
                fetch('http://localhost:8080/api/asesores')
            ]);
            setLeads(await resL.json());
            setAsesores(await resA.json());
        };
        fetchData();
    }, []);

    const calcularPago = (asesorId) => {
        // Solo pagamos por las que están "INSTALADA"
        const ventasEfectivas = leads.filter(l => l.asesor?.id === asesorId && l.estado === 'INSTALADA');

        return ventasEfectivas.reduce((total, lead) => {
            const pago = COMISIONES[lead.plan] || COMISIONES["Default"];
            return total + pago;
        }, 0);
    };

    const getResumen = (estado) => leads.filter(l => l.estado === estado).length;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                <h1 className="text-3xl font-black text-slate-900 mb-8">Reporte de Ventas y Pagos</h1>

                {/* Tarjetas de Resumen Global */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center gap-3 text-slate-400 mb-2"><CheckCircle size={18}/> <span className="text-xs font-bold uppercase">Instaladas</span></div>
                        <div className="text-3xl font-black text-slate-900">{getResumen('INSTALADA')}</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-orange-400">
                        <div className="flex items-center gap-3 text-slate-400 mb-2"><Clock size={18}/> <span className="text-xs font-bold uppercase">Pendientes</span></div>
                        <div className="text-3xl font-black text-slate-900">{getResumen('PENDIENTE_INSTALACION')}</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-red-500">
                        <div className="flex items-center gap-3 text-slate-400 mb-2"><XCircle size={18}/> <span className="text-xs font-bold uppercase">Canceladas</span></div>
                        <div className="text-3xl font-black text-slate-900">{getResumen('CANCELADA')}</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-lg text-white">
                        <div className="flex items-center gap-3 text-slate-400 mb-2"><DollarSign size={18}/> <span className="text-xs font-bold uppercase">Total a Pagar</span></div>
                        <div className="text-3xl font-black text-orange-500">
                            ${asesores.reduce((acc, as) => acc + calcularPago(as.id), 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Tabla de Liquidación por Asesor */}
                <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-widest font-black">
                        <tr>
                            <th className="p-6">Asesor</th>
                            <th className="p-6">Instaladas</th>
                            <th className="p-6">Pendientes</th>
                            <th className="p-6">Canceladas</th>
                            <th className="p-6">Liquidación (COP)</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {asesores.map(as => (
                            <tr key={as.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-6 font-bold text-slate-900">{as.nombre}</td>
                                <td className="p-6 text-green-600 font-black">{leads.filter(l => l.asesor?.id === as.id && l.estado === 'INSTALADA').length}</td>
                                <td className="p-6 text-orange-500 font-bold">{leads.filter(l => l.asesor?.id === as.id && l.estado === 'PENDIENTE_INSTALACION').length}</td>
                                <td className="p-6 text-red-400">{leads.filter(l => l.asesor?.id === as.id && l.estado === 'CANCELADA').length}</td>
                                <td className="p-6">
                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-black w-fit">
                                        $ {calcularPago(as.id).toLocaleString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Liquidacion;