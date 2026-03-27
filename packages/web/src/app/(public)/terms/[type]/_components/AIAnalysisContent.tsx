import { Callout, Heading, Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';

/*
 * ============================================
 * Component
 * ============================================
 */

/** AI-Powered Analysis Agreement content */
export function AIAnalysisContent() {
  return (
    <div className="mobile:gap-10 flex flex-col gap-8">
      {/* Critical Warning */}
      <Callout.Root color="red" size="2">
        <Callout.Icon className="mt-0.5">
          <Icon size={16}>warning</Icon>
        </Callout.Icon>
        <div className="flex flex-col gap-2">
          <Text size="3" weight="bold">
            IMPORTANT: Data Transmission is Irreversible
          </Text>
          <Text size="3">
            Once your emotion data is sent to AI systems for analysis, it cannot be retrieved or deleted from those
            external systems. This consent is optional, but the decision should be made carefully as it cannot be
            undone.
          </Text>
        </div>
      </Callout.Root>

      {/* Introduction */}
      <section className="flex flex-col gap-3">
        <Heading size="5">1. Overview of AI-Powered Analysis</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          ZeroGravity offers optional AI-powered analysis to provide personalized insights based on your emotion
          tracking data. This feature uses Google Gemini AI, a third-party artificial intelligence service, to analyze
          patterns in your emotional data and generate meaningful insights.
        </Text>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          <strong>This feature is completely optional.</strong> You can use ZeroGravity&apos;s core emotion tracking,
          visualization, and statistics features without enabling AI analysis.
        </Text>
      </section>

      {/* What Data is Sent to AI */}
      <section className="flex flex-col gap-3">
        <Heading size="5">2. What Data is Sent to AI Systems</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          If you enable AI-powered analysis, the following data will be transmitted to Google Gemini AI:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Emotion Records:</strong> Your recorded emotional states, intensity levels, and timestamps
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Emotion Reasons:</strong> The reasons you provided for your emotional states
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Diary Notes:</strong> Your written reflections and personal notes (if applicable)
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Temporal Context:</strong> Date and time information for pattern analysis
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Aggregated Patterns:</strong> Summary statistics of your emotional trends
            </Text>
          </li>
        </ul>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          <strong>What is NOT sent:</strong> Your name, email address, profile picture, and other account identification
          information are not included in AI analysis requests.
        </Text>
      </section>

      {/* How AI Analysis Works */}
      <section className="flex flex-col gap-3">
        <Heading size="5">3. How AI Analysis Works</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          The AI analysis process works as follows:
        </Text>
        <ol className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">1. You request an AI analysis through the Service</Text>
          </li>
          <li>
            <Text size="3">2. Your emotion data is sent to Google Gemini AI via secure API</Text>
          </li>
          <li>
            <Text size="3">3. The AI processes your data and generates personalized insights</Text>
          </li>
          <li>
            <Text size="3">4. The insights are returned to ZeroGravity and displayed to you</Text>
          </li>
          <li>
            <Text size="3">5. The insights are stored on our servers for your future reference</Text>
          </li>
        </ol>
      </section>

      {/* AI Analysis Results Caching */}
      <section className="flex flex-col gap-3">
        <Heading size="5">4. Analysis Results and Caching</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          To provide a better user experience and reduce unnecessary AI requests:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• AI analysis results are stored in our database for 24 hours</Text>
          </li>
          <li>
            <Text size="3">
              • If you request the same analysis within 24 hours, stored results are displayed instead of generating new
              ones
            </Text>
          </li>
          <li>
            <Text size="3">• After 24 hours, new AI requests will be sent for updated insights</Text>
          </li>
          <li>
            <Text size="3">• You can view previously generated analyses even after withdrawing AI consent</Text>
          </li>
        </ul>
        <Callout.Root color="blue" style={{ marginTop: '1rem' }}>
          <Callout.Icon className="mt-0.5">
            <Icon size={16}>sticky_note_2</Icon>
          </Callout.Icon>
          <Callout.Text>
            <Text size="3">
              <strong>Note:</strong> If you withdraw AI consent, you can still view previously generated insights stored
              in our database, but no new AI analysis requests will be sent on your behalf.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </section>

      {/* Data Transmission Security */}
      <section className="flex flex-col gap-3">
        <Heading size="5">5. Data Transmission Security</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          We implement the following security measures when transmitting your data to AI systems:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Encrypted Transmission:</strong> All data is sent via HTTPS/TLS encrypted connections
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>API Authentication:</strong> Secure API keys authenticate requests to Google Gemini AI
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Data Minimization:</strong> Only necessary data is sent; personal identifiers are excluded
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Secure Infrastructure:</strong> Communication occurs through hardened server infrastructure
            </Text>
          </li>
        </ul>
      </section>

      {/* Third-Party AI Provider */}
      <section className="flex flex-col gap-3">
        <Heading size="5">6. Third-Party AI Provider: Google Gemini</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          Google Gemini AI is a third-party service provided by Google LLC. When your data is sent to Gemini AI:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• Google processes your data according to their privacy policy and terms of service</Text>
          </li>
          <li>
            <Text size="3">• Google may use your data to improve their AI models and services</Text>
          </li>
          <li>
            <Text size="3">• Google&apos;s data retention and deletion policies apply to your transmitted data</Text>
          </li>
          <li>
            <Text size="3">• ZeroGravity has no control over how Google stores, uses, or deletes your data</Text>
          </li>
        </ul>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
          We recommend reviewing Google&apos;s privacy policy and AI data usage policies before enabling this feature:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• Google Privacy Policy: https://policies.google.com/privacy</Text>
          </li>
          <li>
            <Text size="3">• Google AI Principles: https://ai.google/principles/</Text>
          </li>
        </ul>
      </section>

      {/* Irreversibility of Data Transmission */}
      <section className="flex flex-col gap-3">
        <Heading size="5">7. Irreversibility of Data Transmission</Heading>
        <Callout.Root color="red">
          <Callout.Icon className="mt-0.5">
            <Icon size={16}>warning</Icon>
          </Callout.Icon>
          <div className="flex flex-col gap-2">
            <Text size="3" weight="bold">
              Critical Understanding Required:
            </Text>
            <Text size="3">
              Once your emotion data is transmitted to Google Gemini AI, it cannot be retrieved, deleted, or controlled
              by ZeroGravity or by you. This is a permanent action with the following implications:
            </Text>
            <ul className="ml-4 flex flex-col gap-2">
              <li>
                <Text size="3">• You cannot request deletion of data already sent to Google&apos;s AI systems</Text>
              </li>
              <li>
                <Text size="3">
                  • ZeroGravity cannot retrieve or remove your data from Google&apos;s infrastructure
                </Text>
              </li>
              <li>
                <Text size="3">• Withdrawing consent only prevents future transmissions, not past ones</Text>
              </li>
              <li>
                <Text size="3">
                  • Deleting your ZeroGravity account does not delete data in Google&apos;s AI systems
                </Text>
              </li>
              <li>
                <Text size="3">• Google may retain and process your data according to their own policies</Text>
              </li>
            </ul>
          </div>
        </Callout.Root>
      </section>

      {/* Withdrawing Consent */}
      <section className="flex flex-col gap-3">
        <Heading size="5">8. Withdrawing AI Analysis Consent</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          You can withdraw your consent for AI-powered analysis at any time through your account Settings page. When you
          withdraw consent:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">
              • <strong>Future Requests Stopped:</strong> No new AI analysis requests will be sent
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Past Results Preserved:</strong> Previously generated insights remain accessible in your account
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Past Data Transmission Unaffected:</strong> Data already sent to Google cannot be deleted
            </Text>
          </li>
          <li>
            <Text size="3">
              • <strong>Re-enabling Available:</strong> You can re-enable AI analysis at any time
            </Text>
          </li>
        </ul>
        <Callout.Root color="amber" style={{ marginTop: '1rem' }}>
          <Callout.Icon className="mt-0.5">
            <Icon size={16}>warning</Icon>
          </Callout.Icon>
          <Callout.Text>
            <Text size="3">
              <strong>Important:</strong> Withdrawing consent does not delete data that has already been transmitted to
              Google Gemini AI. It only prevents future data transmissions.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </section>

      {/* Limitations and Disclaimers */}
      <section className="flex flex-col gap-3">
        <Heading size="5">9. Limitations and Disclaimers</Heading>
        <Callout.Root color="amber">
          <Callout.Icon className="mt-0.5">
            <Icon size={16}>warning</Icon>
          </Callout.Icon>
          <div className="flex flex-col gap-2">
            <Text size="3" weight="bold">
              AI Analysis is NOT Professional Advice:
            </Text>
            <ul className="flex flex-col gap-1">
              <li>
                <Text size="3">• AI-generated insights are based on pattern recognition and statistical analysis</Text>
              </li>
              <li>
                <Text size="3">• They are not a substitute for professional mental health advice or treatment</Text>
              </li>
              <li>
                <Text size="3">• AI may produce inaccurate, biased, or misleading insights</Text>
              </li>
              <li>
                <Text size="3">• ZeroGravity does not validate or guarantee the accuracy of AI-generated content</Text>
              </li>
              <li>
                <Text size="3">• For mental health concerns, always consult qualified professionals</Text>
              </li>
            </ul>
          </div>
        </Callout.Root>
      </section>

      {/* Your Consent */}
      <section className="flex flex-col gap-3">
        <Heading size="5">10. Your Explicit Consent</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          By agreeing to this AI-Powered Analysis Agreement, you explicitly acknowledge and consent to the following:
        </Text>
        <ul className="ml-4 flex flex-col gap-2">
          <li>
            <Text size="3">• You understand that your emotion data will be sent to Google Gemini AI</Text>
          </li>
          <li>
            <Text size="3">• You acknowledge that this data transmission is irreversible and permanent</Text>
          </li>
          <li>
            <Text size="3">• You accept that transmitted data cannot be deleted from AI systems</Text>
          </li>
          <li>
            <Text size="3">• You have reviewed Google&apos;s privacy policies and understand their data practices</Text>
          </li>
          <li>
            <Text size="3">• You understand the limitations of AI-generated insights</Text>
          </li>
          <li>
            <Text size="3">• You accept the risks associated with third-party AI data processing</Text>
          </li>
          <li>
            <Text size="3">• You agree that ZeroGravity is not liable for how Google processes your data</Text>
          </li>
        </ul>
        <Text size="3" style={{ lineHeight: '1.6', marginTop: '1rem', fontWeight: 'bold' }}>
          This consent is optional. You can fully use ZeroGravity without enabling AI analysis.
        </Text>
      </section>

      {/* Contact and Questions */}
      <section className="flex flex-col gap-3">
        <Heading size="5">11. Questions and Concerns</Heading>
        <Text size="3" style={{ lineHeight: '1.6' }}>
          If you have questions about AI-powered analysis or concerns about data transmission to third-party AI systems,
          please contact us through the Service or at our official support channels before enabling this feature.
        </Text>
      </section>
    </div>
  );
}
