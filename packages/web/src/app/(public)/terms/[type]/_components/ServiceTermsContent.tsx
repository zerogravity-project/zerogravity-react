import { Heading, Text } from '@radix-ui/themes';

/*
 * ============================================
 * Component
 * ============================================
 */

/** Terms of Service content */
export function ServiceTermsContent() {
  return (
    <div className="mobile:gap-10 flex flex-col gap-8">
      {/* Introduction */}
      <section className="flex flex-col gap-3">
        <Heading size="5">1. Acceptance of Terms</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          By accessing and using ZeroGravity (&quot;Service&quot;), you accept and agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use the Service.
        </Text>
      </section>

      {/* Service Description */}
      <section className="flex flex-col gap-3">
        <Heading size="5">2. Service Description</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          ZeroGravity is an emotion tracking and personal wellness application that helps users monitor their emotional
          states, visualize patterns, and receive personalized insights. The Service includes web and browser extension
          platforms.
        </Text>
      </section>

      {/* User Accounts */}
      <section className="flex flex-col gap-3">
        <Heading size="5">3. User Accounts</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          You may create an account using supported OAuth providers (Google, Kakao). You are responsible for maintaining
          the confidentiality of your account and for all activities that occur under your account. You agree to
          immediately notify us of any unauthorized use of your account.
        </Text>
      </section>

      {/* User Responsibilities */}
      <section className="flex flex-col gap-3">
        <Heading size="5">4. User Responsibilities</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• Use the Service in any way that violates applicable laws or regulations</Text>
          </li>
          <li>
            <Text size="3">• Attempt to gain unauthorized access to any part of the Service</Text>
          </li>
          <li>
            <Text size="3">• Interfere with or disrupt the Service or servers</Text>
          </li>
          <li>
            <Text size="3">• Upload or transmit any harmful or malicious content</Text>
          </li>
          <li>
            <Text size="3">• Impersonate any person or entity</Text>
          </li>
        </ul>
      </section>

      {/* Data and Privacy */}
      <section className="flex flex-col gap-3">
        <Heading size="5">5. Data and Privacy</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Your use of the Service is also governed by our Privacy Policy and Sensitive Personal Data Agreement. We
          collect, process, and store your emotion data, personal notes, and related information as described in those
          documents.
        </Text>
      </section>

      {/* Intellectual Property */}
      <section className="flex flex-col gap-3">
        <Heading size="5">6. Intellectual Property</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          The Service and its original content, features, and functionality are owned by ZeroGravity and are protected
          by international copyright, trademark, and other intellectual property laws. You retain ownership of the
          content you create through the Service.
        </Text>
      </section>

      {/* Service Modifications */}
      <section className="flex flex-col gap-3">
        <Heading size="5">7. Service Modifications</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We reserve the right to modify or discontinue the Service at any time, with or without notice. We will not be
          liable to you or any third party for any modification, suspension, or discontinuation of the Service.
        </Text>
      </section>

      {/* Disclaimer of Warranties */}
      <section className="flex flex-col gap-3">
        <Heading size="5">8. Disclaimer of Warranties</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER
          EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. THE
          SERVICE IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL OR MENTAL HEALTH ADVICE.
        </Text>
      </section>

      {/* Limitation of Liability */}
      <section className="flex flex-col gap-3">
        <Heading size="5">9. Limitation of Liability</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZEROGRAVITY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
          INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
        </Text>
      </section>

      {/* Termination */}
      <section className="flex flex-col gap-3">
        <Heading size="5">10. Termination</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We may terminate or suspend your account and access to the Service immediately, without prior notice or
          liability, for any reason, including breach of these Terms. You may terminate your account at any time through
          the Settings page.
        </Text>
      </section>

      {/* Governing Law */}
      <section className="flex flex-col gap-3">
        <Heading size="5">11. Governing Law</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
          ZeroGravity operates, without regard to its conflict of law provisions.
        </Text>
      </section>

      {/* Changes to Terms */}
      <section className="flex flex-col gap-3">
        <Heading size="5">12. Changes to Terms</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new
          Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the Service after
          such modifications constitutes your acceptance of the updated Terms.
        </Text>
      </section>

      {/* Contact */}
      <section className="flex flex-col gap-3">
        <Heading size="5">13. Contact Us</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          If you have any questions about these Terms, please contact us through the Service or at our official support
          channels.
        </Text>
      </section>
    </div>
  );
}
