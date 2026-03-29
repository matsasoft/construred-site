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

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/2d3e7c/f5b932?text=Construred';

function resolveImageUrl(baseUrl: string, path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path}`;
}

/** Fetch all stores from the Payload CMS. Only call from Astro server context (.astro frontmatter). */
export async function fetchStores(): Promise<Store[]> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const res = await fetch(`${CMS_API_URL}/api/sucursales?limit=0&depth=1`);
  if (!res.ok) {
    throw new Error(`Failed to fetch stores from CMS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  const stores: Store[] = data.docs
    .filter((doc: any) => doc.lat != null && doc.lng != null)
    .map((doc: any) => {
      const media = typeof doc.imagen === 'object' && doc.imagen != null ? doc.imagen : null;
      const cardUrl = resolveImageUrl(CMS_API_URL, media?.sizes?.card?.url)
        ?? resolveImageUrl(CMS_API_URL, media?.url);
      const fullUrl = resolveImageUrl(CMS_API_URL, media?.url);

      return {
        id: doc.id,
        nombre: doc.nombre,
        direccion: doc.direccion,
        estado: doc.estado ?? 'Chihuahua',
        municipio: doc.municipio,
        lat: doc.lat,
        lng: doc.lng,
        telefono: doc.telefono ?? undefined,
        horario: doc.horario ?? undefined,
        imagen: cardUrl ?? PLACEHOLDER_IMAGE,
        imagenFull: fullUrl ?? cardUrl ?? PLACEHOLDER_IMAGE,
        correo: doc.correo ?? undefined,
        whatsapp: doc.whatsapp ?? undefined,
      } satisfies Store;
    });

  if (stores.length === 0) {
    throw new Error('No stores returned from CMS');
  }

  return stores;
}
