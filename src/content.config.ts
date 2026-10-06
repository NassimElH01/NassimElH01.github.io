// Content collections. Facts live in content/ and nowhere else.
// Rule: never guess. A missing fact is a string starting with "TODO:".
import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

/* ───────── shared helpers ───────── */

/** Explicit placeholder for a missing fact. Hidden in production, a badge in dev. */
const todo = z.string().regex(/^TODO:/, 'placeholder must start with "TODO:"');
const orTodo = <T extends z.ZodType>(schema: T) => z.union([schema, todo]);

/** Any non-empty text. It may itself be "TODO: …". */
const text = z.string().trim().min(1);

/** Bilingual text. Both keys are required, so a gap is a visible "TODO: translate". */
const localized = z.object({ en: text, da: text });
const localizedList = z.object({ en: z.array(text), da: z.array(text) });

/** Internal path (a page or a file in public/) or an absolute https URL. */
const href = z
  .string()
  .refine((value) => value.startsWith("/") || value.startsWith("https://"), 'use "/path" or "https://…"');

/** A repo link must name a specific repository, never the bare GitHub profile. */
const repoUrl = z
  .url({ protocol: /^https$/, hostname: /^github\.com$/ })
  .refine((value) => new URL(value).pathname.split("/").filter(Boolean).length >= 2, "link a specific repository");

const yearMonth = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "YYYY or YYYY-MM");
const year = z.number().int().min(2015).max(2030);

/* ───────── profile, languages, certifications (single-file collections) ───────── */

const profile = defineCollection({
  loader: file("./content/profile.yaml"),
  schema: z
    .object({
      name: text,
      /** The hero's statement in business language (serif, left of the bridge). */
      headline: localized,
      /** The same statement as code (mono, right of the bridge). Line breaks are kept. */
      headlineTech: localized,
      /** One line under the bridge. */
      tagline: localized,
      summary: localized,
      /** Presentation only: phrases About emphasises in the summary (each must occur in it). */
      summaryEmphasis: z.object({ role: localized, tools: localizedList }).optional(),
      // The texts above are drafts until the owner sets this to true. Shown on the site,
      // but `content:todos --strict` (the deploy gate on main) fails while it is false.
      approved: z.boolean().default(false),
      availability: localized.optional(),
      location: localized,
      links: z.object({
        linkedin: z.url({ protocol: /^https$/ }),
        github: z.url({ protocol: /^https$/ }),
      }),
      contact: z.object({
        email: orTodo(z.email()),
        phone: orTodo(z.string().regex(/^\+\d[\d ]{6,}$/)).optional(),
      }),
      interests: localizedList.optional(),
      /** The owner's own CV as a file in public/, and the language it is written in. */
      cv: z.object({ href, lang: z.enum(["en", "da"]) }).optional(),
    })
    .superRefine((profile, ctx) => {
      for (const lang of ["en", "da"] as const) {
        const emphasis = profile.summaryEmphasis;
        const phrases = emphasis ? [emphasis.role[lang], ...emphasis.tools[lang]] : [];
        for (const phrase of phrases) {
          if (!profile.summary[lang].includes(phrase)) {
            ctx.addIssue({ code: "custom", path: ["summaryEmphasis"], message: `"${phrase}" is not in summary.${lang}` });
          }
        }
      }
    }),
});

const languages = defineCollection({
  loader: file("./content/languages.yaml"),
  schema: z.object({
    name: localized,
    level: localized,
    order: z.number().int(),
  }),
});

const certifications = defineCollection({
  loader: file("./content/certifications.yaml"),
  schema: z.object({
    // The official name; bilingual only where the certificate itself is in one language.
    name: z.union([text, localized]),
    issuer: orTodo(text),
    year: orTodo(year),
    credentialUrl: orTodo(z.url({ protocol: /^https$/ })).optional(),
    credentialId: text.optional(),
    order: z.number().int(),
  }),
});

