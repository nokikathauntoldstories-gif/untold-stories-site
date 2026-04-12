import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
  description: "නොකී කතා - Untold Stories වෙබ් අඩවියේ පෞද්ගලිකත්ව ප්‍රතිපත්තිය.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gold-400">මුල් පිටුව</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gold-400 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">පෞද්ගලිකත්ව ප්‍රතිපත්තිය | Last updated: April 2026</p>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">1. Introduction</h2>
          <p>
            Welcome to නොකී කතා - Untold Stories (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible at nokikatha.com.
            We are committed to protecting your privacy and ensuring a safe online experience.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">2. Information We Collect</h2>
          <h3 className="text-gray-200 font-medium mb-2">Automatically Collected Information</h3>
          <p className="mb-3">When you visit our website, we may automatically collect certain information, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address and browser type</li>
            <li>Device information (operating system, screen resolution)</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring website or source</li>
            <li>Language preferences</li>
          </ul>

          <h3 className="text-gray-200 font-medium mt-4 mb-2">Cookies and Tracking Technologies</h3>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience,
            analyze site traffic, and serve personalized advertisements through Google AdSense.
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">3. Google AdSense & Third-Party Advertising</h2>
          <p className="mb-3">
            We use Google AdSense to display advertisements on our website. Google AdSense may use
            cookies and web beacons to collect information about your visits to this and other websites
            to provide relevant advertisements.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google uses the DoubleClick cookie to serve ads based on your visit to this site and other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline">Google Ads Settings</a>.</li>
            <li>You can also opt out of third-party vendor cookies by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline">aboutads.info</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">4. How We Use Your Information</h2>
          <p className="mb-3">We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate and maintain our website</li>
            <li>Improve user experience and website performance</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Display relevant advertisements via Google AdSense</li>
            <li>Prevent fraud and ensure website security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">5. Data Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties,
            except for trusted third parties who assist us in operating our website (such as Google AdSense),
            provided they agree to keep this information confidential. We may also release information
            when required by law or to protect our rights, property, or safety.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information.
            However, no method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security of data transmitted to our website.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">7. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under the age of 13. We do not knowingly collect
            personal information from children. If you believe a child has provided us with personal
            information, please contact us and we will take steps to delete such information.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">8. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of personalized advertising</li>
            <li>Disable cookies through your browser settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page
            with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-gold-400 font-semibold text-lg mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via
            our <Link href="/contact" className="text-gold-400 hover:text-gold-300 underline">Contact Page</Link> or
            through our <a href="https://www.facebook.com/UntoldStoriesLK" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline">Facebook page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
