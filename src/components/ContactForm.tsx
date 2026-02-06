import { useState, type FormEvent } from "react";
import Button from "./Button";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  asunto: string;
  mensaje: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    asunto: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission (UI only)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      ciudad: "",
      asunto: "",
      mensaje: "",
    });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const inputClasses = (fieldName: string) => `
        w-full px-4 py-3 bg-white border-2 transition-all duration-300
        focus:outline-none focus:border-primary focus:shadow-[4px_4px_0_0_var(--color-primary)]
        ${errors[fieldName] ? "border-accent" : "border-neutral-200 hover:border-neutral-300"}
    `;

  return (
    <section
      id="contacto"
      className="py-20 lg:py-32 bg-neutral-100 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      {/* Industrial Pattern Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-secondary mb-4">
              Cotiza con Nosotros
            </h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-12 h-1 bg-primary"></span>
              <span className="w-3 h-3 bg-secondary rotate-45"></span>
              <span className="w-12 h-1 bg-primary"></span>
            </div>
            <p className="text-lg text-neutral-600 mb-8 max-w-md">
              Completa el formulario y uno de nuestros expertos se pondrá en
              contacto contigo para ayudarte con tu proyecto.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-secondary-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Teléfono</p>
                  <p className="text-lg font-display text-secondary">
                    55 1234 5678
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="text-lg font-display text-secondary">
                    contacto@construred.mx
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Horario</p>
                  <p className="text-lg font-display text-secondary">
                    Lun - Sáb: 8:00 - 19:00
                  </p>
                </div>
              </div>
            </div>

            {/* Meny Mascot */}
            <div className="hidden lg:block mt-8">
              <img
                src="/Meny-04.png"
                alt="Meny - Mascota de Construred"
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 lg:p-10 shadow-2xl relative">
            {/* Corner Accent */}
            <div
              className="absolute top-0 right-0 w-20 h-20 bg-primary"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
            ></div>

            {isSuccess && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 animate-fade-in-up">
                <p className="font-display">¡Mensaje enviado!</p>
                <p className="text-sm">
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-display text-secondary mb-2 tracking-wider"
                >
                  NOMBRE
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={inputClasses("nombre")}
                  placeholder="Tu nombre completo"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-accent">{errors.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-display text-secondary mb-2 tracking-wider"
                >
                  EMAIL <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses("email")}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-accent">{errors.email}</p>
                )}
              </div>

              {/* Telefono & Ciudad */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-display text-secondary mb-2 tracking-wider"
                  >
                    TELÉFONO
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={inputClasses("telefono")}
                    placeholder="55 1234 5678"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ciudad"
                    className="block text-sm font-display text-secondary mb-2 tracking-wider"
                  >
                    CIUDAD
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className={inputClasses("ciudad")}
                    placeholder="Tu ciudad"
                  />
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label
                  htmlFor="asunto"
                  className="block text-sm font-display text-secondary mb-2 tracking-wider"
                >
                  ASUNTO
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className={inputClasses("asunto")}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="cotizacion">Cotización de materiales</option>
                  <option value="proyecto">Asesoría para proyecto</option>
                  <option value="mayoreo">Compras de mayoreo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-display text-secondary mb-2 tracking-wider"
                >
                  MENSAJE <span className="text-accent">*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={5}
                  className={inputClasses("mensaje")}
                  placeholder="Cuéntanos sobre tu proyecto o qué materiales necesitas..."
                />
                {errors.mensaje && (
                  <p className="mt-1 text-sm text-accent">{errors.mensaje}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                variant="primary-flat"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Mensaje"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
