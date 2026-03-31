import { useState, useEffect } from 'react';
import Button from './Button';

interface NavItem {
    label: string;
    href: string;
}

interface MobileMenuProps {
    items: NavItem[];
    currentPath?: string;
}

export default function MobileMenu({ items, currentPath = '/' }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

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

    const hamburgerColor = isOpen ? 'text-white' : 'text-secondary';

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors duration-300 ${hamburgerColor}`}
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
                                    className={`text-4xl md:text-5xl font-display transition-colors duration-300 tracking-wider ${
                                        (item.href === '/sucursales' && (currentPath === '/sucursales' || currentPath === '/sucursales/'))
                                            ? 'text-primary'
                                            : 'text-white hover:text-primary'
                                    }`}
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
                        <Button variant="primary" size="lg" href="/sucursales" onClick={handleLinkClick} className="text-xl">
                            Buscar Tienda
                        </Button>
                    </div>
                </nav>
            </div>
        </>
    );
}
