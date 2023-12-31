import "console_colors";
import { run } from "run_simple";
import { BasicAddon, JavaAssetsSchema } from "../schemas/zod/java.ts";
import { clean } from "./tasks/clean.ts";
import { initRepo } from "./tasks/initRepo.ts";
import { collectBranches } from "./utils/collectBranches.ts";
import { compress } from "./utils/compress.ts";
import { getAddonFiles } from "./utils/getAddonFiles.ts";
import { readJson } from "./utils/json.ts";

interface ZipInfo {
  name: string;
  files: string | string[];
}

const isProduction = Deno.env.get("DENO_ENV") === "production";

if (isProduction) {
  console.info("Image optimization enabled!".green.text_bold);
} else {
  const msg = 'Set DENO_ENV to "production" to enable image optimization.';
  console.warn(msg.yellow.text_bold);
}

console.log("");
console.info("Reading json files ...".blue.text_bold);

const JAVA_ASSETS = readJson("assets/java.json", JavaAssetsSchema);

const ZIPS_DIR = ".temp/zips";
const REPOS_DIR = ".temp/repos";
const JAVA_ZIPS_DIR = JAVA_ASSETS.templates.zips_path.replace("{name}.zip", "");

const zipStack: ZipInfo[] = [];

async function prepareRepo(
  name: string,
  url: string,
  branch: string,
  files: string | string[],
): Promise<void> {
  const outputDir = `${REPOS_DIR}/${name}`;
  await initRepo(outputDir, url, branch);

  zipStack.push({ name, files });
}

clean(`${ZIPS_DIR}/${JAVA_ZIPS_DIR}`, REPOS_DIR);

console.log("");
console.info("Processing repos ...".blue.text_bold);

console.log("");
console.info("Processing base ...".blue.text_bold);
await prepareRepo("BASE", JAVA_ASSETS.repos.base.url, "HEAD", [
  "assets",
  "LICENSE",
  "pack.png",
  "pack.mcmeta",
  "README.md",
]);

console.log("");
console.info("Processing exclusive addons ...".blue.text_bold);

for (const addon of JAVA_ASSETS.repos.addons.exclusive) {
  console.log("");
  console.info(`Processing addon "${addon.name}" ...`.blue.text_bold);

  for (const variant of addon.variants) {
    const { url } = variant;

    if (url === undefined) {
      console.log("");
      console.info(`Skipping empty variant "${variant.name}"`.cyan.text_bold);
      continue;
    }

    console.log("");
    console.info(`Processing variant "${variant.name}" ...`.cyan.text_bold);

    const branches = collectBranches(variant.branch);
    const filenameTemplate = JAVA_ASSETS.templates.variant_addon_zip_name
      .replace("{id_pos}", addon.id_pos.toString())
      .replace("{variant}", variant.id);

    const files = getAddonFiles(addon.license);

    for (const branch of branches) {
      const filename = filenameTemplate.replace("{branch}", branch);
      await prepareRepo(filename, url, branch, files);
    }
  }
}

async function processBasicAddons(
  type: string,
  addons: BasicAddon[],
  filenameTemplate: string,
) {
  console.log("");
  console.info(`Processing ${type} addons ...`.blue.text_bold);

  for (const addon of addons) {
    console.log("");
    console.info(`Processing addon "${addon.name}" ...`.blue.text_bold);

    const branches = collectBranches(addon.branch);
    const addonFilenameTemplate = filenameTemplate.replace("{id}", addon.id);

    const files = getAddonFiles(addon.license);

    for (const branch of branches) {
      const filename = addonFilenameTemplate.replace("{branch}", branch);
      await prepareRepo(filename, addon.url, branch, files);
    }
  }
}

await processBasicAddons(
  "regular",
  JAVA_ASSETS.repos.addons.regular,
  JAVA_ASSETS.templates.regular_addon_zip_name,
);

await processBasicAddons(
  "mod",
  JAVA_ASSETS.repos.addons.mods,
  JAVA_ASSETS.templates.mod_addon_zip_name,
);

if (isProduction) {
  console.log("");
  console.info("Optimizing images ...".green.text_bold);
  await run("./scripts/oxipng.sh");
}

console.log("");
console.info("Creating zips ...".blue.text_bold);
for (const info of zipStack) {
  const src = `${REPOS_DIR}/${info.name}`;

  let dest = JAVA_ASSETS.templates.zips_path.replace("{name}", info.name);
  dest = `${ZIPS_DIR}/${dest}`;

  console.info(`${src} -> ${dest} ...`.black.text_bold);

  await compress(src, dest, info.files);
}

console.log("");
console.info("All done!".green.text_bold);
