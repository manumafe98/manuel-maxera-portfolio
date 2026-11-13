import { profile } from "@/content/portfolio";
import type { ReactNode } from "react";
import { StaticPage } from "./StaticPage";

/** Change this whenever the policy below changes. */
const LAST_UPDATED = "13 November 2026";

const Section = ({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) => (
  <section aria-labelledby={id} className="space-y-2">
    <h2 id={id} className="text-lg font-semibold text-(--cc-text)">
      {heading}
    </h2>
    {children}
  </section>
);

const link = "underline hover:text-(--cc-accent)";

export const PrivacyPage = () => (
  <StaticPage heading="Privacy" backLinkOnTop>
    <p>
      This site collects as little as it can. Here is everything it does with
      data.
    </p>
    <Section id="privacy-analytics" heading="Analytics">
      <p>
        The site uses Cloudflare Web Analytics to count visits. It doesn't use
        cookies or any other storage on your device, and it doesn't track you
        across sites or build a profile of you. Manuel only sees aggregated
        numbers, such as page views, referring sites, countries and browsers.
      </p>
    </Section>
    <Section id="privacy-contact-form" heading="Contact form">
      <p>
        When you send the contact form, your email address and your message are
        sent through EmailJS to Manuel's inbox. They are used only to reply to
        you, and aren't added to any mailing list.
      </p>
    </Section>
    <Section id="privacy-cookies" heading="Cookies">
      <p>The site sets no cookies, so there's no cookie banner.</p>
    </Section>
    <Section id="privacy-sharing" heading="Sharing">
      <p>Your data is never sold or shared with anyone else.</p>
    </Section>
    <Section id="privacy-questions" heading="Questions">
      <p>
        To ask about your data, or to have your messages deleted, email{" "}
        <a href={`mailto:${profile.email}`} className={link}>
          {profile.email}
        </a>
        .
      </p>
    </Section>
    <p className="text-sm">Last updated: {LAST_UPDATED}</p>
  </StaticPage>
);
