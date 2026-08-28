import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';

interface RichTextProps {
  data: any;
  avisoPdfUrl?: string;
  terminosPdfUrl?: string;
}

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <p className="my-8">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center gap-3 bg-primary text-secondary-dark font-display tracking-wider px-6 py-3 hover:brightness-110 transition-all duration-300 no-underline"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
          />
        </svg>
        {label}
      </a>
    </p>
  );
}

export default function RichText({ data, avisoPdfUrl, terminosPdfUrl }: RichTextProps) {
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      avisoPrivacidadDownload: () =>
        avisoPdfUrl ? (
          <DownloadButton href={avisoPdfUrl} label="Descargar Aviso de Privacidad (PDF)" />
        ) : null,
      terminosCondicionesDownload: () =>
        terminosPdfUrl ? (
          <DownloadButton href={terminosPdfUrl} label="Descargar Términos y Condiciones (PDF)" />
        ) : null,
    },
  });

  return (
    <div className="legal-richtext">
      <LexicalRichText data={data} converters={converters} />
    </div>
  );
}
