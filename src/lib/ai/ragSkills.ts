import { skillsCategory } from "@/common/skills";

export function buildSkillsRAG() {

  // flatten categories → items
  const skillTitles = skillsCategory
    .flatMap((cat) => cat.items)
    .map((s) => s.title);

  return `
TECHNOLOGIES AND SKILLS:
${skillTitles.join(", ")}
`;
}