import { useState, useEffect, useCallback } from 'react';
import Button from './Button';
import type { HeroSlide } from '../data/heroSlides';

interface HeroSliderProps {
    slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const slideCount = slides.length;

    const nextSlide = useCallback(() => {
        if (isAnimating || slideCount <= 1) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % slideCount);
        setTimeout(() => setIsAnimating(false), 700);
    }, [isAnimating, slideCount]);

    const prevSlide = useCallback(() => {
        if (isAnimating || slideCount <= 1) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
        setTimeout(() => setIsAnimating(false), 700);
    }, [isAnimating, slideCount]);

    const goToSlide = (index: number) => {
        if (isAnimating || index === currentSlide) return;
        setIsAnimating(true);
        setCurrentSlide(index);
        setTimeout(() => setIsAnimating(false), 700);
    };

    useEffect(() => {
        if (slideCount <= 1) return;
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [nextSlide, slideCount]);

    return (
        <section id="inicio" className="relative h-screen min-h-[600px] overflow-hidden pt-20">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                        index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                    }`}
                >
                    {/* Background Image */}
                    <div
                        role="img"
                        aria-label={slide.imageAlt}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />

                    {/* Diagonal Accent */}
                    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent transform skew-x-12 origin-bottom-right" />
                </div>
            ))}

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
                <div className="max-w-3xl">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`transition-all duration-700 ${
                                index === currentSlide
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8 absolute'
                            }`}
                        >
                            {index === currentSlide && (
                                <>
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white mb-6 leading-none">
                                        {slide.title.split(' ').map((word, i) => (
                                            <span
                                                key={i}
                                                className="inline-block animate-fade-in-up opacity-0"
                                                style={{
                                                    animationDelay: `${i * 100 + 200}ms`,
                                                    animationFillMode: 'forwards'
                                                }}
                                            >
                                                {word}
                                                {i < slide.title.split(' ').length - 1 && ' '}
                                            </span>
                                        ))}
                                    </h1>
                                    {slide.subtitle && (
                                        <p
                                            className="text-xl md:text-2xl text-neutral-200 mb-8 max-w-xl animate-fade-in-up opacity-0"
                                            style={{
                                                animationDelay: '500ms',
                                                animationFillMode: 'forwards'
                                            }}
                                        >
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    {slide.buttons.length > 0 && (
                                        <div
                                            className="flex flex-wrap gap-4 animate-fade-in-up opacity-0"
                                            style={{
                                                animationDelay: '700ms',
                                                animationFillMode: 'forwards'
                                            }}
                                        >
                                            {slide.buttons.map((btn, btnIndex) => (
                                                <Button
                                                    key={btnIndex}
                                                    variant={btn.variant}
                                                    size="lg"
                                                    href={btn.url}
                                                    target={btn.openInNewTab ? '_blank' : undefined}
                                                    rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
                                                    className={
                                                        btn.variant === 'primary'
                                                            ? 'shadow-industrial hover:shadow-[6px_6px_0_0_var(--color-secondary),12px_12px_0_0_var(--color-primary-dark)] hover:-translate-y-1'
                                                            : ''
                                                    }
                                                >
                                                    {btn.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* Meny Mascot */}
            <div className="hidden lg:block absolute right-0 bottom-0 w-64 h-64 opacity-90">
                <img
                    src="/Meny-01.png"
                    alt="Meny - Mascota de Construred"
                    className="w-full h-full object-contain drop-shadow-2xl animate-[bounce_3s_ease-in-out_infinite]"
                />
            </div>

            {/* Slide Navigation */}
            {slideCount > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-primary w-12'
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Ir a slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Arrow Navigation */}
            {slideCount > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-primary hover:text-secondary-dark transition-all duration-300 group"
                        aria-label="Slide anterior"
                    >
                        <svg
                            className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-primary hover:text-secondary-dark transition-all duration-300 group"
                        aria-label="Siguiente slide"
                    >
                        <svg
                            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Scroll Indicator */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80">
                <span className="text-sm font-body tracking-wider">Scroll</span>
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/80 rounded-full animate-[bounce_1.5s_ease-in-out_infinite]" />
                </div>
            </div>
        </section>
    );
}
