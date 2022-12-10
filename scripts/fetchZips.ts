import "console_colors";
import { run } from "run_simple";
import { JavaAssetsSchema } from "../schemas/zod/java.ts";
import { clean } from "./tasks/clean.ts";
import { initRepo } from "./tasks/initRepo.ts";
import { collectBranches } from "./utils/collectBranches.ts";
import { compress } from "./utils/compress.ts";

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

const JAVA_ASSETS = (() => {
  const file = Deno.readTextFileSync("assets/java.json");
  const json = JSON.parse(file);
  return JavaAssetsSchema.parse(json);
})();

const ZIPS_DIR = JAVA_ASSETS.templates.zips_path.replace("{name}.zip", "");
const REPOS_DIR = ".temp/repos";

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

clean(ZIPS_DIR, REPOS_DIR);

console.log("");
console.info("Processing repos ...".blue.text_bold);

console.log("");
console.info("Processing base ...".blue.text_bold);
await prepareRepo("BASE", JAVA_ASSETS.repos.base.url, "HEAD", [
  "assets",
  "LICENSE",
  "pack.png",
  "pack.mcmeta",
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
    const filenameTemplate = JAVA_ASSETS.templates.exclusive_addon_zip_name
      .replace("{id_pos}", addon.id_pos.toString())
      .replace("{variant}", variant.id);

    for (const branch of branches) {
      const filename = filenameTemplate.replace("{branch}", branch);
      await prepareRepo(filename, url, branch, "assets");
    }
  }
}

console.log("");
console.info("Processing normal addons ...".blue.text_bold);

for (const addon of JAVA_ASSETS.repos.addons.normal) {
  console.log("");
  console.info(`Processing addon "${addon.name}" ...`.blue.text_bold);

  const branches = collectBranches(addon.branch);
  const filenameTemplate = JAVA_ASSETS.templates.normal_addon_zip_name
    .replace("{id}", addon.id);

  for (const branch of branches) {
    const filename = filenameTemplate.replace("{branch}", branch);
    await prepareRepo(filename, addon.url, branch, "assets");
  }
}

console.log("");
console.info("Processing mod addons ...".blue.text_bold);

for (const addon of JAVA_ASSETS.repos.addons.mods) {
  console.log("");
  console.info(`Processing addon "${addon.name}" ...`.blue.text_bold);

  const filename = JAVA_ASSETS.templates.mod_addon_zip_name
    .replace("{id}", addon.id);

  await prepareRepo(filename, addon.url, "HEAD", "assets");
}

if (isProduction) {
  console.log("");
  console.info("Optimizing images ...".green.text_bold);
  await run("./scripts/oxipng.sh");
}

console.log("");
console.info("Creating zips ...".blue.text_bold);
for (const info of zipStack) {
  const dir = `${REPOS_DIR}/${info.name}`;
  const name = JAVA_ASSETS.templates.zips_path.replace("{name}", info.name);

  console.info(`${dir} -> ${name} ...`.black.text_bold);

  await compress(dir, name, info.files);
}

console.log("");
console.info("All done!".green.text_bold);
