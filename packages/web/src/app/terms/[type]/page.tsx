/**
 * Dynamic terms page
 * Displays different terms content based on [type] parameter
 */

import { notFound } from 'next/navigation';
import { TermsLayout } from './_components/TermsLayout';
import { ServiceTermsContent } from './_components/ServiceTermsContent';
import { PrivacyPolicyContent } from './_components/PrivacyPolicyContent';
import { SensitiveDataContent } from './_components/SensitiveDataContent';
import { AIAnalysisContent } from './_components/AIAnalysisContent';

interface TermsPageProps {
  params: {
    type: string;
  };
}

// Valid term types
const VALID_TERM_TYPES = ['service', 'privacy', 'sensitive-data', 'ai-analysis'] as const;
type TermType = (typeof VALID_TERM_TYPES)[number];

// Term metadata
const TERM_METADATA: Record<TermType, { title: string; lastUpdated: string }> = {
  service: {
    title: 'Terms of Service',
    lastUpdated: '2025-11-10',
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: '2025-11-10',
  },
  'sensitive-data': {
    title: 'Sensitive Personal Data Agreement',
    lastUpdated: '2025-11-10',
  },
  'ai-analysis': {
    title: 'AI-Powered Analysis Agreement',
    lastUpdated: '2025-11-10',
  },
};

export default function TermsPage({ params }: TermsPageProps) {
  const { type } = params;

  // Validate term type
  if (!VALID_TERM_TYPES.includes(type as TermType)) {
    notFound();
  }

  const termType = type as TermType;
  const metadata = TERM_METADATA[termType];

  // Render appropriate content based on type
  const renderContent = () => {
    switch (termType) {
      case 'service':
        return <ServiceTermsContent />;
      case 'privacy':
        return <PrivacyPolicyContent />;
      case 'sensitive-data':
        return <SensitiveDataContent />;
      case 'ai-analysis':
        return <AIAnalysisContent />;
      default:
        return null;
    }
  };

  return (
    <TermsLayout title={metadata.title} lastUpdated={metadata.lastUpdated}>
      {renderContent()}
    </TermsLayout>
  );
}

// Generate static params for all term types
export function generateStaticParams() {
  return VALID_TERM_TYPES.map((type) => ({
    type,
  }));
}
