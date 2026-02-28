import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Estilos y Animaciones
import AOS from 'aos';
import 'aos/dist/aos.css';

// Componentes Públicos
import Navbar from './components/public/Navbar.jsx';
import Hero from './components/public/Hero.jsx';
import Features from './components/public/Features.jsx';
import Planes from './components/public/Planes.jsx';
import Contacto from './components/public/Contacto.jsx';
import Footer from './components/public/Footer.jsx';

// Vistas de Administración
import Admin from './pages/Admin.jsx';
import Equipo from './components/admin/Equipo.jsx';
import Liquidacion from './components/admin/Liquidacion.jsx'; // <--- IMPORTACIÓN NUEVA

function App() {
    const [planSeleccionado, setPlanSeleccionado] = useState("");

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-orange-100 overflow-x-hidden">
            <Routes>
                {/* RUTA PRINCIPAL (LANDING PAGE) */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <main className="max-w-7xl mx-auto px-6 md:px-12">
                            <Hero />
                            <section id="planes" className="py-20">
                                <Planes alSeleccionarPlan={setPlanSeleccionado} />
                            </section>
                            <Features />
                            <section id="contacto" className="py-12">
                                <Contacto planPredefinido={planSeleccionado} />
                            </section>
                        </main>
                        <Footer />
                    </>
                } />

                {/* RUTAS DE ADMINISTRACIÓN (PLANAS) */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/equipo" element={<Equipo />} />

                {/* NUEVA RUTA DE LIQUIDACIÓN Y PAGOS */}
                <Route path="/admin/liquidacion" element={<Liquidacion />} />

                {/* MANEJO DE ERRORES 404 */}
                <Route path="*" element={
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <h1 className="text-4xl font-black text-slate-900">404 - No encontrado</h1>
                        <p className="text-slate-500 mt-2 font-medium">La página que buscas no existe o ha sido movida.</p>
                        <a href="/" className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black mt-6 hover:bg-slate-900 transition-all">
                            VOLVER AL INICIO
                        </a>
                    </div>
                } />
            </Routes>
        </div>
    );
}

export default App;