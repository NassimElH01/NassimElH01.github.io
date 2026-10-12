// In-page anchor ids, shared by the sections that are linked (Projects, Experience,
// Skills) and the sections that link to them, so a link can never drift from its target.

/** A project in Projects: a featured entry's heading, or a list row's summary. */
export const projectAnchor = (id: string) => `project-${id}`;

/** A timeline entry in Experience (its heading). */
export const timelineAnchor = (id: string) => `timeline-${id}`;

/** A skill in Skills (its headword). */
export const skillAnchor = (id: string) => `skill-${id}`;

/** A skill group in Skills (its heading). */
export const skillGroupAnchor = (id: string) => `skills-group-${id}`;
