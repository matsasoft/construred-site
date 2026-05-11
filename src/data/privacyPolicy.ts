export interface PrivacyPolicyData {
  title: string;
  content: any;
  avisoPdfUrl: string;
}

export async function fetchAvisoPdfUrl(): Promise<string> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const res = await fetch(
    `${CMS_API_URL}/api/globals/privacy-policy?depth=1&select[avisoPrivacidadFile]=true`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch aviso pdf url: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const fileUrl: string | undefined = data?.avisoPrivacidadFile?.url;
  if (!fileUrl) {
    throw new Error('privacy-policy is missing avisoPrivacidadFile');
  }
  return fileUrl.startsWith('http') ? fileUrl : `${CMS_API_URL}${fileUrl}`;
}

export async function fetchPrivacyPolicy(): Promise<PrivacyPolicyData> {
  const CMS_API_URL = import.meta.env.CMS_API_URL;
  if (!CMS_API_URL) {
    throw new Error('CMS_API_URL environment variable is not set');
  }

  const res = await fetch(`${CMS_API_URL}/api/globals/privacy-policy?depth=1`);
  if (!res.ok) {
    throw new Error(`Failed to fetch privacy-policy from CMS: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.title) {
    throw new Error('privacy-policy is missing title');
  }
  if (!data.content) {
    throw new Error('privacy-policy is missing content');
  }
  if (!data.avisoPrivacidadFile?.url) {
    throw new Error('privacy-policy is missing avisoPrivacidadFile');
  }

  const fileUrl: string = data.avisoPrivacidadFile.url;
  const absoluteUrl = fileUrl.startsWith('http') ? fileUrl : `${CMS_API_URL}${fileUrl}`;

  return {
    title: data.title,
    content: data.content,
    avisoPdfUrl: absoluteUrl,
  };
}
