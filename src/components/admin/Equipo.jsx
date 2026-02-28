import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Mail, Phone, Briefcase, Award, DollarSign, Calendar } from 'lucide-react';
import Sidebar from './Sidebar';

const Equipo = () => {
    const [asesores, setAsesores] = useState([]);
    const [leads, setLeads] = useState([]);
    const [nuevoAsesor, setNuevoAsesor] = useState({
        nombre: '',
        cargo: '',
        email: '',
        telefono: ''
    });

    // --- ESTADO PARA FILTRO DE MES Y AÑO ---
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

    const MESES = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const fetchData = async () => {
        try {
            const [resAsesores, resLeads] = await Promise.all([
                fetch('http://localhost:8080/api/asesores'),
                fetch('http://localhost:8080/api/leads')
            ]);

            if (resAsesores.ok) {
                const data = await resAsesores.json();
                setAsesores(Array.isArray(data) ? data : []);
            }
            if (resLeads.ok) {
                setLeads(await resLeads.json());
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
            setAsesores([]);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- LÓGICA DE ESTADÍSTICAS FILTRADAS POR MES ---
    const getStats = (asesorId) => {
        if (!leads || !asesorId) return { total: 0, ventas: 0, dinero: 0 };

        // 1. Filtrar leads asignados creados en este mes
        const asignadosMes = leads.filter(l => {
            if (!l.asesor || String(l.asesor.id) !== String(asesorId)) return false;
            const fechaC = new Date(l.fechaCreacion);
            return fechaC.getMonth() === mesSeleccionado && fechaC.getFullYear() === anioSeleccionado;
        });

        // 2. Filtrar solo los INSTALADOS en este mes específico (usando la nueva fechaInstalacion)
        const instaladasMes = leads.filter(l => {
            if (!l.asesor || String(l.asesor.id) !== String(asesorId)) return false;
            if (l.estado !== 'INSTALADA' || !l.fechaInstalacion) return false;

            const fechaI = new Date(l.fechaInstalacion);
            return fechaI.getMonth() === mesSeleccionado && fechaI.getFullYear() === anioSeleccionado;
        });

        // 3. Calcular dinero del periodo
        const dineroAcumulado = instaladasMes.reduce((total, lead) => {
            const planTexto = (lead.plan || "").toLowerCase();
            if (planTexto.includes('1')) return total + 89900;
            if (planTexto.includes('5')) return total + 79000;
            return total;
        }, 0);

        return {
            total: asignadosMes.length,
            ventas: instaladasMes.length,
            dinero: dineroAcumulado
        };
    };

    const agregarAsesor = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/asesores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoAsesor)
            });
            if (res.ok) {
                fetchData();
                setNuevoAsesor({ nombre: '', cargo: '', email: '', telefono: '' });
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    };

    const eliminarAsesor = async (id) => {
        if (!window.confirm("¿Eliminar asesor?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/asesores/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                <div className="max-w-7xl mx-auto">

                    {/* Header con Selector de Mes */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mi Equipo</h1>
                            <p className="text-slate-500 font-medium mt-2">Rendimiento en {MESES[mesSeleccionado]} {anioSeleccionado}</p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                                <Calendar size={18} className="text-slate-400 ml-2" />
                                <select
                                    value={mesSeleccionado}
                                    onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
                                    className="bg-transparent border-none py-2 pr-8 font-bold text-slate-700 outline-none cursor-pointer"
                                >
                                    {MESES.map((mes, index) => (
                                        <option key={mes} value={index}>{mes}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-orange-200">
                                <Users size={20} /> {asesores.length} Activos
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Registro */}
                    <form onSubmit={agregarAsesor} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 mb-12 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[180px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Nombre</label>
                            <input type="text" placeholder="Nombre completo" className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                                   value={nuevoAsesor.nombre} onChange={e => setNuevoAsesor({...nuevoAsesor, nombre: e.target.value})} required />
                        </div>
                        <div className="flex-1 min-w-[180px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Cargo</label>
                            <input type="text" placeholder="Cargo u ocupación" className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                                   value={nuevoAsesor.cargo} onChange={e => setNuevoAsesor({...nuevoAsesor, cargo: e.target.value})} required />
                        </div>
                        <div className="flex-1 min-w-[180px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Email</label>
                            <input type="email" placeholder="correo@ejemplo.com" className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                                   value={nuevoAsesor.email} onChange={e => setNuevoAsesor({...nuevoAsesor, email: e.target.value})} required />
                        </div>
                        <div className="flex-1 min-w-[180px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Teléfono</label>
                            <input type="text" placeholder="Celular / WhatsApp" className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                                   value={nuevoAsesor.telefono} onChange={e => setNuevoAsesor({...nuevoAsesor, telefono: e.target.value})} required />
                        </div>
                        <button type="submit" className="bg-slate-900 text-white p-4 rounded-2xl font-black flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md shadow-slate-200">
                            <UserPlus size={20}/> REGISTRAR
                        </button>
                    </form>

                    {/* Tarjetas de Asesores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {asesores.map(asesor => {
                            const { total, ventas, dinero } = getStats(asesor.id);
                            return (
                                <div key={asesor.id} className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50 relative group transition-all hover:-translate-y-1 overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
                                            <Briefcase size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900">{asesor.nombre}</h3>
                                        <p className="text-orange-500 font-bold text-sm mb-6">{asesor.cargo}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                                                <div className="flex items-center justify-center gap-2 text-slate-400 mb-1 font-black text-[9px] uppercase"><Users size={12}/> Asignados</div>
                                                <div className="text-2xl font-black text-slate-900">{total}</div>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-3xl border border-green-100 text-center">
                                                <div className="flex items-center justify-center gap-2 text-green-500 mb-1 font-black text-[9px] uppercase"><Award size={12}/> Instaladas</div>
                                                <div className="text-2xl font-black text-green-600">{ventas}</div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 p-5 rounded-[24px] mb-8 shadow-inner relative overflow-hidden">
                                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                                <DollarSign size={14} className="text-orange-500" />
                                                <span className="text-[10px] font-black uppercase tracking-wider">Comisión Mes</span>
                                            </div>
                                            <div className="text-2xl font-black text-white">
                                                $ {dinero.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold truncate italic">
                                                <Mail size={14} className="text-slate-300"/> {asesor.email}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold">
                                                <Phone size={14} className="text-slate-300"/> {asesor.telefono}
                                            </div>
                                        </div>

                                        <button onClick={() => eliminarAsesor(asesor.id)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                            <Trash2 size={18} /> ELIMINAR
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Equipo;