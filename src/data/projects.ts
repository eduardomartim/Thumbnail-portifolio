/**
 * Portfolio content.
 *
 * To add a thumbnail:
 *   1. Put the image in src/assets/work/ (16:9, ideally 1280×720 or 1920×1080).
 *   2. Add an entry to `projects` below — the order of this list is the order on the page.
 *
 * In a "feature" section the first entry is shown large with its caption beside it;
 * everything after it continues in a two-column grid.
 */

export type SectionId = 'star-wars' | 'other';

export interface Section {
  id: SectionId;
  title: string;
  intro: string;
  layout: 'feature' | 'grid';
}

export interface Project {
  /** Unique slug — also used for the share link (#work-<id>). */
  id: string;
  /** File name inside src/assets/work/. */
  file: string;
  section: SectionId;
  /** Label shown on the page. */
  title: string;
  /**
   * true  → `title` is the text written on the thumbnail (shown in quotes).
   * false → `title` is a description, because the thumbnail has no headline (shown without quotes).
   */
  headline: boolean;
  /** Language of the on-image text as a BCP 47 tag — only set it when it isn't English (e.g. 'pt-BR'). */
  lang?: string;
  /** English translation of the on-image text, for non-English pieces. */
  translation?: string;
  /** Genre / format labels. */
  tags: string[];
  /** Optional: only if true — e.g. 'Personal project', 'Spec piece', 'Published on <channel>'. */
  context?: string;
  /** One line on the idea behind the piece. */
  note?: string;
  /** Optional: how it was made (tools, sources, AI assistance). Shown in the viewer when filled in. */
  process?: string;
  /** Description for screen readers and search engines. */
  alt: string;
}

export const sections: Section[] = [
  {
    id: 'star-wars',
    title: 'Star Wars / Lore',
    intro: 'Character arcs, duality and the dark side: lore told through faces fans already know.',
    layout: 'feature',
  },
  {
    id: 'other',
    title: 'Documentary, Mystery & Gaming',
    intro: 'Range outside Star Wars, built the same way: one idea per frame and a clear read at feed size.',
    layout: 'grid',
  },
];

export const projects: Project[] = [
  // — Star Wars / Lore —
  {
    id: 'anakin-between-masters',
    file: 'star-wars-anakin-between-masters.png',
    section: 'star-wars',
    title: 'Anakin between Obi‑Wan and Palpatine',
    headline: false,
    tags: ['Lore', 'Character arc'],
    note: 'The fall as a tug-of-war: Obi‑Wan in cold blue, Palpatine in red, and Anakin breaking apart between them as the helmet takes over.',
    alt: 'Star Wars thumbnail. Anakin Skywalker at the center, half of his face turning into Darth Vader’s helmet and one eye glowing red, his body and lightsaber breaking apart and both hands mechanical. A hooded Obi-Wan Kenobi in blue light stands on the left and a hooded Emperor Palpatine in red light on the right. Outlined text reads STAR WARS.',
  },
  {
    id: 'anakin-facts',
    file: 'star-wars-anakin-facts.png',
    section: 'star-wars',
    title: 'Anakin Facts',
    headline: true,
    tags: ['Lore', 'Facts'],
    note: 'One face, two identities. A split portrait and two words, built to stay readable at feed size.',
    alt: 'Star Wars thumbnail. An illustrated split portrait: the left half is Anakin Skywalker’s face, streaked with blood on one cheek; the right half is Darth Vader’s helmet. On the left, over red embers, large text reads ANAKIN FACTS, with FACTS in red.',
  },
  {
    id: 'kylo-ren-darth-vader',
    file: 'star-wars-kylo-ren-darth-vader.png',
    section: 'star-wars',
    title: 'Kylo Ren and Darth Vader in the snow',
    headline: false,
    tags: ['Characters', 'Legacy'],
    note: 'Grandson and grandfather, back to back in the snow. The red blade is the main warm light in a cold blue frame, echoed by embers in the trees.',
    alt: 'Star Wars thumbnail. Kylo Ren, holding a red crossguard lightsaber, and Darth Vader stand back to back, facing opposite ways, in a dark snowy blue forest. The STAR WARS logo sits across the lower half.',
  },

  // — Documentary, Mystery & Gaming —
  {
    id: 'ufos-final-proof',
    file: 'documentary-ufos.png',
    section: 'other',
    title: 'OVNIs: Prova Final?',
    headline: true,
    lang: 'pt-BR',
    translation: 'UFOs: The Final Proof?',
    tags: ['Documentary', 'Mystery'],
    note: 'Framed as an evidence file: classified documents, a UFO photo and a targeting-camera still around one extreme close-up, with the question in the title.',
    alt: 'Documentary thumbnail. An extreme close-up of a large-eyed grey-type alien on the left; above a dark pine forest, a flying saucer beams a person upward. Torn top-secret documents, a black-and-white UFO photo and an infrared targeting-camera still fill the corners. Text in Portuguese reads OVNIS: PROVA FINAL? — UFOs: the final proof?',
  },
  {
    id: 'ocean-mysteries',
    file: 'documentary-ocean.png',
    section: 'other',
    title: 'Mistérios do Oceano',
    headline: true,
    lang: 'pt-BR',
    translation: 'Ocean Mysteries',
    tags: ['Documentary', 'Nature'],
    note: 'One subject, one light source. The shark takes the left half; the title holds the open water, with “full documentary” as a quiet subline.',
    alt: 'Documentary thumbnail. A great white shark swims toward the camera under shafts of sunlight in deep blue water. Text in Portuguese reads MISTÉRIOS DO OCEANO, DOCUMENTÁRIO COMPLETO — Ocean mysteries, full documentary.',
  },
  {
    id: 'outlast-trials-invasion',
    file: 'gaming-outlast-trials.jpg',
    section: 'other',
    title: 'The Outlast Trials — Invasão',
    headline: true,
    lang: 'pt-BR',
    translation: 'The Outlast Trials — Invasion',
    tags: ['Gaming', 'Horror'],
    note: 'A red-versus-blue standoff on a reflective floor, with the title as the dividing line.',
    alt: 'Gaming thumbnail for The Outlast Trials. A glowing red horned silhouette and a glowing blue blocky figure face each other across a wet checkered floor under a single hanging lamp. Between them, the game’s logo and the word INVASÃO — invasion — in spiky metallic lettering.',
  },
  {
    id: 'minecraft-reaction',
    file: 'gaming-minecraft-reaction.png',
    section: 'other',
    title: 'Minecraft reaction',
    headline: false,
    tags: ['Gaming', 'Reaction'],
    note: 'Reaction format: the expression on the left, the threat it reacts to on the right.',
    alt: 'Gaming thumbnail without text. On the left, a young man in headphones shouts in reaction; on the right, a Minecraft night scene with a diamond-armored player, a burning fortress and the Ender Dragon.',
  },
];
