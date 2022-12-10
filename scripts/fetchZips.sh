#!/usr/bin/env bash

deno run --allow-env=DENO_ENV --allow-write --allow-read --allow-run=zip,git,./scripts/oxipng.sh scripts/fetchZips.ts
