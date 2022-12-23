import { z, ZodTypeAny } from "zod";

export function readJson<T extends ZodTypeAny>(
  path: string,
  schema: T,
): z.infer<T> {
  const file = Deno.readTextFileSync(path);
  const json = JSON.parse(file);

  return schema.parse(json);
}
