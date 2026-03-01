import React, { useEffect, useState } from 'react';
import { Search, MessageSquare, Phone, Mail, User, Trash2, Edit3 } from 'lucide-react';
import Sidebar from './Sidebar'; // Importación corregida para archivos en la misma carpeta

const GestionLeads = () => {
    const [leads, setLeads] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const fetchLeads = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error cargando leads:", error);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const abrirWhatsApp = (lead) => {
        if (!lead || !lead.telefono) return alert("Sin teléfono");
        const num = lead.telefono.replace(/\D/g, '');
        const msj = `Hola ${lead.nombre}, te hablamos de GoDream sobre tu plan ${lead.plan || ''}.`;
        window.open(`https://wa.me/57${num}?text=${encodeURIComponent(msj)}`, '_blank');
    };

    const eliminarLead = async (id) => {
        if (window.confirm("¿Eliminar lead?")) {
            await fetch(`http://localhost:8080/api/leads/${id}`, { method: 'DELETE' });
            fetchLeads();
        }
    };

    // Filtro seguro (evita errores si lead.nombre es null)
    const leadsFiltrados = leads.filter(l =>
        (l.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 ml-64 p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Leads</h1>
                        <div className="relative w-96">
                            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                            <input
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-slate-100 outline-none focus:border-orange-500 shadow-sm"
                                placeholder="Buscar cliente..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-widest font-black">
                            <tr>
                                <th className="p-6">Cliente</th>
                                <th className="p-6">Plan</th>
                                <th className="p-6 text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {leadsFiltrados.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-all">
                                    <td className="p-6">
                                        <div className="font-black text-slate-900 text-lg">{lead.nombre}</div>
                                        <div className="text-slate-400 text-xs font-bold uppercase">{lead.telefono}</div>
                                    </td>
                                    <td className="p-6 text-sm font-bold text-slate-600">{lead.plan}</td>
                                    <td className="p-6">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => abrirWhatsApp(lead)}
                                                className="w-11 h-11 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 shadow-lg"
                                            >
                                                <MessageSquare size={20} />
                                            </button>
                                            <button
                                                onClick={() => eliminarLead(lead.id)}
                                                className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GestionLeads;