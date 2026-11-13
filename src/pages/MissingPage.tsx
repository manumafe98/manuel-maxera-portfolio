import { StaticPage } from "./StaticPage";

export const MissingPage = () => (
  <StaticPage eyebrow="404" heading="Page not found">
    <p>
      The page you asked for doesn't exist. It may have moved, or the link may
      be mistyped.
    </p>
  </StaticPage>
);
