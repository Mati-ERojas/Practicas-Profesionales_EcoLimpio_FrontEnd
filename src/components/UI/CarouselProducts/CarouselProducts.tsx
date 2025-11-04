import { useState, type ReactNode } from "react";
import styles from './CarouselProducts.module.css';

interface CarouselProps {
    children: ReactNode[];
    visibleCount?: number;
}

export const CarouselProducts = ({ children, visibleCount = 1 }: CarouselProps) => {
    const [index, setIndex] = useState(0);
    const total = children.length;
    const maxIndex = Math.max(total - visibleCount, 0);

    const handlePrev = () => setIndex((prev) => (prev <= 0 ? 0 : prev - 1));
    const handleNext = () => setIndex((prev) => (prev >= maxIndex ? maxIndex : prev + 1));

    const shouldCenter = total <= visibleCount;

    const showPrev = index > 0;
    const showNext = index < maxIndex;

    return (
        <div className={styles.carousel}>
            {!shouldCenter && (
                <button className={`${styles.arrow} ${!showPrev ? styles.hidden : ''}`} onClick={handlePrev}>
                    <span className="material-icons" style={{ fontSize: '40px' }}>arrow_left</span>
                </button>
            )}

            <div className={styles.viewport}>
                <div
                    className={`${styles.track} ${shouldCenter ? styles.centered : ''}`}
                    style={{
                        transform: shouldCenter
                            ? "none"
                            : `translateX(-${index * (100 / visibleCount)}%)`,
                        ['--visible-count' as any]: visibleCount,
                    }}
                >
                    {children.map((child, i) => (
                        <div key={i} className={styles.slide}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {!shouldCenter && (
                <button className={`${styles.arrow} ${!showNext ? styles.hidden : ''}`} onClick={handleNext}>
                    <span className="material-icons" style={{ fontSize: '40px' }}>arrow_right</span>
                </button>
            )}
        </div>
    );
};


