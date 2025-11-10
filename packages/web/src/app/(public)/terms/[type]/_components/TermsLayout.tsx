/**
 * Terms layout component
 * Shared layout for all terms pages
 */

import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';

import { Logo } from '@zerogravity/shared/components/ui/logo';

interface TermsLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function TermsLayout({ title, lastUpdated, children }: TermsLayoutProps) {
  return (
    <Box style={{ minHeight: '100vh', backgroundColor: 'var(--gray-1)', padding: '2rem 0' }}>
      <Container size="3">
        {/* Header */}
        <Flex direction="column" align="center" gap="4" mb="6">
          <Logo width={48} />
          <Flex direction="column" align="center" gap="2">
            <Heading size="8" align="center">
              {title}
            </Heading>
            <Text size="2" color="gray">
              Last Updated:{' '}
              {new Date(lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Flex>
        </Flex>

        {/* Content */}
        <Box
          style={{
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-4)',
            padding: '2rem',
            boxShadow: 'var(--shadow-2)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
