/**
 * Sensitive Personal Data Agreement content
 */

import { Flex, Heading, Text, Callout } from '@radix-ui/themes';

export function SensitiveDataContent() {
  return (
    <Flex direction="column" gap="5">
      {/* Introduction */}
      <Flex direction="column" gap="3">
        <Callout.Root color="amber">
          <Callout.Text>
            <Text size="3" style={{ lineHeight: '1.6' }}>
              This agreement covers the collection and processing of sensitive personal data.
              Please read carefully and ensure you understand what information we collect and how
              we use it.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </Flex>

      {/* What is Sensitive Personal Data */}
      <Flex direction="column" gap="3">
        <Heading size="5">1. What is Sensitive Personal Data?</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Sensitive personal data refers to information that reveals intimate details about your
          mental and emotional state. In the context of ZeroGravity, this includes:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• <strong>Emotion Data:</strong> Your recorded emotional states, intensity levels, and frequency patterns</Text>
          <Text size="3">• <strong>Mental Health Information:</strong> Mood trends, emotional triggers, and psychological patterns</Text>
          <Text size="3">• <strong>Personal Diary Notes:</strong> Your written reflections, thoughts, and personal narratives</Text>
          <Text size="3">• <strong>Behavioral Patterns:</strong> Your emotional responses to specific situations or times</Text>
          <Text size="3">• <strong>Wellness Data:</strong> Information about your overall emotional well-being over time</Text>
        </Flex>
      </Flex>

      {/* Why We Collect Sensitive Data */}
      <Flex direction="column" gap="3">
        <Heading size="5">2. Why We Collect Sensitive Data</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We collect this sensitive information solely to provide you with the core functionality
          of ZeroGravity:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• <strong>Emotion Tracking:</strong> Record and store your emotional states over time</Text>
          <Text size="3">• <strong>Pattern Visualization:</strong> Display your emotional trends through charts and calendars</Text>
          <Text size="3">• <strong>Personal Insights:</strong> Generate statistics and summaries of your emotional journey</Text>
          <Text size="3">• <strong>Historical Access:</strong> Allow you to review past emotions and reflections</Text>
          <Text size="3">• <strong>Self-Awareness:</strong> Help you understand your emotional patterns and triggers</Text>
        </Flex>
      </Flex>

      {/* How We Protect Your Sensitive Data */}
      <Flex direction="column" gap="3">
        <Heading size="5">3. How We Protect Your Sensitive Data</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We implement stringent security measures specifically designed for sensitive data:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• <strong>Encryption:</strong> All sensitive data is encrypted both in transit (HTTPS/TLS) and at rest (AES-256)</Text>
          <Text size="3">• <strong>Access Controls:</strong> Strict authentication and authorization mechanisms ensure only you can access your data</Text>
          <Text size="3">• <strong>Secure Infrastructure:</strong> Data is stored on enterprise-grade secure servers with regular security audits</Text>
          <Text size="3">• <strong>Data Isolation:</strong> Your data is logically isolated from other users&apos; information</Text>
          <Text size="3">• <strong>Minimal Access:</strong> Only essential system processes can access your sensitive data</Text>
          <Text size="3">• <strong>No Human Access:</strong> Our staff cannot view your emotion data or diary notes under normal circumstances</Text>
        </Flex>
      </Flex>

      {/* Your Control Over Sensitive Data */}
      <Flex direction="column" gap="3">
        <Heading size="5">4. Your Control Over Sensitive Data</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          You maintain full control over your sensitive data:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• <strong>View:</strong> Access all your recorded emotions and notes at any time</Text>
          <Text size="3">• <strong>Edit:</strong> Modify or update your emotion records and diary entries</Text>
          <Text size="3">• <strong>Delete:</strong> Remove individual emotion records or diary notes</Text>
          <Text size="3">• <strong>Export:</strong> Request a complete copy of your data in a machine-readable format</Text>
          <Text size="3">• <strong>Complete Deletion:</strong> Delete your entire account and all associated sensitive data permanently</Text>
        </Flex>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          All data control functions are available through your account Settings page.
        </Text>
      </Flex>

      {/* Data Retention */}
      <Flex direction="column" gap="3">
        <Heading size="5">5. Data Retention</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We retain your sensitive data according to the following policy:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• <strong>Active Account:</strong> Data is retained indefinitely while your account is active</Text>
          <Text size="3">• <strong>Account Deletion:</strong> All sensitive data is permanently deleted within 30 days of account deletion</Text>
          <Text size="3">• <strong>Backup Systems:</strong> Deleted data is also purged from backup systems within 90 days</Text>
          <Text size="3">• <strong>No Recovery:</strong> Once deleted, sensitive data cannot be recovered</Text>
        </Flex>
      </Flex>

      {/* Third-Party Sharing */}
      <Flex direction="column" gap="3">
        <Heading size="5">6. Third-Party Sharing</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Your sensitive data is never sold, rented, or shared for marketing purposes. Limited
          sharing may occur only in these circumstances:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• <strong>Your Explicit Consent:</strong> When you specifically authorize sharing (e.g., AI analysis)</Text>
          <Text size="3">• <strong>Legal Requirement:</strong> If required by law, court order, or government request</Text>
          <Text size="3">• <strong>Safety Emergency:</strong> To prevent imminent harm to you or others</Text>
          <Text size="3">• <strong>Service Providers:</strong> With contractors who process data on our behalf under strict confidentiality agreements</Text>
        </Flex>
        <Callout.Root color="blue" style={{ marginTop: '1rem' }}>
          <Callout.Text>
            <Text size="3">
              <strong>Note:</strong> If you enable AI-powered analysis, your emotion data will be
              sent to Google Gemini AI. This is governed by a separate AI-Powered Analysis
              Agreement that requires explicit consent.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </Flex>

      {/* Important Limitations */}
      <Flex direction="column" gap="3">
        <Heading size="5">7. Important Limitations</Heading>
        <Callout.Root color="red">
          <Callout.Text>
            <Flex direction="column" gap="2">
              <Text size="3" weight="bold">
                ZeroGravity is NOT a medical device or mental health treatment service.
              </Text>
              <Text size="3">
                • The Service is designed for personal wellness tracking and self-awareness only
              </Text>
              <Text size="3">
                • It does not provide medical advice, diagnosis, or treatment
              </Text>
              <Text size="3">
                • It is not a substitute for professional mental health care
              </Text>
              <Text size="3">
                • If you are experiencing a mental health crisis, please contact a qualified
                mental health professional or emergency services immediately
              </Text>
            </Flex>
          </Callout.Text>
        </Callout.Root>
      </Flex>

      {/* Your Rights Under GDPR/Privacy Laws */}
      <Flex direction="column" gap="3">
        <Heading size="5">8. Your Rights Under Privacy Laws</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Depending on your jurisdiction, you may have additional rights regarding your sensitive
          data, including:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• Right to access your data</Text>
          <Text size="3">• Right to rectification of inaccurate data</Text>
          <Text size="3">• Right to erasure (&quot;right to be forgotten&quot;)</Text>
          <Text size="3">• Right to restrict processing</Text>
          <Text size="3">• Right to data portability</Text>
          <Text size="3">• Right to object to processing</Text>
          <Text size="3">• Right to withdraw consent at any time</Text>
        </Flex>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          To exercise these rights, please contact us through the Service or at our official
          support channels.
        </Text>
      </Flex>

      {/* Consent Requirement */}
      <Flex direction="column" gap="3">
        <Heading size="5">9. Consent Requirement</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          By agreeing to this Sensitive Personal Data Agreement, you explicitly consent to:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• The collection of your emotion data, diary notes, and related sensitive information</Text>
          <Text size="3">• The processing of this data to provide the Service functionality</Text>
          <Text size="3">• The storage of this data on our secure servers</Text>
          <Text size="3">• The use of this data for generating personal insights and visualizations</Text>
        </Flex>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem', fontWeight: 'bold' }}>
          This consent is required to use ZeroGravity. Without it, we cannot provide the emotion
          tracking and wellness features that are core to the Service.
        </Text>
      </Flex>

      {/* Contact */}
      <Flex direction="column" gap="3">
        <Heading size="5">10. Contact and Questions</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          If you have questions or concerns about how we handle your sensitive data, please
          contact us through the Service or at our official support channels. We are committed
          to addressing your privacy concerns promptly and transparently.
        </Text>
      </Flex>
    </Flex>
  );
}
