import {
  cv,
  experience,
  profile,
  projects,
  socialLinks,
  techSkillAreas,
} from "@/content/portfolio";

/**
 * The whole portfolio as plain semantic HTML, for visitors, crawlers and
 * agents that don't run JavaScript. It's pre-rendered inside <noscript>.
 */
export const NoscriptContent = () => (
  <main
    aria-label={profile.name}
    style={{
      maxWidth: "48rem",
      margin: "0 auto",
      padding: "2rem 1.5rem",
      background: "#1f1e1d",
      color: "#e8e6e1",
      fontFamily: "system-ui, sans-serif",
      lineHeight: 1.6,
    }}
  >
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
