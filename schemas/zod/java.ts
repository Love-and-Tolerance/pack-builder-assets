import { z } from "zod";

export type ConditionalBranch = z.infer<typeof ConditionalBranchSchema>;
export type ConditionalLicense = z.infer<typeof ConditionalLicenseSchema>;

export type BasicAddon = z.infer<typeof BasicAddonSchema>;

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

const ConditionalLicenseSchema = z.union([
  z.boolean(),
  z.object({
    trigger: z.string().describe("Trigger to select this license"),
    value: z.union([z.boolean(), z.string()])
      .describe(
        "License path or boolean value to enable copying license from the zip",
      ),
  }).array(),
]);

const AddonLinkSchema = z.object({
  name: z.string(),
  url: z.string().or(
    z.object({
      name: z.string(),
      value: z.string(),
    }).array(),
  ),
});

const VariantSchema = z.object({
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

const VariantAddonSchema = z.object({
  name: z.string().describe("Display name"),
  id_pos: z.number().describe("Position of this addon in selected addons list"),
  apply_order: z.number().describe("Order in which to apply this addon"),
  default_variant: z.string().describe("Default (recommended) variant ID"),
  variants: VariantSchema.array(),
  license: ConditionalLicenseSchema.optional(),
});

const BasicAddonSchema = z.object({
  id: z.string(),
  name: z.string(),
  recommended: z.boolean(),
  url: z.string(),
  description: z.string().optional(),

  info: z.string().array().optional(),
  links: AddonLinkSchema.array().optional(),

  branch: ConditionalBranchSchema.optional(),
  license: ConditionalLicenseSchema.optional(),
});

export const JavaAssetsSchema = z.object({
  templates: z.object({
    zips_path: z.string(),
    base_zip_name: z.string(),
    variant_addon_zip_name: z.string(),
    regular_addon_zip_name: z.string(),
    mod_addon_zip_name: z.string(),
    filename: z.string(),
  }),
  repos: z.object({
    base: JavaBaseRepoSchema.describe("Base repo information"),
    addons: z.object({
      exclusive: VariantAddonSchema.array()
        .describe("Addons that can override each other"),
      regular: BasicAddonSchema.array()
        .describe("Regular addons which usually only add new content"),
      mods: BasicAddonSchema.array()
        .describe("Addons adding mods support"),
    }),
  }),
});
