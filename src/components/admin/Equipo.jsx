import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Mail, Phone, Briefcase, Award } from 'lucide-react';
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

    const fetchData = async () => {
        try {
            const [resAsesores, resLeads] = await Promise.all([
                fetch('http://localhost:8080/api/asesores'),
                fetch('http://localhost:8080/api/leads')
            ]);

            if (resAsesores.ok) {
                const data = await resAsesores.json();
                // Solo actualizamos si data es realmente un array
                setAsesores(Array.isArray(data) ? data : []);
            }
            setLeads(await resLeads.json());
        } catch (error) {
            console.error("Error cargando datos:", error);
            setAsesores([]); // Si hay error, dejamos la lista vacía para que no explote .map()
        }
    };
    useEffect(() => { fetchData(); }, []);

    // --- CÁLCULO DE ESTADÍSTICAS EN TIEMPO REAL ---
    const getStats = (asesorId) => {
        // Si no hay leads o el asesorId es nulo, devolvemos valores en cero
        if (!leads || !asesorId) return { total: 0, ventas: 0 };

        const asignados = leads.filter(l => l.asesor?.id === asesorId);
        const ventas = asignados.filter(l => l.estado === 'APROBADA').length;
        return { total: asignados.length, ventas };
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
                // Limpiamos el formulario
                setNuevoAsesor({ nombre: '', cargo: '', email: '', telefono: '' });
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    };

    const eliminarAsesor = async (id) => {
        if (!window.confirm("¿Eliminar asesor? Los leads asignados a él quedarán huérfanos.")) return;
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

                    {/* Header */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mi Equipo</h1>
                            <p className="text-slate-500 font-medium mt-2">Rendimiento y gestión de asesores comerciales</p>
                        </div>
                        <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-orange-200">
                            <Users size={20} /> {asesores.length} Asesores Activos
                        </div>
                    </div>

                    {/* Formulario de Registro con nuevos campos */}
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

                    {/* Grid de Asesores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {asesores.map(asesor => {
                            const { total, ventas } = getStats(asesor.id);
                            return (
                                <div key={asesor.id} className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50 relative group transition-all hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-orange-50" />

                                    <div className="relative">
                                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
                                            <Briefcase size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900">{asesor.nombre || "Sin nombre"}</h3>
                                        <p className="text-orange-500 font-bold text-sm mb-6">{asesor.cargo || "Asesor"}</p>

                                        {/* Estadísticas */}
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 mb-1"><Users size={14}/> <span className="text-[10px] font-black uppercase">Asignados</span></div>
                                                <div className="text-2xl font-black text-slate-900">{total}</div>
                                            </div>
                                            <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
                                                <div className="flex items-center gap-2 text-orange-400 mb-1"><Award size={14}/> <span className="text-[10px] font-black uppercase">Ventas</span></div>
                                                <div className="text-2xl font-black text-orange-600">{ventas}</div>
                                            </div>
                                        </div>

                                        {/* Información de contacto */}
                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold truncate">
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Mail size={14}/></div>
                                                {asesor.email}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold">
                                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Phone size={14}/></div>
                                                {asesor.telefono}
                                            </div>
                                        </div>

                                        <button onClick={() => eliminarAsesor(asesor.id)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                            <Trash2 size={18} /> ELIMINAR ASESOR
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
