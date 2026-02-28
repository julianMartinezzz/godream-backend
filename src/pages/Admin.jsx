import React, { useEffect, useState } from 'react';
import { Users, RefreshCw, Search, Trash2, X, Save, UserCheck } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';

const Admin = () => {
    const [leads, setLeads] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroPlan, setFiltroPlan] = useState('Todos');

    const [leadSeleccionado, setLeadSeleccionado] = useState(null);
    const [notaTemporal, setNotaTemporal] = useState('');
    const [guardandoNota, setGuardandoNota] = useState(false);

    // Definición de estados para el flujo completo
    const ESTADOS = [
        { id: 'NUEVO', label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
        { id: 'CONTESTADO', label: 'Contestado', color: 'bg-purple-100 text-purple-700' },
        { id: 'PENDIENTE_INSTALACION', label: 'Pendiente Inst.', color: 'bg-orange-100 text-orange-700' },
        { id: 'INSTALADA', label: 'Instalada ✅', color: 'bg-green-100 text-green-700' },
        { id: 'CANCELADA', label: 'Cancelada ❌', color: 'bg-red-100 text-red-700' }
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resLeads, resAsesores] = await Promise.all([
                fetch('http://localhost:8080/api/leads'),
                fetch('http://localhost:8080/api/asesores')
            ]);
            const dataLeads = await resLeads.json();
            const dataAsesores = await resAsesores.json();

            setLeads([...dataLeads].reverse());
            setAsesores(dataAsesores);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        let results = leads.filter(lead =>
            lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.telefono.includes(searchTerm)
        );
        if (filtroPlan !== 'Todos') {
            results = results.filter(lead => lead.plan?.includes(filtroPlan));
        }
        setFilteredLeads(results);
    }, [searchTerm, leads, filtroPlan]);

    const asignarAsesor = async (leadId, asesorId) => {
        if (!asesorId) return;
        try {
            const response = await fetch(`http://localhost:8080/api/leads/${leadId}/asignar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asesorId: parseInt(asesorId) })
            });
            if (response.ok) {
                const leadActualizado = await response.json();
                setLeads(leads.map(l => l.id === leadId ? leadActualizado : l));
            }
        } catch (error) {
            alert("Error al asignar asesor");
        }
    };

    const guardarNotas = async () => {
        if (!leadSeleccionado) return;
        setGuardandoNota(true);
        try {
            const res = await fetch(`http://localhost:8080/api/leads/${leadSeleccionado.id}/notas`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notas: notaTemporal })
            });
            if (res.ok) {
                const leadActualizado = await res.json();
                setLeads(leads.map(l => l.id === leadSeleccionado.id ? leadActualizado : l));
                setLeadSeleccionado(leadActualizado);
                alert("Notas guardadas con éxito");
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        } finally {
            setGuardandoNota(false);
        }
    };

    const eliminarLead = async (id) => {
        if (!window.confirm("¿Eliminar este lead definitivamente?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/leads/${id}`, { method: 'DELETE' });
            if (res.ok) setLeads(leads.filter(l => l.id !== id));
        } catch (error) { alert("Error al eliminar"); }
    };

    // Nueva función para cambiar a cualquier estado
    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            const res = await fetch(`http://localhost:8080/api/leads/${id}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (res.ok) {
                const leadActualizado = await res.json();
                setLeads(leads.map(l => l.id === id ? leadActualizado : l));
            }
        } catch (error) { alert("Error al cambiar estado"); }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <main className={`flex-1 ml-64 p-10 transition-all ${leadSeleccionado ? 'pr-96 opacity-40' : ''}`}>
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl"><Users /></div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">Gestión de Leads</h1>
                                <p className="text-slate-500 font-medium">Control de Instalaciones y Pagos</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    className="pl-12 pr-4 py-4 bg-white rounded-2xl outline-none shadow-sm w-80 border border-transparent focus:border-orange-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                            <tr>
                                <th className="p-8 text-white">Cliente / Plan</th>
                                <th className="p-8 text-white">Asignar Asesor</th>
                                <th className="p-8 text-white">Estado de Venta</th>
                                <th className="p-8 text-center text-white">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {filteredLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        setLeadSeleccionado(lead);
                                        setNotaTemporal(lead.notas || '');
                                    }}
                                >
                                    <td className="p-8">
                                        <div className="font-black text-slate-900">{lead.nombre}</div>
                                        <div className="text-orange-500 text-xs font-bold">{lead.plan || 'Sin plan'}</div>
                                    </td>

                                    <td className="p-8" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <UserCheck className={`w-4 h-4 ${lead.asesor ? 'text-orange-500' : 'text-slate-300'}`} />
                                            <select
                                                className="bg-slate-100 border-none rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                                value={lead.asesor?.id || ""}
                                                onChange={(e) => asignarAsesor(lead.id, e.target.value)}
                                            >
                                                <option value="">Sin asignar</option>
                                                {asesores.map(as => (
                                                    <option key={as.id} value={as.id}>{as.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>

                                    <td className="p-8" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            className={`px-3 py-2 rounded-xl font-black text-[10px] uppercase outline-none border-none ${ESTADOS.find(e => e.id === lead.estado)?.color || 'bg-slate-100 text-slate-700'}`}
                                            value={lead.estado}
                                            onChange={(e) => cambiarEstado(lead.id, e.target.value)}
                                        >
                                            {ESTADOS.map(est => (
                                                <option key={est.id} value={est.id} className="bg-white text-slate-900 font-sans">{est.label}</option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="p-8 flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => eliminarLead(lead.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* PANEL LATERAL (DISEÑO ORIGINAL) */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${leadSeleccionado ? 'translate-x-0' : 'translate-x-full'}`}>
                {leadSeleccionado && (
                    <div className="p-8 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 leading-tight">{leadSeleccionado.nombre}</h2>
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Detalles del Lead</span>
                            </div>
                            <button onClick={() => setLeadSeleccionado(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"><X /></button>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[32px] mb-6 text-sm border border-slate-100 shadow-inner">
                            <div className="space-y-3">
                                <p className="text-slate-600 flex justify-between"><strong>📞 Teléfono:</strong> {leadSeleccionado.telefono}</p>
                                <p className="text-slate-600 flex justify-between"><strong>📧 Email:</strong> {leadSeleccionado.email}</p>
                                <p className="text-slate-600 flex justify-between"><strong>🏷️ Plan:</strong> {leadSeleccionado.plan}</p>
                                <p className="text-slate-600 flex justify-between"><strong>🏠 Estrato:</strong> {leadSeleccionado.estrato}</p>
                            </div>
                            <hr className="my-5 border-slate-200" />
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Asesor Responsable</p>
                                <p className="text-slate-900 font-black text-lg">{leadSeleccionado.asesor?.nombre || "Nadie asignado"}</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Bitácora de Seguimiento</label>
                            <textarea
                                className="flex-1 w-full p-6 bg-slate-50 rounded-[32px] outline-none border-2 border-transparent focus:border-orange-200 focus:bg-white transition-all resize-none text-slate-700 font-medium leading-relaxed"
                                placeholder="Escribe aquí los avances de la llamada..."
                                value={notaTemporal}
                                onChange={(e) => setNotaTemporal(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={guardarNotas}
                            disabled={guardandoNota}
                            className={`mt-6 w-full py-5 rounded-[24px] font-black flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all ${guardandoNota ? 'bg-slate-400' : 'bg-orange-500 hover:bg-slate-900 text-white active:scale-95'}`}
                        >
                            {guardandoNota ? <RefreshCw className="animate-spin" /> : <Save />}
                            {guardandoNota ? "GUARDANDO..." : "GUARDAR NOTAS"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;