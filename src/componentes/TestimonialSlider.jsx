import React, { useEffect, useRef, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import logoNav from "../assets/logo2.png";
import google from "../assets/google.svg";
import apple from "../assets/apple.svg";
import facebook from "../assets/facebook.svg";

const testimonials = [
    {
        image: logoNav,
        name: "Carlos R.",
        country: "Chile",
        comment: "La app revolucionó mi forma de operar. Los datos en tiempo real son precisos y la IA me ayuda a tomar mejores decisiones.",
    },
    {
        image: google,
        name: "Ana G.",
        country: "Perú",
        comment: "Me encanta la interfaz y la facilidad para seguir mis activos. ¡Muy recomendable para traders!",
    },
    {
        image: apple,
        name: "Luis M.",
        country: "Colombia",
        comment: "La integración de IA es increíble. Ahora puedo anticipar movimientos del mercado con mayor confianza.",
    },
    {
        image: facebook,
        name: "Sofía P.",
        country: "Argentina",
        comment: "La mejor herramienta para trading que he probado. Todo en una sola app, fácil y potente.",
    },
];

export default function TestimonialSlider() {
    const CARD_HEIGHT = 120; // Aumentamos un poco la altura para mejor espaciado
    const [position, setPosition] = useState(0);
    const containerRef = useRef(null);
    const TRANSITION_DURATION = 2000; // 2 segundos para una transición más suave

    // Crear un array con los testimonios más el primer testimonio repetido al final
    const displayedTestimonials = [...testimonials, testimonials[0]];

    useEffect(() => {
        const slideNext = () => {
            setPosition((prev) => {
                if (prev >= (testimonials.length) * CARD_HEIGHT) {
                    // Si llegamos al final (testimonio duplicado), reiniciar instantáneamente
                    return 0;
                }
                return prev + CARD_HEIGHT;
            });
        };

        const interval = setInterval(slideNext, 6000); // Más tiempo entre transiciones
        return () => clearInterval(interval);
    }, []);

    // Reiniciar la posición sin animación cuando llegue al final
    useEffect(() => {
        if (position === 0) {
            containerRef.current.style.transition = 'none';
            // Forzar un reflow
            containerRef.current.getBoundingClientRect();
            containerRef.current.style.transition = 'transform 1.5s ease';
        }
    }, [position]);

    return (
        <div className="w-full overflow-hidden mt-3" style={{ height: CARD_HEIGHT }}>
            <div
                ref={containerRef}
                className="w-full transition-transform duration-[2000ms] ease-in-out"
                style={{
                    transform: `translateY(-${position}px)`,
                }}
            >
                {displayedTestimonials.map((testimonial, idx) => (
                    <div
                        key={idx}
                        className="w-full flex items-center justify-center py-2"
                        style={{ height: CARD_HEIGHT }}
                    >
                        <TestimonialCard {...testimonial} />
                    </div>
                ))}
            </div>
        </div>
    );
}
