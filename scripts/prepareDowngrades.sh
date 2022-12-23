#!/usr/bin/env bash

deno run --allow-env=DENO_ENV --allow-write --allow-read --allow-run=zip scripts/prepareDowngrades.ts
