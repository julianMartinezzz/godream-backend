export default function VentasList() {
    const VENTAS = [
        { cliente: 'Fernando Díaz', plan: '1 Gbps', monto: '$49/mes', estado: 'Activa', color: 'text-green-600 bg-green-50', vendedor: 'Ana García', comisión: '$15', fecha: '2026-02-28', inicial: 'F' },
        { cliente: 'Sofia Moreno', plan: '500 Mbps', monto: '$29/mes', estado: 'Activa', color: 'text-green-600 bg-green-50', vendedor: 'Ana García', comisión: '$8', fecha: '2026-02-27', inicial: 'S' },
        { cliente: 'Diego Romero', plan: '1 Gbps', monto: '$49/mes', estado: 'Activa', color: 'text-green-600 bg-green-50', vendedor: 'Carlos Mendoza', comisión: '$15', fecha: '2026-02-25', inicial: 'D' },
        { cliente: 'Valentina Cruz', plan: '500 Mbps', monto: '$29/mes', estado: 'Pendiente', color: 'text-amber-600 bg-amber-50', vendedor: 'Ana García', comisión: '$8', fecha: '2026-02-24', inicial: 'V' },
        { cliente: 'Alejandro Vega', plan: '1 Gbps', monto: '$49/mes', estado: 'Activa', color: 'text-green-600 bg-green-50', vendedor: 'Carlos Mendoza', comisión: '$15', fecha: '2026-02-22', inicial: 'A' },
        { cliente: 'Camila Herrera', plan: '500 Mbps', monto: '$29/mes', estado: 'Cancelada', color: 'text-red-600 bg-red-50', vendedor: 'Ana García', comisión: '—', fecha: '2026-02-20', inicial: 'C' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Título y Buscador */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Ventas</h2>
                    <p className="text-slate-400 text-sm font-medium">{VENTAS.length} ventas registradas</p>
                </div>
                <div className="relative">
                    <input type="text" placeholder="Buscar venta..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 w-72" />
                    <span className="absolute left-4 top-3 text-slate-400">🔍</span>
                </div>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase mb-2">Ventas activas</p>
                    <p className="text-4xl font-black text-slate-900">6</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase mb-2">Ingresos mensuales</p>
                    <p className="text-4xl font-black text-slate-900">$274</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase mb-2">Comisiones generadas</p>
                    <p className="text-4xl font-black text-slate-900">$91</p>
                </div>
            </div>

            {/* Tabla de Ventas */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-50">
                    <tr>
                        <th className="px-8 py-5">Cliente</th>
                        <th className="px-8 py-5">Plan</th>
                        <th className="px-8 py-5">Monto</th>
                        <th className="px-8 py-5">Estado</th>
                        <th className="px-8 py-5">Vendedor</th>
                        <th className="px-8 py-5">Comisión</th>
                        <th className="px-8 py-5 text-right">Fecha</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {VENTAS.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{v.inicial}</div>
                                <span className="font-bold text-slate-800">{v.cliente}</span>
                            </td>
                            <td className="px-8 py-5 font-bold text-slate-900">
                                <span className="bg-slate-100 px-3 py-1 rounded-lg">{v.plan}</span>
                            </td>
                            <td className="px-8 py-5 font-black text-slate-900">{v.monto}</td>
                            <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${v.color}`}>
                    {v.estado}
                  </span>
                            </td>
                            <td className="px-8 py-5 text-slate-500 font-medium">{v.vendedor}</td>
                            <td className="px-8 py-5 font-black text-emerald-600">{v.comisión}</td>
                            <td className="px-8 py-5 text-right text-slate-400 font-medium">{v.fecha}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}