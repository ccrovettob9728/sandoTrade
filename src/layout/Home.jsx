import React from "react";
import ChartComponent from "../componentes/ChartComponent";
import LoginForm from "../componentes/LoginComponent";
import logoNav from "../assets/logo2.png";
import NavBar from "../componentes/NavBar.jsx";
import TestimonialSlider from "../componentes/TestimonialSlider";

export default function Home() {
    return (
        <div className="w-full bg-gray-100 mt-30 flex flex-col items-center p-4 md:p-8">
            <main className="w-full">
                {/* Contenedor principal para las tres secciones superiores */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                    {/* Sección de Login */}
                    <div className="w-full sm:w-1/4 md:w-1/3">
                        <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center h-full">
                            <h2 className="text-xl font-semibold mb-2 text-center">Potencia tu trading con MercadoTrade!</h2>
                            <p className="text-gray-600 text-center my-4">
                                Gracias a la ayuda precisa de nuestra IA, podrás tomar decisiones informadas y mejorar tu rendimiento en el mercado.
                            </p>
                            <div className="mt-auto"> {/* Empuja el formulario hacia abajo */}
                                <LoginForm />
                            </div>
                        </section>
                    </div>

                    {/* Sección del Gráfico */}
                    <div className="w-full ">
                        <div className="bg-white rounded-lg shadow p-6 flex items-center h-full">
                            <div className="w-full">
                                <ChartComponent />
                            </div>
                        </div>
                    </div>

                    {/* Sección de Testimonios y CTA */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between gap-8 h-full">
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4 text-center">Lo que dicen nuestros usuarios</h2>
                                <TestimonialSlider />
                            </div>
                            <div className="w-full bg-gradient-to-r flex flex-col from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg p-8 text-white text-center shadow-lg mt-auto">
                                <h3 className="text-2xl font-bold mb-3 text-gray-900">¡Únete a la comunidad de trading más activa!</h3>
                                <p className="text-lg mb-4 text-gray-800">Regístrate gratis y obtén acceso a todas las herramientas que necesitas para potenciar tu trading.</p>
                                <button className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors shadow-md">
                                    Comenzar Ahora
                                </button>
                                <button className="bg-white text-[#25D366] px-8 mt-4 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors shadow-md">
                                    Whatsapp
                                </button>
                                <button className="bg-white text-[#0088cc] px-8 mt-4 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors shadow-md">
                                    Telegram
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}