export type CardAccent = 'primary' | 'secondary' | 'accent';
export type CardIcon =
  | 'building'
  | 'lightning'
  | 'shield'
  | 'hammer'
  | 'helmet'
  | 'tools';

export interface AboutCard {
  title: string;
  description: string;
  accent: CardAccent;
  icon: CardIcon;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutSectionData {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: AboutCard[];
  stats: AboutStat[];
}

/** Fetch the About section global from Payload CMS. Only call from Astro server context. */
export async function fetchAboutSection(): Promise<AboutSectionData> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const res = await fetch(`${CMS_API_URL}/api/globals/about-section?depth=0`);
  if (!res.ok) {
    throw new Error(`Failed to fetch about-section from CMS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.sectionTitle || !data.sectionSubtitle) {
    throw new Error('about-section is missing sectionTitle or sectionSubtitle');
  }
  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    throw new Error('about-section returned no cards');
  }
  if (!Array.isArray(data.stats) || data.stats.length === 0) {
    throw new Error('about-section returned no stats');
  }

  const cards: AboutCard[] = data.cards.map((c: any) => ({
    title: c.title,
    description: c.description,
    accent: (c.accent ?? 'primary') as CardAccent,
    icon: (c.icon ?? 'building') as CardIcon,
  }));

  const stats: AboutStat[] = data.stats.map((s: any) => ({
    value: s.value,
    label: s.label,
  }));

  return {
    sectionTitle: data.sectionTitle,
    sectionSubtitle: data.sectionSubtitle,
    cards,
    stats,
  };
}
