import { useEffect, useRef, useState } from "react";
import styles from "./CarouselImagenes.module.css";
import banner from '../../../../public/ecoLimpio-Banner.jpg'
import compras from '../../../../public/compras.png'
import oferta from '../../../../public/oferta.png'

const images = [
    banner,
    compras,
    oferta,
];

export const CarouselImagenes = () => {
    const [currentIndex, setCurrentIndex] = useState(1); // empezamos en el 1
    const [isTransitioning, setIsTransitioning] = useState(true);
    const slidesRef = useRef<HTMLDivElement>(null);

    // Duplicamos la primera y última imagen para el efecto infinito
    const extendedImages = [
        images[images.length - 1], // última
        ...images,
        images[0], // primera
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Efecto para resetear el slide cuando llega al final o inicio duplicado
    useEffect(() => {
        if (currentIndex === extendedImages.length - 1) {
            // al llegar al duplicado de la primera
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 1000); // esperar a que termine la transición
        } else if (currentIndex === 0) {
            // al llegar al duplicado de la última
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(extendedImages.length - 2);
            }, 1000);
        } else {
            setIsTransitioning(true);
        }
    }, [currentIndex]);

    return (
        <div className={styles.carousel}>
            <div
                ref={slidesRef}
                className={styles.slides}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: isTransitioning ? "transform 1s ease-in-out" : "none",
                }}
            >
                {extendedImages.map((src, i) => (
                    <img key={i} src={src} alt={`Slide ${i}`} className={styles.image} />
                ))}
            </div>
        </div>
    );
};
