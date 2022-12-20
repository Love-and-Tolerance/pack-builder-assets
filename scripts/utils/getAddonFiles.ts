import { ConditionalLicense } from "../../schemas/zod/java.ts";

export function getAddonFiles(
  license: ConditionalLicense | undefined,
): string | string[] {
  let copyLicense = false;

  if (typeof license === "boolean") {
    copyLicense = license;
  } else if (Array.isArray(license)) {
    const defaultTrigger = license.find((condition) =>
      condition.trigger === "DEFAULT"
    );

    copyLicense = defaultTrigger?.value === true;
  }

  return copyLicense ? ["assets", "LICENSE"] : "assets";
}
