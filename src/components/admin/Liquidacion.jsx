import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle, Clock, XCircle, Wallet, Calendar } from 'lucide-react';
import Sidebar from "./Sidebar";

const Liquidacion = () => {
    const [leads, setLeads] = useState([]);
    const [asesores, setAsesores] = useState([]);

    // ESTADO PARA EL FILTRO DE MES Y AÑO
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

    const PRECIO_500MB = 79000;
    const PRECIO_1GIGA = 89900;

    const MESES = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const fetchData = async () => {
        try {
            const [resL, resA] = await Promise.all([
                fetch('http://localhost:8080/api/leads'),
                fetch('http://localhost:8080/api/asesores')
            ]);
            setLeads(await resL.json());
            setAsesores(await resA.json());
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- FILTRADO POR MES Y AÑO ---
    const leadsDelPeriodo = leads.filter(lead => {
        if (!lead.fechaInstalacion) return false; // Si no hay fecha, no entra en el reporte mensual

        const fecha = new Date(lead.fechaInstalacion);
        return fecha.getMonth() === mesSeleccionado &&
            fecha.getFullYear() === anioSeleccionado;
    });

    const calcularComisionAsesor = (asesorId) => {
        const ventasPeriodo = leadsDelPeriodo.filter(l =>
            l.asesor?.id === asesorId && l.estado === 'INSTALADA'
        );

        return ventasPeriodo.reduce((total, lead) => {
            const planTexto = (lead.plan || "").toLowerCase();
            if (planTexto.includes('1')) return total + PRECIO_1GIGA;
            if (planTexto.includes('5')) return total + PRECIO_500MB;
            return total;
        }, 0);
    };

    const getConteoPorEstado = (estado) => leadsDelPeriodo.filter(l => l.estado === estado).length;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER CON SELECTOR DE MES */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cierre de Caja</h1>
                            <div className="flex items-center gap-2 mt-2 text-slate-500 font-medium">
                                <Calendar size={18} />
                                <span>Periodo: {MESES[mesSeleccionado]} {anioSeleccionado}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            {/* Selector de Mes */}
                            <select
                                value={mesSeleccionado}
                                onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
                                className="bg-white border-2 border-slate-100 p-3 rounded-2xl font-bold text-slate-700 outline-none focus:border-orange-500"
                            >
                                {MESES.map((mes, index) => (
                                    <option key={mes} value={index}>{mes}</option>
                                ))}
                            </select>

                            <div className="bg-green-500 text-white px-8 py-4 rounded-[24px] shadow-lg flex items-center gap-3">
                                <Wallet size={24} />
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-80">Total a Pagar Mes</p>
                                    <p className="text-2xl font-black">
                                        ${asesores.reduce((acc, as) => acc + calcularComisionAsesor(as.id), 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Instalaciones del Mes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 text-green-500 mb-4 font-black uppercase text-xs tracking-widest"><CheckCircle size={20}/> Instaladas</div>
                            <div className="text-4xl font-black text-slate-900">{getConteoPorEstado('INSTALADA')}</div>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 opacity-50">
                            <div className="flex items-center gap-3 text-orange-500 mb-4 font-black uppercase text-xs tracking-widest"><Clock size={20}/> Pendientes</div>
                            <div className="text-4xl font-black text-slate-900">{getConteoPorEstado('PENDIENTE_INSTALACION')}</div>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 opacity-50">
                            <div className="flex items-center gap-3 text-red-500 mb-4 font-black uppercase text-xs tracking-widest"><XCircle size={20}/> Canceladas</div>
                            <div className="text-4xl font-black text-slate-900">{getConteoPorEstado('CANCELADA')}</div>
                        </div>
                    </div>

                    {/* Tabla de Pagos */}
                    <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-widest font-black">
                            <tr>
                                <th className="p-8">Asesor Comercial</th>
                                <th className="p-8 text-center">Ventas Mes</th>
                                <th className="p-8">Planes Instalados</th>
                                <th className="p-8 text-right">Comisión Mes</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {asesores.map(as => {
                                const comision = calcularComisionAsesor(as.id);
                                const instaladas = leadsDelPeriodo.filter(l => l.asesor?.id === as.id && l.estado === 'INSTALADA');
                                if (instaladas.length === 0) return null;

                                return (
                                    <tr key={as.id} className="hover:bg-slate-50 transition-all">
                                        <td className="p-8">
                                            <div className="font-black text-slate-900 text-lg">{as.nombre}</div>
                                            <div className="text-slate-400 text-xs font-bold uppercase">{as.cargo}</div>
                                        </td>
                                        <td className="p-8 text-center font-black text-2xl text-slate-400">{instaladas.length}</td>
                                        <td className="p-8">
                                            <div className="flex flex-wrap gap-2">
                                                {instaladas.map(l => (
                                                    <span key={l.id} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200">{l.plan}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-black text-xl inline-block">
                                                $ {comision.toLocaleString()}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Liquidacion;