export type HeroButtonVariant =
  | 'primary'
  | 'primary-flat'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost';

export interface HeroButton {
  label: string;
  url: string;
  variant: HeroButtonVariant;
  openInNewTab: boolean;
}

export interface HeroSlide {
  id: number;
  image: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  buttons: HeroButton[];
}

function resolveImageUrl(baseUrl: string, path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path}`;
}

/** Fetch active hero slides from the Payload CMS. Only call from Astro server context (.astro frontmatter). */
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const params = new URLSearchParams({
    limit: '0',
    depth: '1',
    'where[active][equals]': 'true',
    'sort': 'order',
  });

  const res = await fetch(`${CMS_API_URL}/api/hero-slides?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch hero slides from CMS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data.docs
    .map((doc: any): HeroSlide | null => {
      const media = typeof doc.image === 'object' && doc.image != null ? doc.image : null;
      const heroUrl =
        resolveImageUrl(CMS_API_URL, media?.sizes?.hero?.url) ??
        resolveImageUrl(CMS_API_URL, media?.url);
      if (!heroUrl) return null;

      const buttons: HeroButton[] = Array.isArray(doc.buttons)
        ? doc.buttons.map((b: any) => ({
            label: b.label,
            url: b.url,
            variant: b.variant,
            openInNewTab: Boolean(b.openInNewTab),
          }))
        : [];

      return {
        id: doc.id,
        image: heroUrl,
        imageAlt: media?.alt ?? doc.title,
        title: doc.title,
        subtitle: doc.subtitle ?? undefined,
        buttons,
      };
    })
    .filter((slide: HeroSlide | null): slide is HeroSlide => slide !== null);
}
