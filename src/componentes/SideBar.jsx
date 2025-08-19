import React, { useState } from 'react';
import logoNav from '../assets/logo2.png';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Define the menu items
    const menuItems = [
        { name: 'Idioma' },
        { name: 'Comunidad' },
        { name: 'Características' },
        { name: 'Regístrate' },
        { name: 'Ayuda' },
        { name: 'Aprende' },
        { name: 'Precios' },
        { name: 'Soporte' },
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Botón de hamburguesa y texto de la marca, visible cuando el sidebar está cerrado */}
            <div className="md:hidden bg-gray-100 w-full p-4 flex items-center fixed justify-between">
                <button onClick={toggleSidebar} className="text-gray-800 focus:outline-none">
                    {/* SVG para el icono de hamburguesa */}
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <span className="flex items-center pl-5">
                    <img src={logoNav} alt="Logo" className="h-10  mr-2" />
                    <span className="text-xl font-bold text-gray-800">
                        Mercado
                        <span className="text-yellow-400">Trade</span>
                    </span>
                </span>
            </div>

            {/* Botón de hamburguesa en desktop (si se desea, este es un ejemplo) */}
            <div className="hidden md:block absolute top-4 left-4 z-50">
                <button onClick={toggleSidebar} className="text-gray-800 focus:outline-none p-2 rounded-md hover:bg-gray-200 transition-colors">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            {/* Sidebar: contenedor principal con animación */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-3 border-b border-gray-200">
                    <span className="flex items-center pl-2 mr-5">
                    <img src={logoNav} alt="Logo" className="h-10  mr-2" />
                    <span className="text-xl font-bold text-gray-800">
                        Mercado
                        <span className="text-yellow-400 ">Trade</span>
                    </span>
                </span>
                    <button onClick={toggleSidebar} className="text-gray-500 ml-5 hover:text-gray-700 focus:outline-none transition-colors">
                        {/* SVG para la flecha de "cerrar" */}
                        <svg
                            className="w-6 h-6 transform rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </div>

                {/* Lista de enlaces del menú */}
                <nav className="p-4">
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href="#"
                                    className="block text-gray-600 hover:bg-gray-100 rounded-md p-2 transition-colors duration-200 font-bold"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Overlay: cubre la pantalla para dar un efecto modal en móviles */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="md:hidden fixed inset-0 bg-black opacity-50 z-30 transition-opacity duration-300 ease-in-out"
                ></div>
            )}
        </>
    );
};

export default Sidebar;