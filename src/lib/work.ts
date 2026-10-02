import type { ImageMetadata } from 'astro';
import { projects, sections, type Project, type SectionId } from '../data/projects';

// Extensions in any letter case: exported files often end in .PNG, .JPG or .Png.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/work/*.{[pP][nN][gG],[jJ][pP][gG],[jJ][pP][eE][gG],[wW][eE][bB][pP],[aA][vV][iI][fF]}',
  { eager: true },
);

const available = Object.keys(images).map((path) => path.replace('../assets/work/', ''));

/** Resolves a file name from src/assets/work/ to Astro image metadata (case-insensitive). */
export function imageFor(file: string): ImageMetadata {
  const exact = images[`../assets/work/${file}`];
  if (exact) return exact.default;

  const loose = available.find((name) => name.toLowerCase() === file.toLowerCase());
  if (loose) return images[`../assets/work/${loose}`].default;

  throw new Error(
    `[projects] "${file}" was not found in src/assets/work/.\n` +
      `Available files: ${available.join(', ') || '(none)'}`,
  );
}

export interface NumberedProject extends Project {
  /** 1-based position on the page, across all sections. */
  number: number;
}

/** Projects in page order (section by section), numbered continuously. */
export const orderedProjects: NumberedProject[] = sections
  .flatMap((section) => projects.filter((p) => p.section === section.id))
  .map((project, i) => ({ ...project, number: i + 1 }));

export function projectsIn(section: SectionId): NumberedProject[] {
  return orderedProjects.filter((p) => p.section === section);
}

/** Sections that actually have work in them, in page order. */
export const visibleSections = sections.filter((s) => projectsIn(s.id).length > 0);

export const pad = (n: number) => String(n).padStart(2, '0');

// Fail the build early on duplicate ids or projects pointing at an unknown section.
const ids = new Set<string>();
for (const p of projects) {
  if (ids.has(p.id)) throw new Error(`[projects] Duplicate id "${p.id}".`);
  ids.add(p.id);
  if (!sections.some((s) => s.id === p.section)) {
    throw new Error(`[projects] "${p.id}" uses unknown section "${p.section}".`);
  }
}
