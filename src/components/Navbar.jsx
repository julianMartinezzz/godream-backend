import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, X } from 'lucide-react';
import miLogo from '../assets/fibraa.png';

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleAdminAccess = (e) => {
        e.preventDefault();
        // Validación con tu nueva clave
        if (password === 'Jmm1205*') {
            setShowLogin(false);
            setPassword('');
            navigate('/admin');
        } else {
            alert('Clave de administrador incorrecta');
            setPassword('');
        }
    };

    return (
        <nav className="flex items-center justify-between py-4 px-4 md:px-0 bg-godream-bg relative">

            {/* LOGO */}
            <div className="flex items-center ml-4 md:ml-8">
                <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
                    <img src={miLogo} alt="GoDream Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* ENLACES Y ACCIONES */}
            <div className="flex items-center gap-6 md:gap-10 mr-4 md:mr-12">
                <div className="hidden md:flex items-center gap-8 font-bold text-slate-600">
                    <a href="#beneficios" className="hover:text-godream-orange transition-colors">Beneficios</a>
                    <a href="#planes" className="hover:text-godream-orange transition-colors">Planes</a>
                </div>

                <div className="flex items-center gap-4">
                    <a href="#contacto" className="bg-godream-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-200">
                        Contratar ahora
                    </a>

                    {/* Botón de Usuario / Admin */}
                    <button
                        onClick={() => setShowLogin(!showLogin)}
                        className={`flex items-center justify-center p-2.5 rounded-xl transition-all border ${showLogin ? 'bg-godream-orange text-white border-godream-orange' : 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200 hover:text-godream-orange'}`}
                    >
                        {showLogin ? <X className="w-6 h-6" /> : <User className="w-6 h-6" strokeWidth={2.5} />}
                    </button>
                </div>
            </div>

            {/* CUADRO DE CLAVE FLOTANTE */}
            {showLogin && (
                <div className="absolute top-28 right-4 md:right-12 bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-50 w-72 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-black">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Lock className="w-4 h-4 text-godream-orange" />
                        </div>
                        <span>Acceso Admin</span>
                    </div>

                    <form onSubmit={handleAdminAccess} className="flex flex-col gap-3">
                        <input
                            type="password"
                            placeholder="Introduce la contraseña"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-godream-orange focus:ring-2 focus:ring-orange-100 text-slate-900 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-godream-orange transition-all shadow-lg hover:shadow-orange-200"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            )}
        </nav>
    );
};

export default Navbar;