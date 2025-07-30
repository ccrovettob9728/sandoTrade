import React from "react";
import ChartComponent from "../componentes/ChartComponent";
import LoginForm from "../componentes/LoginComponent";
import logoNav from "../assets/logo2.png";
import NavBar from "../componentes/NavBar.jsx";
import TestimonialSlider from "../componentes/TestimonialSlider";

export default function Home() {
    return (
        <div className="min-h-screen min-w-screen  bg-gray-100 flex flex-col">
            <NavBar />
            <header className="py-2 flex items-center bg-gray-100  flex flex-col">


            </header>
            <main className=" flex flex-row items-center justify-center">
                <div className="w-full flex justify-center mb-8 gap-4">
                    <div className="row-span-3 flex w-sm">
                        <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-2">Potencia tu trading con MercadoTrade!</h2>
                            <p className="text-gray-600 text-center my-4">
                                Gracias a la ayuda precisa de nuestra IA, podrás tomar decisiones informadas y mejorar tu rendimiento en el mercado.
                            </p>
                            <LoginForm />
                        </section>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex  items-center  ">
                        <div className="w-full flex gap-4">
                            <div className="flex-grow">
                                <ChartComponent />
                            </div>
                            
                        </div>
                    </div>
                    <div className="flex w-sm ">
                        <div className="bg-white rounded-lg shadow p-6 justify-between flex flex-col items-center gap-8">
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4 text-center">Lo que dicen nuestros usuarios</h2>
                                <TestimonialSlider />
                            </div>
                            <div className="w-full bg-gradient-to-r flex-col flex  from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg p-8 text-white text-center shadow-lg">
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
            <div className="w-full row-auto flex justify-center mt-8">
                <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Your Portfolio</h2>
                    <p className="text-gray-600 text-center">
                        Track your assets and monitor your trading performance.
                    </p>
                </section>
                <section className="bg-white h-1000 rounded-lg shadow p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Trade Now</h2>
                    <p className="text-gray-600 text-center">
                        Start trading with real-time data and advanced tools.
                    </p>
                </section>
            </div>
        </div>
    );
}