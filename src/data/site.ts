/**
 * Site-wide settings and copy — everything personal and every sentence on the page lives here
 * (the thumbnails themselves are in projects.ts).
 * Empty fields ('') are simply not rendered, so no placeholder data ever reaches production.
 */
export const site = {
  /** Your name as it should appear in the header, page title and footer. */
  name: 'Eduardo Martim',

  /** Short role shown next to (or instead of) the name. */
  role: 'Thumbnail Designer',

  /**
   * Production URL, e.g. 'https://yourname.com'. Needed so link previews (Discord, LinkedIn, X)
   * show the thumbnail. On Netlify, Vercel and Cloudflare Pages it is detected automatically.
   */
  url: '',

  /** Public contact email. */
  email: 'Eduardomartim71@gmail.com',

  /** Professional links, shown in the contact section in this order. */
  links: [
    // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-profile' },
    // { label: 'Behance', href: 'https://www.behance.net/your-profile' },
    // { label: 'X', href: 'https://x.com/your-handle' },
  ] as { label: string; href: string }[],

  /** Used for the meta description and social previews. */
  description:
    'Thumbnail design portfolio: Star Wars lore, documentary, mystery and gaming thumbnails, each built around one clear idea.',
};

export const hero = {
  /** The three ideas the first screen communicates, shown as one credit-style line. */
  keywords: ['Thumbnail design', 'Storytelling', 'Visual impact'],
  /** The main statement (the page's H1). */
  statement: 'YouTube thumbnails that tell the story before the title does.',
  /** Fields of work, shown under the statement. */
  fields: ['Star Wars lore', 'Documentary', 'Gaming'],
  /** How to use the gallery. Set to '' to hide. */
  hint: 'Select any piece to see it full size, or to preview it at real YouTube feed sizes.',
};

export const about = {
  statement: 'I design thumbnails around a single idea, composed to read at a glance — even at feed size.',
  body: 'One idea per frame: a face, a conflict or a question. My work leans toward story-driven content — Star Wars lore and character arcs, documentaries, mysteries and gaming — with composition, light and typography working together so every element points to the same idea.',
  capabilities: [
    'YouTube thumbnails & concepts',
    'Character-focused composition',
    'Visual storytelling',
    'Cinematic visual design',
    'Feed-size legibility',
    'Video & content visuals',
  ],
};

export const contact = {
  /** One line above the contact details. Set to '' to hide it. */
  availability: 'Open to thumbnail design roles.',
};

/** Small print under the copyright line. Set to '' to hide it. */
export const rightsNotice =
  'Star Wars, The Outlast Trials and Minecraft names, characters and logos belong to their respective owners (Lucasfilm, Red Barrels, Mojang Studios). This is a personal portfolio, not affiliated with or endorsed by them.';
