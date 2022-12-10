import { relative } from "path";
import { run } from "run_simple";

export async function compress(
  dir: string,
  archiveName: string,
  files?: string | string[],
): Promise<void> {
  if (files === undefined) {
    files = ["."];
  } else if (typeof files === "string") {
    files = [files];
  }

  await run(["zip", "-r9q", relative(dir, archiveName), ...files], {
    cwd: dir,
  });
}