/* ───────── timeline: experience, education and volunteering ───────── */

const timeline = defineCollection({
  loader: glob({ base: "./content/timeline", pattern: "[^_]*.md" }),
  schema: z
    .object({
      kind: orTodo(z.enum(["education", "internship", "work", "volunteer"])),
      title: localized,
      organization: text,
      start: orTodo(yearMonth).optional(),
      end: z.union([yearMonth, z.literal("present"), todo]).optional(),
      // Only when every source lists it without dates (like the CV's "Øvrig erhvervserfaring").
      // An unknown date is "TODO: …", never undated.
      undated: z.boolean().default(false),
      expected: z.boolean().default(false),
      summary: localized,
      responsibilities: localizedList.default({ en: [], da: [] }),
      strengths: localizedList.optional(),
      tags: z.array(text).default([]),
      showOnPrintCv: z.boolean().default(true),
      order: z.number().int(),
      draft: z.boolean().default(false),
    })
    .superRefine((entry, ctx) => {
      if (entry.undated) {
        for (const key of ["start", "end"] as const) {
          if (entry[key] !== undefined) {
            ctx.addIssue({ code: "custom", path: [key], message: `leave out ${key} on an undated entry, or drop undated` });
          }
        }
      } else if (entry.start === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["start"],
          message: 'give a start date, or "TODO: …" if it is unknown (undated is only for entries the sources list without dates)',
        });
      }
    }),
});

/* ───────── projects: content/projects/*.md (owner workflow: /add-project) ───────── */

const projects = defineCollection({
  // Non-recursive, skips "_" files: content/projects/_id-map.md is never loaded.
  loader: glob({ base: "./content/projects", pattern: "[^_]*.md" }),
  schema: z
    .object({
      title: localized,
      // Leave out only for ongoing work inside a timeline entry, which then supplies the period.
      year: orTodo(year).optional(),
      context: orTodo(z.enum(["study", "internship", "work", "freelance", "personal"])),
      problem: localized,
      role: localized,
      method: localized,
      technology: z.array(text).default([]),
      result: localized,
      link: href.optional(),
      linkLabel: localized.optional(),
      // Further material, e.g. notebooks or reports, each with its own label.
      links: z.array(z.object({ label: localized, href })).default([]),
      repo: repoUrl.optional(),
      demo: z
        .object({
          kind: z.enum(["iframe", "download", "external"]),
          src: href,
          // Heavy demos never load before the visitor asks for them.
          loadOnClick: z.literal(true).default(true),
          needsCamera: z.boolean().default(false),
        })
        .optional(),
      timeline: reference("timeline").optional(),
      featured: z.boolean().default(false),
      order: z.number().int(),
      draft: z.boolean().default(false),
    })
    .refine((project) => project.year !== undefined || project.timeline !== undefined, {
      message: "give a year, or link the timeline entry whose period covers the project",
      path: ["year"],
    }),
});

/* ───────── skills: one YAML file per group from the brief ───────── */

const usage = z
  .object({
    context: z.enum(["study", "internship", "work", "freelance", "personal"]),
    timeline: reference("timeline").optional(),
    project: reference("projects").optional(),
    note: localized.optional(),
  })
  .refine((entry) => entry.timeline || entry.project || entry.note, "say where: timeline, project or note");

const skills = defineCollection({
  loader: glob({ base: "./content/skills", pattern: "[^_]*.yaml" }),
  schema: z.object({
    group: localized,
    order: z.number().int(),
    items: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: localized,
          // Items the brief marks [BEKRÆFT] stay hidden until the owner confirms them.
          confirm: z.boolean().default(false),
          certifications: z.array(reference("certifications")).default([]),
          // Where the skill was used. Never a level or a percentage.
          usedIn: z.union([z.array(usage).min(1), todo]),
        }),
      )
      .min(1),
  }),
});

export const collections = { profile, languages, certifications, timeline, projects, skills };
