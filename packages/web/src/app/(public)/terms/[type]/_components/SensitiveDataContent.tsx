import { Callout, Heading, Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';

/*
 * ============================================
 * Component
 * ============================================
 */

/** Sensitive Personal Data Agreement content */
export function SensitiveDataContent() {
  return (
    <div className="mobile:gap-10 flex flex-col gap-8">
      {/* Introduction */}
      <section className="flex flex-col gap-3">
        <Callout.Root color="amber">
          <Callout.Icon className="mt-1">
            <Icon size={16}>warning</Icon>
          </Callout.Icon>
          <Callout.Text>
            <Text size="3" style={{ lineHeight: '1.6' }}>
              This agreement covers the collection and processing of sensitive personal data. Please read carefully and
              ensure you understand what information we collect and how we use it.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </section>

      {/* What is Sensitive Personal Data */}
      <section className="flex flex-col gap-3">
        <Heading size="5">1. What is Sensitive Personal Data?</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Sensitive personal data refers to information that reveals intimate details about your mental and emotional
          state. In the context of Zero Gravity, this includes:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Emotion Data:</strong> Your recorded emotional states, intensity levels, and frequency patterns
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Mental Health Information:</strong> Mood trends, emotional triggers, and psychological patterns
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Personal Diary Notes:</strong> Your written reflections, thoughts, and personal narratives
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Behavioral Patterns:</strong> Your emotional responses to specific situations or times
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Wellness Data:</strong> Information about your overall emotional well-being over time
            </Text>
          </li>
        </ul>
      </section>

      {/* Why We Collect Sensitive Data */}
      <section className="flex flex-col gap-3">
        <Heading size="5">2. Why We Collect Sensitive Data</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We collect this sensitive information solely to provide you with the core functionality of Zero Gravity:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Emotion Tracking:</strong> Record and store your emotional states over time
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Pattern Visualization:</strong> Display your emotional trends through charts and calendars
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Personal Insights:</strong> Generate statistics and summaries of your emotional journey
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Historical Access:</strong> Allow you to review past emotions and reflections
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Self-Awareness:</strong> Help you understand your emotional patterns and triggers
            </Text>
          </li>
        </ul>
      </section>

      {/* How We Protect Your Sensitive Data */}
      <section className="flex flex-col gap-3">
        <Heading size="5">3. How We Protect Your Sensitive Data</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We implement stringent security measures specifically designed for sensitive data:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Encryption:</strong> All sensitive data is encrypted both in transit (HTTPS/TLS) and at rest
              (AES-256)
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Access Controls:</strong> Strict authentication and authorization mechanisms ensure only you can
              access your data
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Secure Infrastructure:</strong> Data is stored on enterprise-grade secure servers with regular
              security audits
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Data Isolation:</strong> Your data is logically isolated from other users&apos; information
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Minimal Access:</strong> Only essential system processes can access your sensitive data
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>No Human Access:</strong> Our staff cannot view your emotion data or diary notes under normal
              circumstances
            </Text>
          </li>
        </ul>
      </section>

      {/* Your Control Over Sensitive Data */}
      <section className="flex flex-col gap-3">
        <Heading size="5">4. Your Control Over Sensitive Data</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          You maintain full control over your sensitive data:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>View:</strong> Access all your recorded emotions and notes at any time
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Edit:</strong> Modify or update your emotion records and diary entries
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Delete:</strong> Remove individual emotion records or diary notes
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Export:</strong> Request a complete copy of your data in a machine-readable format
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Complete Deletion:</strong> Delete your entire account and all associated sensitive data
              permanently
            </Text>
          </li>
        </ul>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          All data control functions are available through your account Settings page.
        </Text>
      </section>

      {/* Data Retention */}
      <section className="flex flex-col gap-3">
        <Heading size="5">5. Data Retention</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We retain your sensitive data according to the following policy:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Active Account:</strong> Data is retained indefinitely while your account is active
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Account Deletion:</strong> All sensitive data is permanently deleted within 30 days of account
              deletion
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Backup Systems:</strong> Deleted data is also purged from backup systems within 90 days
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>No Recovery:</strong> Once deleted, sensitive data cannot be recovered
            </Text>
          </li>
        </ul>
      </section>

      {/* Third-Party Sharing */}
      <section className="flex flex-col gap-3">
        <Heading size="5">6. Third-Party Sharing</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Your sensitive data is never sold, rented, or shared for marketing purposes. Limited sharing may occur only in
          these circumstances:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Your Explicit Consent:</strong> When you specifically authorize sharing (e.g., AI analysis)
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Legal Requirement:</strong> If required by law, court order, or government request
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Safety Emergency:</strong> To prevent imminent harm to you or others
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Service Providers:</strong> With contractors who process data on our behalf under strict
              confidentiality agreements
            </Text>
          </li>
        </ul>
        <Callout.Root color="blue" style={{ marginTop: '1rem' }}>
          <Callout.Icon className="mt-0.5">
            <Icon size={16}>sticky_note_2</Icon>
          </Callout.Icon>
          <Callout.Text>
            <Text size="3">
              <strong>Note:</strong> If you enable AI-powered analysis, your emotion data will be sent to Google Gemini
              AI. This is governed by a separate AI-Powered Analysis Agreement that requires explicit consent.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </section>

      {/* Important Limitations */}
      <section className="flex flex-col gap-3">
        <Heading size="5">7. Important Limitations</Heading>
        <Callout.Root color="red">
          <Callout.Icon className="mt-0.5">
            <Icon size={16}>warning</Icon>
          </Callout.Icon>
          <div className="flex flex-col gap-2">
            <Text size="3" weight="bold">
              Zero Gravity is NOT a medical device or mental health treatment service.
            </Text>
            <ul className="flex flex-col gap-1">
              <li>
                <Text size="3">• The Service is designed for personal wellness tracking and self-awareness only</Text>
              </li>
              <li>
                <Text size="3">• It does not provide medical advice, diagnosis, or treatment</Text>
              </li>
              <li>
                <Text size="3">• It is not a substitute for professional mental health care</Text>
              </li>
              <li>
                <Text size="3">
                  • If you are experiencing a mental health crisis, please contact a qualified mental health
                  professional or emergency services immediately
                </Text>
              </li>
            </ul>
          </div>
        </Callout.Root>
      </section>

      {/* Your Rights Under GDPR/Privacy Laws */}
      <section className="flex flex-col gap-3">
        <Heading size="5">8. Your Rights Under Privacy Laws</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Depending on your jurisdiction, you may have additional rights regarding your sensitive data, including:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• Right to access your data</Text>
          </li>
          <li>
            <Text size="3">• Right to rectification of inaccurate data</Text>
          </li>
          <li>
            <Text size="3">• Right to erasure (&quot;right to be forgotten&quot;)</Text>
          </li>
          <li>
            <Text size="3">• Right to restrict processing</Text>
          </li>
          <li>
            <Text size="3">• Right to data portability</Text>
          </li>
          <li>
            <Text size="3">• Right to object to processing</Text>
          </li>
          <li>
            <Text size="3">• Right to withdraw consent at any time</Text>
          </li>
        </ul>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          To exercise these rights, please contact us through the Service or at our official support channels.
        </Text>
      </section>

      {/* Consent Requirement */}
      <section className="flex flex-col gap-3">
        <Heading size="5">9. Consent Requirement</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          By agreeing to this Sensitive Personal Data Agreement, you explicitly consent to:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• The collection of your emotion data, diary notes, and related sensitive information</Text>
          </li>
          <li>
            <Text size="3">• The processing of this data to provide the Service functionality</Text>
          </li>
          <li>
            <Text size="3">• The storage of this data on our secure servers</Text>
          </li>
          <li>
            <Text size="3">• The use of this data for generating personal insights and visualizations</Text>
          </li>
        </ul>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem', fontWeight: 'bold' }}>
          This consent is required to use Zero Gravity. Without it, we cannot provide the emotion tracking and wellness
          features that are core to the Service.
        </Text>
      </section>

      {/* Contact */}
      <section className="flex flex-col gap-3">
        <Heading size="5">10. Contact and Questions</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          If you have questions or concerns about how we handle your sensitive data, please contact us through the
          Service or at our official support channels. We are committed to addressing your privacy concerns promptly and
          transparently.
        </Text>
      </section>
    </div>
  );
}
