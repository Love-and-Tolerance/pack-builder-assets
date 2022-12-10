import { zodToJsonSchema } from "zod-to-json-schema";
import { BedrockAssetsSchema } from "../schemas/zod/bedrock.ts";
import { JavaAssetsSchema } from "../schemas/zod/java.ts";

const $javaAssets = zodToJsonSchema(JavaAssetsSchema);
const $bedrockAssets = zodToJsonSchema(BedrockAssetsSchema);

const $javaAssetsString = JSON.stringify($javaAssets, null, 2);
const $bedrockAssetsString = JSON.stringify($bedrockAssets, null, 2);

Deno.writeTextFileSync("schemas/json/java.json", $javaAssetsString);
Deno.writeTextFileSync("schemas/json/bedrock.json", $bedrockAssetsString);
