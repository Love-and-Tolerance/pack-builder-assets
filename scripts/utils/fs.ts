export function assertNotFound(
  err: unknown,
): asserts err is Deno.errors.NotFound {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}
