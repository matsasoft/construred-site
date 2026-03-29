export interface Store {
  id: number;
  nombre: string;
  direccion: string;
  estado?: string;
  municipio: string;
  lat: number;
  lng: number;
  telefono?: string;
  horario?: string;
  imagen: string;
  imagenFull?: string;
  correo?: string;
  whatsapp?: string;
}

export const MUNICIPIO_LABELS: Record<string, string> = {
  Camargo: "Camargo",
  Chihuahua: "Chihuahua",
  Creel: "Creel",
  Cuauhtemoc: "Cuauhtémoc",
  Delicias: "Delicias",
  Guachochi: "Guachochi",
  Jimenez: "Jiménez",
  Juarez: "Juárez",
  Madera: "Madera",
  ManuelBenavides: "Manuel Benavides",
  Meoqui: "Meoqui",
  NCG: "Nuevo Casas Grandes",
  Ojinaga: "Ojinaga",
  Parral: "Parral",
  SanJuanito: "San Juanito",
  Saucillo: "Saucillo",
  VillaAhumada: "Villa Ahumada",
};

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
