import React, { useEffect,状态 } from 'react';
import { DollarSign, CheckCircle, Clock, XCircle, TrendingUp, Wallet } from 'lucide-react';
import Sidebar from "./Sidebar";

const Liquidacion = () => {
    const [leads, setLeads] = React.useState([]);
    const [asesores, setAsesores] = React.useState([]);

    // --- CONFIGURACIÓN DE PRECIOS ---
    const PRECIO_500MB = 79000;
    const PRECIO_1GIGA = 89900;

    const fetchData = async () => {
        try {
            const [resL, resA] = await Promise.all([
                fetch('http://localhost:8080/api/leads'),
                fetch('http://localhost:8080/api/asesores')
            ]);
            setLeads(await resL.json());
            setAsesores(await resA.json());
        } catch (error) {
            console.error("Error cargando datos de liquidación:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Función para calcular cuánto pagar a un asesor específico
    const calcularComisionAsesor = (asesorId) => {
        const ventasInstaladas = leads.filter(l =>
            l.asesor?.id === asesorId && l.estado === 'INSTALADA'
        );

        return ventasInstaladas.reduce((total, lead) => {
            // Lógica basada en el nombre del plan
            if (lead.plan?.includes('1 Giga')) return total + PRECIO_1GIGA;
            if (lead.plan?.includes('500 Megas')) return total + PRECIO_500MB;
            return total; // Si no coincide, no suma (o puedes poner un valor base)
        }, 0);
    };

    const getConteoPorEstado = (estado) => leads.filter(l => l.estado === estado).length;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                <div className="max-w-7xl mx-auto">

                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cierre de Caja</h1>
                            <p className="text-slate-500 font-medium">Liquidación de comisiones por instalaciones exitosas</p>
                        </div>
                        <div className="bg-green-500 text-white px-8 py-4 rounded-[24px] shadow-lg shadow-green-100 flex items-center gap-3">
                            <Wallet size={24} />
                            <div>
                                <p className="text-[10px] font-bold uppercase opacity-80">Total General a Pagar</p>
                                <p className="text-2xl font-black">
                                    ${asesores.reduce((acc, as) => acc + calcularComisionAsesor(as.id), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Instalaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 text-green-500 mb-4 font-black uppercase text-xs tracking-widest">
                                <CheckCircle size={20}/> Instaladas
                            </div>
                            <div className="text-4xl font-black text-slate-900">{getConteoPorEstado('INSTALADA')}</div>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 text-orange-500 mb-4 font-black uppercase text-xs tracking-widest">
                                <Clock size={20}/> Pendientes
                            </div>
                            <div className="text-4xl font-black text-slate-900">{getConteoPorEstado('PENDIENTE_INSTALACION')}</div>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 text-red-500 mb-4 font-black uppercase text-xs tracking-widest">
                                <XCircle size={20}/> Canceladas
                            </div>
                            <div className="text-4xl font-black text-slate-900">{getConteoPorEstado('CANCELADA')}</div>
                        </div>
                    </div>

                    {/* Tabla de Pagos */}
                    <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-widest font-black">
                            <tr>
                                <th className="p-8">Asesor Comercial</th>
                                <th className="p-8 text-center">Ventas OK</th>
                                <th className="p-8">Detalle de Planes</th>
                                <th className="p-8 text-right">Monto a Liquidar</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {asesores.map(as => {
                                const comision = calcularComisionAsesor(as.id);
                                const instaladas = leads.filter(l => l.asesor?.id === as.id && l.estado === 'INSTALADA');

                                if (instaladas.length === 0) return null; // Opcional: ocultar si no tiene ventas

                                return (
                                    <tr key={as.id} className="hover:bg-slate-50 transition-all">
                                        <td className="p-8">
                                            <div className="font-black text-slate-900 text-lg">{as.nombre}</div>
                                            <div className="text-slate-400 text-xs font-bold">{as.cargo}</div>
                                        </td>
                                        <td className="p-8 text-center font-black text-2xl text-slate-400">
                                            {instaladas.length}
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-wrap gap-2">
                                                {instaladas.map(l => (
                                                    <span key={l.id} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200">
                                                            {l.plan}
                                                        </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-black text-xl inline-block border border-green-100">
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