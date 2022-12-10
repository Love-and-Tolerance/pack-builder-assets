import { run } from "run_simple";
import { getDefaultBranch } from "../utils/git.ts";

export async function initRepo(
  dir: string,
  url: string,
  branch: string,
): Promise<void> {
  Deno.mkdirSync(dir, { recursive: true });

  let gitDir;

  try {
    gitDir = await run("git rev-parse --git-dir", { cwd: dir });
  } catch (_err) {
    // Intentional fall-through
  }

  if (gitDir === ".git") {
    const msg = `Pulling changes from branch "${branch}" ...`;
    console.info(msg.black.text_bold);

    if (branch === "HEAD") {
      branch = await getDefaultBranch(dir);
    }

    await run(["git", "reset", "--hard", branch], { cwd: dir });
    await run(["git", "pull", "origin", branch], { cwd: dir });
  } else {
    const msg = `Cloning new repo with branch "${branch}" ...`;
    console.info(msg.black.text_bold);

    await run(["git", "clone", url, dir]);

    if (branch === "HEAD") {
      branch = await getDefaultBranch(dir);
    }

    await run(["git", "checkout", branch], { cwd: dir });
  }
}
