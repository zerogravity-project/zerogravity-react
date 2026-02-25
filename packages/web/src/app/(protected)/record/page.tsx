import type { Metadata } from 'next';

import RecordSelection from './_components/RecordSelection';

export const metadata: Metadata = {
  themeColor: '#111113',
};

export default function RecordSelectionPage() {
  return <RecordSelection />;
}
