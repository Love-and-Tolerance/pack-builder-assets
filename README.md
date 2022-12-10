# Love & Tolerance Pack Builder resources

This repo contains scripts and assets for website pack builder

## Scripts

Scripts are written for [Deno](https://deno.land/), specifically for Linux environment, so to run them you may also need to have `git` and `zip` utils installed. Image optimization also requires [oxipng](https://github.com/shssoichiro/oxipng).

Scripts may have 2 files: `.ts` and `.sh`. The bash files just run the `.ts` files with Deno with necessary flags specified.

### `generateJsonSchemas`

Generates JSON schemas for assets json files. Schemas are written using [Zod](https://zod.dev/) validation library.

### `fetchZips`

Clones repos defined in `assets/java.json`, optimizes images if enabled and creates zips containing necessary files from them.

### `oxipng`

Optimizes all images in the repos using `oxipng`. Might take a long time on slow machines.
