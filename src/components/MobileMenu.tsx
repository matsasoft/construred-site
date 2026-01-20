import { useState, useEffect } from 'react';

interface NavItem {
    label: string;
    href: string;
}

interface MobileMenuProps {
    items: NavItem[];
}

export default function MobileMenu({ items }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Listen to scroll changes from header
    useEffect(() => {
        const handleScrollChange = (event: CustomEvent<{ isScrolled: boolean }>) => {
            setIsScrolled(event.detail.isScrolled);
        };

        window.addEventListener('headerScrollChange', handleScrollChange as EventListener);
        return () => {
            window.removeEventListener('headerScrollChange', handleScrollChange as EventListener);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Dynamic color based on scroll state
    const hamburgerColor = isOpen ? 'text-white' : (isScrolled ? 'text-secondary' : 'text-white');

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors duration-300 ${hamburgerColor} ${!isScrolled && !isOpen ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]' : ''}`}
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isOpen}
                data-mobile-menu-btn
            >
                <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                        isOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                />
                <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                        isOpen ? 'opacity-0 scale-0' : ''
                    }`}
                />
                <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                        isOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                />
            </button>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-secondary z-40 lg:hidden transition-all duration-500 ${
                    isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Menu Content */}
                <nav className="relative h-full flex flex-col items-center justify-center">
                    <ul className="space-y-6 text-center">
                        {items.map((item, index) => (
                            <li
                                key={item.href}
                                className={`transform transition-all duration-500 ${
                                    isOpen
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-8 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: isOpen ? `${index * 100}ms` : '0ms'
                                }}
                            >
                                <a
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className="text-4xl md:text-5xl font-display text-white hover:text-primary transition-colors duration-300 tracking-wider"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Button */}
                    <div
                        className={`mt-12 transform transition-all duration-500 ${
                            isOpen
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                        }`}
                        style={{
                            transitionDelay: isOpen ? `${items.length * 100}ms` : '0ms'
                        }}
                    >
                        <a
                            href="#contacto"
                            onClick={handleLinkClick}
                            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-secondary-dark font-display text-xl tracking-wider border-2 border-primary hover:bg-primary-dark hover:border-primary-dark transition-all duration-300"
                        >
                            Cotiza Ahora
                        </a>
                    </div>
                </nav>
            </div>
        </>
    );
}
