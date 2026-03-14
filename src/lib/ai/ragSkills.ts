import { skills } from "@/common/skills";

export function buildSkillsRAG() {

  const skillTitles = skills.map((s) => s.title);

  return `
TECHNOLOGIES AND SKILLS:
${skillTitles.join(", ")}
`;
}