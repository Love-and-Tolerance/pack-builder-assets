import { z } from "zod";

export type ConditionalBranch = z.infer<typeof ConditionalBranchSchema>;

const JavaBaseRepoSchema = z.object({
  mc_versions: z.string().describe("Current Minecraft version"),
  pack_format: z.string(),
  version: z.string(),
  url: z.string(),
});

const ConditionalBranchSchema = z.union([
  z.string(),
  z.object({
    trigger: z.string().describe("Trigger to select this branch"),
    value: z.string().describe("The branch selected"),
  }).array(),
]);

const ExclusiveAddonVariantSchema = z.object({
  name: z.string().describe("Display name"),
  id: z.string().describe("Internal ID, used in the filename"),
  image: z.string()
    .describe("Image used as pack.png instead of one from the repo")
    .optional(),
  description: z.string()
    .describe("Description displayed instead of one from the repo")
    .optional(),
  url: z.string().describe("GitHub repo URL").optional(),
  branch: ConditionalBranchSchema
    .describe("Branch used for this variant")
    .optional(),
  trigger: z.string()
    .describe(
      "Trigger name for conditional branches in other variants applied after this addon",
    )
    .optional(),
});

const ExclusiveAddonSchema = z.object({
  name: z.string().describe("Display name"),
  id_pos: z.number().describe("Position of this addon in selected addons list"),
  apply_order: z.number().describe("Order in which to apply this addon"),
  default_variant: z.string().describe("Default (recommended) variant ID"),
  variants: ExclusiveAddonVariantSchema.array(),
});

const RegularAddonSchema = z.object({
  name: z.string().describe("Display name"),
  id: z.string().describe("Internal ID, used in the filename"),
  default_enabled: z.boolean(),
  url: z.string(),
  branch: ConditionalBranchSchema.optional(),
});

const ModAddonSchema = z.object({
  name: z.string().describe("Display name"),
  id: z.string().describe("Internal ID, used in the filename"),
  default_enabled: z.boolean(),
  modloader: z.union([z.string(), z.string().array()]),
  url: z.string(),
  links: z.object({
    name: z.string(),
    url: z.string(),
  }).array(),
});

export const JavaAssetsSchema = z.object({
  templates: z.object({
    zips_path: z.string(),
    base_zip_name: z.string(),
    exclusive_addon_zip_name: z.string(),
    regular_addon_zip_name: z.string(),
    mod_addon_zip_name: z.string(),
    filename: z.string(),
  }),
  repos: z.object({
    base: JavaBaseRepoSchema.describe("Base repo information"),
    addons: z.object({
      exclusive: ExclusiveAddonSchema.array()
        .describe("Addons that can override each other"),
      regular: RegularAddonSchema.array()
        .describe("Regular addons which usually only add new content"),
      mods: ModAddonSchema.array()
        .describe("Addons adding mods support"),
    }),
  }),
});
