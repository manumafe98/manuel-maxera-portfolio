import {
  cv,
  experience,
  profile,
  projects,
  socialLinks,
  techSkillAreas,
} from "@/content/portfolio";

/**
 * Styles for NoscriptContent, in the Claude Code palette. They go in a
 * <style> inside the same <noscript>, so a browser running JavaScript reads
 * them as text and never applies them, and every rule is scoped to the
 * content's class so they reach nothing else even without JavaScript.
 */
export const noscriptStyles = `
.noscript-content {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 2.5rem max(1.5rem, calc((100% - 48rem) / 2));
  background: #1f1e1d;
  color: #e8e6e1;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}
.noscript-content h1 { font-size: 2.25rem; line-height: 1.2; font-weight: 700; margin: 0 0 0.5rem; }
.noscript-content h2 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; margin: 0 0 1rem; color: #d97757; }
.noscript-content h3 { font-size: 1.125rem; line-height: 1.4; font-weight: 600; margin: 1.25rem 0 0.25rem; }
.noscript-content p { margin: 0 0 0.75rem; }
.noscript-content ul { margin: 0 0 0.75rem; padding-left: 1.25rem; list-style: disc; }
.noscript-content li { margin: 0.25rem 0; }
.noscript-content section { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #34322f; }
.noscript-content section > ul > li > h3 { margin-top: 1rem; }
.noscript-content a { color: #e58a6a; text-decoration: underline; text-underline-offset: 2px; }
.noscript-content a:hover, .noscript-content a:focus-visible { color: #f0a88c; }
`;

/**
 * The whole portfolio as plain semantic HTML, for visitors, crawlers and
 * agents that don't run JavaScript. It's pre-rendered inside <noscript>,
 * after a <style> with noscriptStyles.
 */
export const NoscriptContent = () => (
  <main aria-label={profile.name} className="noscript-content">
    <header>
      <h1>{profile.name}</h1>
      <p>
        {profile.title}, {profile.location}
      </p>
      <p>{profile.summary}</p>
    </header>

    <section aria-labelledby="noscript-experience">
      <h2 id="noscript-experience">Experience</h2>
      {experience.map((role) => (
        <article key={`${role.company}-${role.title}`}>
          <h3>
            {role.title} at {role.company}
          </h3>
          <p>
            {role.start} to {role.end}, {role.location}
          </p>
          <ul>
            {role.achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>

    <section aria-labelledby="noscript-projects">
      <h2 id="noscript-projects">Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            {project.details?.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
            <p>
              <a href={project.repoUrl}>{project.name} code on GitHub</a>
            </p>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="noscript-skills">
      <h2 id="noscript-skills">Skills</h2>
      {techSkillAreas.map((area) => (
        <div key={area.area}>
          <h3>{area.area}</h3>
          <ul>
            {area.techSkills.map((techSkill) => (
              <li key={techSkill}>{techSkill}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section aria-labelledby="noscript-contact">
      <h2 id="noscript-contact">Contact</h2>
      <ul>
        <li>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        {socialLinks.map((link) => (
          <li key={link.name}>
            <a href={link.url}>{link.name}</a>
          </li>
        ))}
        <li>
          <a href={cv.path} download={cv.fileName}>
            Download the CV (PDF)
          </a>
        </li>
      </ul>
    </section>
  </main>
);
