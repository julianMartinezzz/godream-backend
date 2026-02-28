export default function LeadsList() {
    const ALL_LEADS = [
        { nombre: 'María López', email: 'maria@email.com', tel: '+1 555-0101', plan: '1 Gbps', estado: 'Nuevo', origen: 'Web', fecha: '2026-02-28', color: 'text-blue-600 bg-blue-50', inicial: 'M', colorInicial: 'bg-orange-100 text-orange-700' },
        { nombre: 'Juan Pérez', email: 'juan@email.com', tel: '+1 555-0102', plan: '500 Mbps', estado: 'Contactado', origen: 'Referido', fecha: '2026-02-27', color: 'text-amber-600 bg-amber-50', inicial: 'J', colorInicial: 'bg-orange-50 text-orange-600' },
        { nombre: 'Ana Martínez', email: 'ana@email.com', tel: '+1 555-0103', plan: '1 Gbps', estado: 'Interesado', origen: 'Web', fecha: '2026-02-26', color: 'text-green-600 bg-green-50', inicial: 'A', colorInicial: 'bg-orange-100 text-orange-700' },
        { nombre: 'Carlos García', email: 'carlos@email.com', tel: '+1 555-0104', plan: '500 Mbps', estado: 'Perdido', origen: 'Llamada', fecha: '2026-02-25', color: 'text-red-600 bg-red-50', inicial: 'C', colorInicial: 'bg-orange-50 text-orange-600' },
        { nombre: 'Laura Sánchez', email: 'laura@email.com', tel: '+1 555-0105', plan: '1 Gbps', estado: 'Nuevo', origen: 'Web', fecha: '2026-02-24', color: 'text-blue-600 bg-blue-50', inicial: 'L', colorInicial: 'bg-orange-100 text-orange-700' },
        { nombre: 'Roberto Torres', email: 'roberto@email.com', tel: '+1 555-0106', plan: '500 Mbps', estado: 'Contactado', origen: 'Redes Sociales', fecha: '2026-02-23', color: 'text-amber-600 bg-amber-50', inicial: 'R', colorInicial: 'bg-orange-50 text-orange-600' },
        { nombre: 'Patricia Ruiz', email: 'patricia@email.com', tel: '+1 555-0107', plan: '1 Gbps', estado: 'Interesado', origen: 'Web', fecha: '2026-02-22', color: 'text-green-600 bg-green-50', inicial: 'P', colorInicial: 'bg-orange-100 text-orange-700' },
    ];

    return (
        <div className="space-y-6">
            {/* Encabezado de la sección */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Potenciales Clientes</h2>
                    <p className="text-slate-400 text-sm font-medium">{ALL_LEADS.length} leads en total</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-3 text-slate-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar leads..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
                        ⏳
                    </button>
                </div>
            </div>

            {/* Tabla de Leads */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-50">
                        <tr>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Teléfono</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Origen</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4 text-right">Acción</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {ALL_LEADS.map((lead, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${lead.colorInicial}`}>
                                        {lead.inicial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{lead.nombre}</p>
                                        <p className="text-xs text-slate-400 font-medium">{lead.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{lead.tel}</td>
                                <td className="px-6 py-4"><span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-600 text-[11px]">{lead.plan}</span></td>
                                <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${lead.color}`}>
                      {lead.estado}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{lead.origen}</td>
                                <td className="px-6 py-4 text-slate-400 font-medium">{lead.fecha}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">📞</button>
                                        <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">✉️</button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600">•••</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}