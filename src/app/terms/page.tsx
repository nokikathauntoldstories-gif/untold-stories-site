import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - සේවා කොන්දේසි",
  description: "නොකී කතා - Untold Stories වෙබ් අඩවියේ සේවා කොන්දේසි.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-400">මුල් පිටුව</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">Terms of Service</span>
      </nav>

      <h1 className="text-3xl font-bold text-gold-400 mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">සේවා කොන්දේසි | Last updated: April 2026</p>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using nokikatha.com (&quot;නොකී කතා - Untold Stories&quot;), you agree to be bound
            by these Terms of Service. If you do not agree with any part of these terms, you should not
            use our website.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">2. Description of Service</h2>
          <p>
            නොකී කතා - Untold Stories is a content website that publishes articles, stories, and
            multimedia content about mysteries, true crime, historical events, geopolitics, and
            psychology, primarily in the Sinhala language. The service is provided free of charge
            and is supported by advertising.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">3. Intellectual Property</h2>
          <p className="mb-3">
            All content published on this website, including but not limited to text, images, graphics,
            videos, and logos, is the property of නොකී කතා - Untold Stories or its content creators
            and is protected by copyright laws.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You may share links to our content on social media platforms.</li>
            <li>You may not reproduce, distribute, or republish our content without prior written permission.</li>
            <li>You may not use our content for commercial purposes without authorization.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">4. User Conduct</h2>
          <p className="mb-3">When using our website, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Interfere with or disrupt the website or its servers</li>
            <li>Use automated tools to scrape or download content</li>
            <li>Upload or transmit viruses or malicious code</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">5. Content Disclaimer</h2>
          <p>
            The stories and articles published on our website are for informational and educational
            purposes only. While we strive for accuracy, we make no guarantees about the completeness,
            reliability, or accuracy of the information. Some content may contain descriptions of
            violence, crime, or disturbing events. Reader discretion is advised.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">6. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites or services. We are not responsible
            for the content, privacy policies, or practices of any third-party sites. We encourage you
            to read the terms and privacy policies of any linked websites.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">7. Advertising</h2>
          <p>
            Our website displays advertisements provided by Google AdSense and potentially other
            advertising networks. These ads may be targeted based on your browsing history and
            interests. By using our website, you acknowledge that advertisements are part of the
            user experience. For more information about how advertising data is used, please refer
            to our <Link href="/privacy" className="text-gold-400 hover:text-gold-300 underline">Privacy Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">8. Limitation of Liability</h2>
          <p>
            නොකී කතා - Untold Stories and its operators shall not be held liable for any direct,
            indirect, incidental, consequential, or punitive damages arising from your use of
            the website, reliance on any content, or any errors or omissions in the content.
            The website is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
            warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless නොකී කතා - Untold Stories, its operators,
            and affiliates from any claims, damages, losses, or expenses arising from your use
            of the website or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">10. Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting to this page. Your continued use of the website
            after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">11. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws
            of Sri Lanka. Any disputes arising under these terms shall be subject to the exclusive
            jurisdiction of the courts of Sri Lanka.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">12. Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us via
            our <Link href="/contact" className="text-gold-400 hover:text-gold-300 underline">Contact Page</Link> or
            through our <a href="https://www.facebook.com/UntoldStoriesLK" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline">Facebook page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
