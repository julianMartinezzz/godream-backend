import React, { useEffect, useState } from 'react';
import { Users, RefreshCw, MessageCircle, Search, CheckCircle2, LogOut, Clock, Trash2, X, Save, FileDown, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Importante: instala con npm install xlsx

const Admin = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroPlan, setFiltroPlan] = useState('Todos');

    // Estados para el Panel Lateral de Notas
    const [leadSeleccionado, setLeadSeleccionado] = useState(null);
    const [notaTemporal, setNotaTemporal] = useState('');

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/leads');
            const data = await response.json();
            const sortedData = [...data].reverse();
            setLeads(sortedData);
        } catch (error) {
            console.error("Error cargando leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeads(); }, []);

    // Lógica combinada de Búsqueda y Filtro por Plan
    useEffect(() => {
        let results = leads.filter(lead =>
            lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.telefono.includes(searchTerm)
        );

        if (filtroPlan !== 'Todos') {
            results = results.filter(lead => lead.plan.includes(filtroPlan));
        }

        setFilteredLeads(results);
    }, [searchTerm, leads, filtroPlan]);

    const eliminarLead = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este lead? Esta acción no se puede deshacer.")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/leads/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setLeads(leads.filter(lead => lead.id !== id));
                if (leadSeleccionado?.id === id) setLeadSeleccionado(null);
            }
        } catch (error) {
            alert("Error al eliminar.");
        }
    };

    const guardarNotas = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/leads/${leadSeleccionado.id}/notas`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notas: notaTemporal })
            });

            if (response.ok) {
                setLeads(leads.map(l => l.id === leadSeleccionado.id ? { ...l, notas: notaTemporal } : l));
                alert("Nota guardada correctamente");
            }
        } catch (error) {
            alert("Error al guardar nota.");
        }
    };

    const exportarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leads GoDream");
        XLSX.writeFile(workbook, "Leads_GoDream_Reporte.xlsx");
    };

    const toggleEstado = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'CONTESTADO' ? 'NUEVO' : 'CONTESTADO';
        try {
            const response = await fetch(`http://localhost:8080/api/leads/${id}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (response.ok) {
                setLeads(leads.map(lead => lead.id === id ? { ...lead, estado: nuevoEstado } : lead));
            }
        } catch (error) {
            alert("Error al cambiar estado.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans relative overflow-hidden">
            <div className={`p-4 md:p-10 transition-all duration-500 ${leadSeleccionado ? 'mr-96 opacity-50 pointer-events-none' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-godream-orange rounded-3xl shadow-lg">
                                <Users className="text-white w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">Panel Pro</h1>
                                <p className="text-slate-500 font-medium">Gestión avanzada de clientes</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button onClick={exportarExcel} className="flex items-center gap-2 px-4 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-md active:scale-95">
                                <FileDown className="w-5 h-5" /> <span className="hidden lg:inline">Exportar</span>
                            </button>

                            <select
                                value={filtroPlan}
                                onChange={(e) => setFiltroPlan(e.target.value)}
                                className="px-4 py-4 bg-white border-none rounded-2xl shadow-sm outline-none text-slate-600 font-bold focus:ring-2 focus:ring-orange-100"
                            >
                                <option value="Todos">Todos los Planes</option>
                                <option value="Esencial">Plan Esencial</option>
                                <option value="Pro">Plan Pro</option>
                            </select>

                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input type="text" placeholder="Buscar..." className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>

                            <Link to="/" className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg">
                                <LogOut className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-50">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                                <th className="p-8">Estado</th>
                                <th className="p-8">Cliente</th>
                                <th className="p-8">Plan / Estrato</th>
                                <th className="p-8 text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setLeadSeleccionado(lead); setNotaTemporal(lead.notas || ''); }}>
                                    <td className="p-8">
                                        <div className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full font-black text-[10px] ${lead.estado === 'CONTESTADO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {lead.estado === 'CONTESTADO' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            {lead.estado}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-black text-slate-900">{lead.nombre}</div>
                                        <div className="text-slate-400 text-sm">{lead.telefono}</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="text-slate-700 font-bold text-sm">{lead.plan}</div>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black">ESTRATO {lead.estrato}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => toggleEstado(lead.id, lead.estado)} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-orange-500 transition-all">
                                                <RefreshCw className="w-5 h-5 text-slate-400" />
                                            </button>
                                            <button onClick={() => eliminarLead(lead.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PANEL LATERAL DE NOTAS */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-in-out ${leadSeleccionado ? 'translate-x-0' : 'translate-x-full'}`}>
                {leadSeleccionado && (
                    <div className="p-8 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{leadSeleccionado.nombre}</h2>
                                <p className="text-slate-500 font-medium">Gestión de prospecto</p>
                            </div>
                            <button onClick={() => setLeadSeleccionado(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                                <X className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                            <div className="bg-orange-50 p-6 rounded-[30px] border border-orange-100">
                                <h3 className="text-orange-800 font-black text-xs uppercase tracking-widest mb-4">Detalles del interés</h3>
                                <div className="space-y-3 text-sm text-orange-900/70">
                                    <p><strong>Plan:</strong> {leadSeleccionado.plan}</p>
                                    <p><strong>Email:</strong> {leadSeleccionado.email}</p>
                                    <p><strong>Teléfono:</strong> {leadSeleccionado.telefono}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-slate-900 font-black text-sm">Notas del asesor</label>
                                <textarea
                                    className="w-full h-64 p-4 bg-slate-50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-orange-200 transition-all text-slate-700 resize-none"
                                    placeholder="Escribe aquí el seguimiento de la llamada..."
                                    value={notaTemporal}
                                    onChange={(e) => setNotaTemporal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={guardarNotas} className="flex-1 bg-godream-orange text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">
                                <Save className="w-5 h-5" /> GUARDAR NOTAS
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;