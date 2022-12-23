import { z } from "zod";

export const DowngradeLangSchema = z.object({
  extends: z.string().optional().describe("Lang code to inherit from"),
  set: z.record(z.string()).optional()
    .describe("Lang entries to set in current lang"),
  remove: z.string().array().optional()
    .describe("List of lang entries to remove"),
});

export const MoveSchema = z.object({
  from: z.union([z.string(), z.string().array()]),
  to: z.string(),
});

export const FormatDowngradeSchema = z.object({
  extends: z.string().optional().describe("Pack version to inherit from"),
  langs: z.record(DowngradeLangSchema).optional(),
  files: z.object({
    copy: z.boolean().optional()
      .describe("Enable copying files from the corresponding zip"),
    move: MoveSchema.array().optional(),
    remove: z.string().array().optional(),
  }).optional(),
});

export const DowngradesSchema = z.object({
  templates: z.object({
    format_name: z.string(),
    format_path: z.string(),
    zips_path: z.string(),
  }),
  pack_formats: z.object({
    versions: z.string().array(),
  }),
  version_names: z.record(z.string()),
});
