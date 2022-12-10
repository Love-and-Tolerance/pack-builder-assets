import { ConditionalBranch } from "../../schemas/zod/java.ts";

export function collectBranches(
  branch: ConditionalBranch | undefined,
): string[] {
  let branches = ["HEAD"];

  if (typeof branch === "string") {
    branches = [branch];
  } else if (Array.isArray(branch)) {
    for (const condition of branch) {
      branches.push(condition.value);
    }
  }

  return branches;
}
