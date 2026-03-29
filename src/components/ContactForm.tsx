import { useState, type FormEvent } from "react";
import Button from "./Button";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  codigoPostal: string;
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
    codigoPostal: "",
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
      codigoPostal: "",
      asunto: "",
      mensaje: "",
    });

    setTimeout(() => setIsSuccess(false), 5000);
  };

  const inputClasses = (fieldName: string) => `
        w-full px-4 py-3 bg-neutral-50 border-2 rounded-lg transition-all duration-300
        focus:outline-none focus:bg-white focus:border-primary focus:shadow-[0_0_0_4px_rgba(245,185,50,0.15)]
        ${errors[fieldName] ? "border-accent bg-red-50/50" : "border-neutral-200 hover:border-neutral-300"}
    `;

  return (
    <section
      id="contacto"
      className="py-8 lg:py-12 bg-neutral-100 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full"></div>

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Centered Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-display text-secondary mb-2">
            Contáctanos
          </h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-primary"></span>
            <span className="w-2 h-2 bg-secondary rotate-45"></span>
            <span className="w-8 h-0.5 bg-primary"></span>
          </div>
          <p className="text-base text-neutral-500 max-w-md mx-auto">
            Completa el formulario y uno de nuestros expertos se pondrá en
            contacto contigo para ayudarte con tu proyecto.
          </p>
        </div>

        {/* Centered Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 md:p-8 lg:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-sm relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-1 bg-primary"></div>
            <div className="absolute top-0 left-0 w-1 h-16 bg-primary"></div>
            <div className="absolute bottom-0 right-0 w-16 h-1 bg-secondary"></div>
            <div className="absolute bottom-0 right-0 w-1 h-16 bg-secondary"></div>

            {isSuccess && (
              <div className="mb-8 p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg animate-fade-in-up">
                <p className="font-display text-lg">¡Mensaje enviado!</p>
                <p className="text-sm mt-1">
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre — full width */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-display text-secondary mb-1 tracking-wider"
                >
                  NOMBRE <span className="text-accent">*</span>
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
                  <p className="mt-1.5 text-sm text-accent">{errors.nombre}</p>
                )}
              </div>

              {/* Email & Teléfono row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-display text-secondary mb-1 tracking-wider"
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
                    <p className="mt-1.5 text-sm text-accent">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-display text-secondary mb-1 tracking-wider"
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
              </div>

              {/* Ciudad & Código Postal row */}
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div>
                  <label
                    htmlFor="ciudad"
                    className="block text-sm font-display text-secondary mb-1 tracking-wider"
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
                <div className="md:w-40">
                  <label
                    htmlFor="codigoPostal"
                    className="block text-sm font-display text-secondary mb-1 tracking-wider"
                  >
                    C.P.
                  </label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    className={inputClasses("codigoPostal")}
                    placeholder="31000"
                    maxLength={5}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* Asunto — full width */}
              <div>
                <label
                  htmlFor="asunto"
                  className="block text-sm font-display text-secondary mb-1 tracking-wider"
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
                  className="block text-sm font-display text-secondary mb-1 tracking-wider"
                >
                  MENSAJE <span className="text-accent">*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={3}
                  className={inputClasses("mensaje")}
                  placeholder="Cuéntanos sobre tu proyecto o qué materiales necesitas..."
                />
                {errors.mensaje && (
                  <p className="mt-1.5 text-sm text-accent">{errors.mensaje}</p>
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
