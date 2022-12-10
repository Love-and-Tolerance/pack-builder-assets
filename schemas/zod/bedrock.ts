import { z } from "zod";

const BedrockBaseRepoSchema = z.object({
  mc_versions: z.string().describe("Current Minecraft version"),
  pack_format: z.string(),
  tag: z.string(),
  version: z.string(),
  filename: z.string(),
  url: z.string(),
});

const BedrockAddonSchema = z.object({
  name: z.string(),
  filename: z.string(),
  url: z.string(),
});

export const BedrockAssetsSchema = z.object({
  templates: z.object({
    asset_url: z.string(),
  }),
  repos: z.object({
    base: BedrockBaseRepoSchema.describe("Base repo information"),
    addons: BedrockAddonSchema.array(),
  }),
});
