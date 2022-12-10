import { run } from "run_simple";

export async function getDefaultBranch(dir: string): Promise<string> {
  const output = await run("git rev-parse --abbrev-ref origin/HEAD", {
    cwd: dir,
  });

  return output.replace("origin/", "");
}
