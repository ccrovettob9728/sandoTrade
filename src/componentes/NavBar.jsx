import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logoNav from '../assets/logo2.png';


const countries = [
    { code: 'es', name: 'España' },
    { code: 'mx', name: 'México' },
    { code: 'us', name: 'Estados Unidos' },
    // Agrega más países si lo necesitas
];

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showCountryMenu, setShowCountryMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                borderBottom: scrolled ? '1px solid #eee' : 'none',
                transition: 'box-shadow 0.2s, border-bottom 0.2s',
            }}
            className='bg-gray-100 text-xl'
        >
            <nav
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: 1200,
                    margin: '0 auto',
                    //padding: '0.5rem 1rem',
                }}


            >
                {/* Izquierda */}
                <div
                        style={{ position: 'relative', transition: 'transform 0.2s', }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; setShowCountryMenu(true) }}
                        onMouseLeave={(e) => { (e.currentTarget.style.transform = 'scale(1)'); setShowCountryMenu(false) }}
                    >
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 500,
                                color: '#333',

                            }}
                        >
                            <span className='mx-6'>Idioma</span>
                        </button>
                        {showCountryMenu && (
                            <ul
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    background: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    listStyle: 'none',
                                    margin: 0,
                                    padding: '0.2rem 0',
                                    minWidth: 120,
                                    borderRadius: 4,
                                }}
                            >
                                {countries.map(country => (
                                    <li key={country.code}>
                                        <button
                                        className='text-md'
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '0.5rem 1rem',
                                                cursor: 'pointer',
                                                color: '#333',
                                            }}
                                        // Aquí puedes agregar lógica para cambiar el idioma
                                        >
                                            {country.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <NavLink
                        to="/comunidad"
                        style={{
                            textDecoration: 'none',
                            color: '#333',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        Comunidad
                    </NavLink>
                    <NavLink
                        to="/caracteristicas"
                        style={{
                            textDecoration: 'none',
                            color: '#333',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        Caracteristicas
                    </NavLink>

                    
                    <NavLink
                        to="/registro"
                        style={{
                            textDecoration: 'none',
                            color: '#333',
                            transition: 'transform 0.2s',
                            display: 'inline-block',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        Registrate
                    </NavLink>
                </div>

                {/* Centro: Logo */}
                <div style={{ flex: '0 0 auto', textAlign: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                    {/* Reemplaza por tu logo real */}
                    <NavLink to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 700, fontSize: '1.5rem', }}
                    >
                        <h1 className="font-bold text-center px-10 text-gray-800">
                            <span className="flex items-center">
                                <img src={logoNav} alt="Logo" className="h-30 py-5 mr-2" />
                                <span className="text-3xl font-bold text-gray-800">
                                    Mercado
                                    <span className="text-yellow-400">Trade</span>
                                </span>
                            </span>
                        </h1>
                    </NavLink>
                </div>

                {/* Derecha */}
                <div className='space-x-5' style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <NavLink to="/ayuda" style={{ textDecoration: 'none', color: '#333', fontWeight: 500, transition: 'transform 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                        Ayuda
                    </NavLink>
                    <NavLink to="/aprende" style={{ textDecoration: 'none', color: '#333', fontWeight: 500, transition: 'transform 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                        Aprende
                    </NavLink>
                    <NavLink to="/precios" style={{ textDecoration: 'none', color: '#333', fontWeight: 500, transition: 'transform 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                        Precios
                    </NavLink>
                    <NavLink to="/soporte" style={{ textDecoration: 'none', color: '#333', fontWeight: 500, transition: 'transform 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                        Soporte
                    </NavLink>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;