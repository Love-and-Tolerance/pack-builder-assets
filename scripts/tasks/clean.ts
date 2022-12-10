import "console_colors";
import { assertNotFound } from "../utils/fs.ts";

export function clean(zipsDir: string, reposDir: string): void {
  console.log("");
  console.info("Cleaning up ...".blue.text_bold);

  try {
    console.info("- Deleting previous zips ...");
    Deno.removeSync(zipsDir, { recursive: true });
  } catch (err) {
    assertNotFound(err);
  }

  console.info("- Creating directories ...");
  Deno.mkdirSync(reposDir, { recursive: true });
  Deno.mkdirSync(zipsDir, { recursive: true });
}
