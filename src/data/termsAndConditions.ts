export interface TermsAndConditionsData {
  title: string;
  content: any;
}

export async function fetchTermsAndConditions(): Promise<TermsAndConditionsData> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const res = await fetch(`${CMS_API_URL}/api/globals/terms-and-conditions?depth=0`);
  if (!res.ok) {
    throw new Error(`Failed to fetch terms-and-conditions from CMS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.title) {
    throw new Error('terms-and-conditions is missing title');
  }
  if (!data.content) {
    throw new Error('terms-and-conditions is missing content');
  }

  return {
    title: data.title,
    content: data.content,
  };
}
