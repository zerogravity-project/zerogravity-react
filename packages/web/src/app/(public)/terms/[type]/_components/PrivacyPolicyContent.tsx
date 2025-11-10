/**
 * Privacy Policy content
 */

import { Flex, Heading, Text } from '@radix-ui/themes';

export function PrivacyPolicyContent() {
  return (
    <Flex direction="column" gap="5">
      {/* Introduction */}
      <Flex direction="column" gap="3">
        <Heading size="5">1. Introduction</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          ZeroGravity (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
          Service. Please read this policy carefully.
        </Text>
      </Flex>

      {/* Information We Collect */}
      <Flex direction="column" gap="3">
        <Heading size="5">2. Information We Collect</Heading>
        <Text size="3" style={{ lineHeight: '1.6', fontWeight: 'bold' }}>
          Account Information:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• Name, email address, and profile picture from OAuth providers</Text>
          <Text size="3">• OAuth provider information (Google, Kakao)</Text>
          <Text size="3">• Account creation date and last login time</Text>
        </Flex>
        <Text size="3" style={{ lineHeight: '1.6', fontWeight: 'bold', marginTop: '1rem' }}>
          Usage Information:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• Emotion tracking data (emotion levels, reasons, timestamps)</Text>
          <Text size="3">• Personal diary notes and reflections</Text>
          <Text size="3">• Interaction patterns and feature usage statistics</Text>
          <Text size="3">• Device information and browser type</Text>
          <Text size="3">• Timezone information for accurate data timestamping</Text>
        </Flex>
      </Flex>

      {/* How We Use Your Information */}
      <Flex direction="column" gap="3">
        <Heading size="5">3. How We Use Your Information</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We use the collected information for the following purposes:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• Provide and maintain the Service</Text>
          <Text size="3">• Create and manage your user account</Text>
          <Text size="3">• Track and visualize your emotional patterns over time</Text>
          <Text size="3">• Generate personalized insights and statistics</Text>
          <Text size="3">• Provide AI-powered analysis (if consent is given)</Text>
          <Text size="3">• Improve and optimize the Service</Text>
          <Text size="3">• Respond to your requests and support inquiries</Text>
          <Text size="3">• Send important service updates and notifications</Text>
        </Flex>
      </Flex>

      {/* Data Storage and Security */}
      <Flex direction="column" gap="3">
        <Heading size="5">4. Data Storage and Security</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We implement appropriate technical and organizational security measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction. Your data is stored on secure servers
          with encryption both in transit and at rest. However, no method of transmission over the Internet is 100%
          secure.
        </Text>
      </Flex>

      {/* Data Retention */}
      <Flex direction="column" gap="3">
        <Heading size="5">5. Data Retention</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We retain your personal information for as long as your account is active or as needed to provide you with the
          Service. If you delete your account, we will permanently delete your personal information within 30 days,
          except where we are required to retain it by law or for legitimate business purposes.
        </Text>
      </Flex>

      {/* Third-Party Services */}
      <Flex direction="column" gap="3">
        <Heading size="5">6. Third-Party Services</Heading>
        <Text size="3" style={{ lineHeight: '1.6', fontWeight: 'bold' }}>
          OAuth Providers:
        </Text>
        <Text size="3" style={{ lineHeight: '1.6' }} ml="4">
          We use Google and Kakao OAuth for authentication. When you sign in, these providers share basic profile
          information (name, email, profile picture) with us. Your use of these services is governed by their respective
          privacy policies.
        </Text>
        <Text size="3" style={{ lineHeight: '1.6', fontWeight: 'bold', marginTop: '1rem' }}>
          AI Services:
        </Text>
        <Text size="3" style={{ lineHeight: '1.6' }} ml="4">
          If you consent to AI-powered analysis, your emotion data may be sent to Google Gemini AI for processing.
          Please refer to our AI-Powered Analysis Agreement for more details.
        </Text>
      </Flex>

      {/* Data Sharing and Disclosure */}
      <Flex direction="column" gap="3">
        <Heading size="5">7. Data Sharing and Disclosure</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We do not sell, trade, or rent your personal information to third parties. We may share your information only
          in the following circumstances:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">• With your explicit consent</Text>
          <Text size="3">• To comply with legal obligations or court orders</Text>
          <Text size="3">• To protect our rights, property, or safety</Text>
          <Text size="3">• In connection with a business transfer or merger</Text>
          <Text size="3">
            • With service providers who assist in operating the Service (under strict confidentiality agreements)
          </Text>
        </Flex>
      </Flex>

      {/* Your Rights */}
      <Flex direction="column" gap="3">
        <Heading size="5">8. Your Rights</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          You have the following rights regarding your personal information:
        </Text>
        <Flex direction="column" gap="2" ml="4">
          <Text size="3">
            • <strong>Access:</strong> Request a copy of your personal data
          </Text>
          <Text size="3">
            • <strong>Correction:</strong> Update or correct inaccurate information
          </Text>
          <Text size="3">
            • <strong>Deletion:</strong> Request deletion of your account and data
          </Text>
          <Text size="3">
            • <strong>Portability:</strong> Request your data in a machine-readable format
          </Text>
          <Text size="3">
            • <strong>Consent Withdrawal:</strong> Withdraw consent for optional data processing
          </Text>
        </Flex>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          You can exercise these rights through your account Settings page or by contacting us.
        </Text>
      </Flex>

      {/* Cookies and Tracking */}
      <Flex direction="column" gap="3">
        <Heading size="5">9. Cookies and Tracking</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We use cookies and similar tracking technologies to maintain your session, remember your preferences, and
          analyze Service usage. Essential cookies are required for the Service to function properly. You can control
          cookie settings through your browser, but disabling cookies may affect Service functionality.
        </Text>
      </Flex>

      {/* Children&apos;s Privacy */}
      <Flex direction="column" gap="3">
        <Heading size="5">10. Children&apos;s Privacy</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          The Service is not intended for children under 13 years of age. We do not knowingly collect personal
          information from children under 13. If we learn that we have collected information from a child under 13, we
          will promptly delete that information.
        </Text>
      </Flex>

      {/* International Data Transfers */}
      <Flex direction="column" gap="3">
        <Heading size="5">11. International Data Transfers</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Your information may be transferred to and processed in countries other than your country of residence. We
          ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy
          Policy.
        </Text>
      </Flex>

      {/* Changes to This Policy */}
      <Flex direction="column" gap="3">
        <Heading size="5">12. Changes to This Policy</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the
          new policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this policy
          periodically.
        </Text>
      </Flex>

      {/* Contact Us */}
      <Flex direction="column" gap="3">
        <Heading size="5">13. Contact Us</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          If you have any questions about this Privacy Policy or our data practices, please contact us through the
          Service or at our official support channels.
        </Text>
      </Flex>
    </Flex>
  );
}
