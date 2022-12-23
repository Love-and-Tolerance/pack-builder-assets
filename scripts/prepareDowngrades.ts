import "console_colors";
import { DowngradesSchema } from "../schemas/zod/downgrades.ts";
import { compress } from "./utils/compress.ts";
import { assertNotFound } from "./utils/fs.ts";
import { readJson } from "./utils/json.ts";

export function clean(zipsDir: string): void {
  console.log("");
  console.info("Cleaning up ...".blue.text_bold);

  try {
    console.info("- Deleting previous zips ...");
    Deno.removeSync(zipsDir, { recursive: true });
  } catch (err) {
    assertNotFound(err);
  }

  console.info("- Creating directories ...");
  Deno.mkdirSync(zipsDir, { recursive: true });
}

console.log("");
console.info("Reading json files ...".blue.text_bold);

const DOWNGRADES = readJson("assets/downgrades/java.json", DowngradesSchema);
const ZIPS_DIR = DOWNGRADES.templates.zips_path.replace("{name}.zip", "");

clean(ZIPS_DIR);

console.log("");
console.info("Creating downgrade zips ...".blue.text_bold);
for (const version of DOWNGRADES.pack_formats.versions) {
  const name = DOWNGRADES.templates.format_name
    .replace("{version}", version);

  const src = `downgrades/${name}`;
  const dest = DOWNGRADES.templates.zips_path
    .replace("{name}", name);

  console.info(`${src} -> ${dest} ...`.black.text_bold);

  await compress(src, dest);
}

console.log("");
console.info("All done!".green.text_bold);
