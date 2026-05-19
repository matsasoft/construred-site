export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'twitter';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface FooterContentData {
  tagline?: string;
  socialLinks: SocialLink[];
}

/** Fetch the footer-content global from Payload CMS. Only call from Astro server context. */
export async function fetchFooterContent(): Promise<FooterContentData> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const res = await fetch(`${CMS_API_URL}/api/globals/footer-content?depth=0`);
  if (!res.ok) {
    throw new Error(`Failed to fetch footer-content from CMS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  const socialLinks: SocialLink[] = Array.isArray(data.socialLinks)
    ? data.socialLinks
        .filter((s: any) => s?.platform && s?.url)
        .map((s: any) => ({
          platform: s.platform as SocialPlatform,
          url: s.url as string,
        }))
    : [];

  return {
    tagline: typeof data.tagline === 'string' && data.tagline.trim() ? data.tagline : undefined,
    socialLinks,
  };
}
