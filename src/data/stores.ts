export interface Store {
  id: number;
  nombre: string;
  calle: string;
  colonia: string;
  estado: string;
  municipio: "Chihuahua" | "Cuauhtémoc" | "Delicias";
  lat: number;
  lng: number;
  telefono: string;
  horario: string;
  imagen: string;
  correo?: string;
  whatsapp?: string;
}

export const stores: Store[] = [
  // === Chihuahua (12 tiendas) ===
  {
    id: 1,
    nombre: "Construred Centro",
    calle: "Av. Independencia 1520",
    colonia: "Centro",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.6353,
    lng: -106.0889,
    telefono: "614 123 4567",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Centro",
    correo: "centro@construred.com.mx",
    whatsapp: "5216141234567",
  },
  {
    id: 2,
    nombre: "Construred Tecnológico",
    calle: "Av. Tecnológico 4500",
    colonia: "Las Granjas",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.67,
    lng: -106.08,
    telefono: "614 234 5678",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Tecnologico",
    correo: "tecnologico@construred.com.mx",
    whatsapp: "5216142345678",
  },
  {
    id: 3,
    nombre: "Construred Industrias",
    calle: "Av. de las Industrias 8901",
    colonia: "Complejo Industrial",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.595,
    lng: -106.065,
    telefono: "614 345 6789",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Industrias",
    correo: "industrias@construred.com.mx",
    whatsapp: "5216143456789",
  },
  {
    id: 4,
    nombre: "Construred Periférico",
    calle: "Periférico de la Juventud 3200",
    colonia: "Jardines del Sol",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.645,
    lng: -106.125,
    telefono: "614 456 7890",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Periferico",
    correo: "periferico@construred.com.mx",
    whatsapp: "5216144567890",
  },
  {
    id: 5,
    nombre: "Construred Universidad",
    calle: "Av. Universidad 2800",
    colonia: "San Felipe",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.615,
    lng: -106.045,
    telefono: "614 567 8901",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Universidad",
    correo: "universidad@construred.com.mx",
    whatsapp: "5216145678901",
  },
  {
    id: 6,
    nombre: "Construred Cantera",
    calle: "Blvd. Juan Pablo II 1100",
    colonia: "Cantera del Pedregal",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.6105,
    lng: -106.1235,
    telefono: "614 678 9012",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Cantera",
    correo: "cantera@construred.com.mx",
  },
  {
    id: 7,
    nombre: "Construred Riberas",
    calle: "Av. Mirador 450",
    colonia: "Riberas del Sacramento",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.6582,
    lng: -106.0475,
    telefono: "614 789 0123",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Riberas",
    correo: "riberas@construred.com.mx",
    whatsapp: "5216147890123",
  },
  {
    id: 8,
    nombre: "Construred Nombre de Dios",
    calle: "Carretera Nombre de Dios Km 3",
    colonia: "Nombre de Dios",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.6892,
    lng: -106.0612,
    telefono: "614 890 1234",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+NombreDeDios",
    whatsapp: "5216148901234",
  },
  {
    id: 9,
    nombre: "Construred Avalos",
    calle: "Av. Pacheco 2200",
    colonia: "Ávalos",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.6175,
    lng: -106.1055,
    telefono: "614 901 2345",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Avalos",
    correo: "avalos@construred.com.mx",
    whatsapp: "5216149012345",
  },
  {
    id: 10,
    nombre: "Construred Sacramento",
    calle: "Av. Homero 880",
    colonia: "Sacramento",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.671,
    lng: -106.035,
    telefono: "614 012 3456",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Sacramento",
    correo: "sacramento@construred.com.mx",
  },
  {
    id: 11,
    nombre: "Construred Tabalaopa",
    calle: "Carretera a Aldama Km 5",
    colonia: "Tabalaopa",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.648,
    lng: -106.018,
    telefono: "614 135 7924",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Tabalaopa",
  },
  {
    id: 12,
    nombre: "Construred Robinson",
    calle: "Blvd. Ortiz Mena 1850",
    colonia: "Robinson",
    estado: "Chihuahua",
    municipio: "Chihuahua",
    lat: 28.6285,
    lng: -106.112,
    telefono: "614 246 8135",
    horario: "Lun-Sáb: 8:00 - 19:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Robinson",
    correo: "robinson@construred.com.mx",
  },

  // === Cuauhtémoc (5 tiendas) ===
  {
    id: 13,
    nombre: "Construred Cuauhtémoc Centro",
    calle: "Av. Allende 300",
    colonia: "Centro",
    estado: "Chihuahua",
    municipio: "Cuauhtémoc",
    lat: 28.4059,
    lng: -106.8667,
    telefono: "625 581 1234",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Cuauhtemoc+Centro",
    correo: "cuauhtemoc.centro@construred.com.mx",
    whatsapp: "5216255811234",
  },
  {
    id: 14,
    nombre: "Construred Cuauhtémoc Norte",
    calle: "Carretera a Álvaro Obregón Km 2",
    colonia: "Lázaro Cárdenas",
    estado: "Chihuahua",
    municipio: "Cuauhtémoc",
    lat: 28.4215,
    lng: -106.858,
    telefono: "625 581 2345",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Cuauhtemoc+Norte",
    whatsapp: "5216255812345",
  },
  {
    id: 15,
    nombre: "Construred Cuauhtémoc Sur",
    calle: "Blvd. Abraham González 150",
    colonia: "Los Nogales",
    estado: "Chihuahua",
    municipio: "Cuauhtémoc",
    lat: 28.392,
    lng: -106.874,
    telefono: "625 581 3456",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Cuauhtemoc+Sur",
    correo: "cuauhtemoc.sur@construred.com.mx",
  },
  {
    id: 16,
    nombre: "Construred Campos Menonitas",
    calle: "Carretera Rubio Km 8",
    colonia: "Campos Menonitas",
    estado: "Chihuahua",
    municipio: "Cuauhtémoc",
    lat: 28.435,
    lng: -106.91,
    telefono: "625 581 4567",
    horario: "Lun-Sáb: 8:00 - 17:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Campos+Menonitas",
  },
  {
    id: 17,
    nombre: "Construred Anáhuac",
    calle: "Av. Anáhuac 520",
    colonia: "Anáhuac",
    estado: "Chihuahua",
    municipio: "Cuauhtémoc",
    lat: 28.41,
    lng: -106.85,
    telefono: "625 581 5678",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Anahuac",
    whatsapp: "5216255815678",
  },

  // === Delicias (5 tiendas) ===
  {
    id: 18,
    nombre: "Construred Delicias Centro",
    calle: "Av. Agricultura Norte 1200",
    colonia: "Centro",
    estado: "Chihuahua",
    municipio: "Delicias",
    lat: 28.1903,
    lng: -105.4719,
    telefono: "639 472 1234",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Delicias+Centro",
    correo: "delicias.centro@construred.com.mx",
    whatsapp: "5216394721234",
  },
  {
    id: 19,
    nombre: "Construred Delicias Oriente",
    calle: "Av. 6a Oriente 800",
    colonia: "Industrial",
    estado: "Chihuahua",
    municipio: "Delicias",
    lat: 28.195,
    lng: -105.455,
    telefono: "639 472 2345",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Delicias+Oriente",
    correo: "delicias.oriente@construred.com.mx",
    whatsapp: "5216394722345",
  },
  {
    id: 20,
    nombre: "Construred Delicias Sur",
    calle: "Blvd. Tercer Mundo 450",
    colonia: "Tercera Etapa",
    estado: "Chihuahua",
    municipio: "Delicias",
    lat: 28.178,
    lng: -105.48,
    telefono: "639 472 3456",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Delicias+Sur",
    correo: "delicias.sur@construred.com.mx",
  },
  {
    id: 21,
    nombre: "Construred Delicias Poniente",
    calle: "Av. Río Chuviscar 300",
    colonia: "Poniente",
    estado: "Chihuahua",
    municipio: "Delicias",
    lat: 28.187,
    lng: -105.492,
    telefono: "639 472 4567",
    horario: "Lun-Sáb: 8:00 - 18:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Delicias+Poniente",
    correo: "delicias.poniente@construred.com.mx",
  },
  {
    id: 22,
    nombre: "Construred Rosales",
    calle: "Carretera Delicias-Rosales Km 4",
    colonia: "Rosales",
    estado: "Chihuahua",
    municipio: "Delicias",
    lat: 28.205,
    lng: -105.51,
    telefono: "639 472 5678",
    horario: "Lun-Sáb: 8:00 - 17:00",
    imagen:
      "https://placehold.co/600x400/2d3e7c/f5b932?text=Construred+Rosales",
  },
];

/** Default center: Chihuahua city */
export const DEFAULT_CENTER = { lat: 28.6353, lng: -106.0889 };

/** Haversine distance in km between two lat/lng coordinates */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
