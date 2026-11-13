import { gridTechSkills } from "@/content/portfolio";
import { techSkillIcons } from "./techSkillIcons";

/** Where the grid sits: the Files window, or a Chat on phones. */
export type TechSkillGridFrame = "window" | "chat";

const styles = {
  window: {
    list: "grid grid-cols-7 gap-y-4 mx-4 my-4",
    item: "flex flex-col items-center",
    icon: (techSkill: string) =>
      `${techSkill === "Hardhat" ? "mb-1.5" : "w-12 h-12"} transition-transform duration-300 hover:scale-110`,
    name: "text-white text-md text-center",
  },
  chat: {
    list: "cc-tags",
    item: "cc-tag",
    icon: () => undefined,
    name: undefined,
  },
} as const;

/** Every Tech skill with its logo, as one flat list. */
export const TechSkillGrid = ({ frame }: { frame: TechSkillGridFrame }) => {
  const style = styles[frame];
  return (
    <ul aria-label="Skills" className={style.list}>
      {gridTechSkills.map((techSkill) => {
        const Icon = techSkillIcons[techSkill];
        return (
          <li key={techSkill} className={style.item}>
            <Icon aria-hidden="true" className={style.icon(techSkill)} />
            <span className={style.name}>{techSkill}</span>
          </li>
        );
      })}
    </ul>
  );
};
